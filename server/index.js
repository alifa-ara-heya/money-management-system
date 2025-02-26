require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',
        //todo: add your live links
    ],
    credentials: true
}));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kvlax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const db = client.db('MoneyDB')
        const usersCollection = db.collection('users');

        //auth (jwt) related apis


        const verifyToken = async (req, res, next) => {
            try {
                if (!req.headers.authorization) {
                    return res.status(401).send({ message: "Unauthorized Access." });
                }

                const token = req.headers.authorization.split(" ")[1];

                // 🔐 Verify JWT
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
                    if (err) {
                        return res.status(401).send({ message: "Unauthorized Access" });
                    }

                    // ✅ Check if the token matches the one stored in the database
                    const user = await usersCollection.findOne({ _id: decoded.id });

                    if (!user || user.sessionToken !== token) {
                        return res.status(401).send({ message: "Invalid Session. Please log in again." });
                    }

                    req.user = decoded;
                    next();
                });
            } catch (error) {
                console.error("Token verification error:", error);
                res.status(500).send({ message: "Internal server error" });
            }
        };

        app.post("/logout", verifyToken, async (req, res) => {
            try {
                // ✅ Remove session token from the database
                await usersCollection.updateOne(
                    { _id: req.user.id },
                    { $unset: { sessionToken: "" } }
                );

                res.status(200).json({ message: "Logged out successfully" });

            } catch (error) {
                console.error("Logout error:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });



        //adding user in DB
        app.post('/users', async (req, res) => {
            try {
                const { name, email, pin, mobile, nid, role } = req.body;

                // Check if email, mobile, or NID already exists
                const existingUser = await usersCollection.findOne({
                    $or: [{ email }, { mobile }, { nid }]
                });

                if (existingUser) {
                    return res.status(409).json({ message: "Email, Mobile, or NID already in use" });
                }

                // 🔒 Hash the PIN before storing
                const saltRounds = 10;
                const hashedPin = await bcrypt.hash(pin, saltRounds);

                // Assign initial balance based on role
                const initialBalance = role === "Agent" ? 100000 : 40;

                const user = {
                    name,
                    email,
                    pin: hashedPin, // Store hashed PIN
                    mobile,
                    nid,
                    role,
                    balance: initialBalance, // Assign balance
                };

                const result = await usersCollection.insertOne(user);
                res.status(201).json({ message: "User registered successfully", data: result });

            } catch (error) {
                console.error("Error in registration:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });


        app.post("/login", async (req, res) => {
            try {
                const { identifier, pin } = req.body;

                // Find user by email or mobile number
                const user = await usersCollection.findOne({
                    $or: [{ email: identifier }, { mobile: identifier }]
                });

                if (!user) {
                    return res.status(401).json({ message: "User not found" });
                }

                // 🔐 Compare entered PIN with stored hashed PIN
                const isMatch = await bcrypt.compare(pin, user.pin);
                if (!isMatch) {
                    return res.status(401).json({ message: "Invalid PIN" });
                }

                // ✅ Generate JWT Token (Session Token)
                const sessionToken = jwt.sign(
                    { id: user._id, role: user.role },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "365d" }
                );

                // ✅ Store session token in the database (Invalidate previous sessions)
                await usersCollection.updateOne(
                    { _id: user._id },
                    { $set: { sessionToken: sessionToken } }
                );

                // ✅ Return JWT to frontend
                res.status(200).json({
                    message: "Login successful",
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile,
                        role: user.role,
                        balance: user.balance,
                    },
                    token: sessionToken
                });

            } catch (error) {
                console.error("Login error:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });




        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Money Management Server.')
})

app.listen(port, () => {
    console.log('My simple server is running at', port);
})