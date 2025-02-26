
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";

export default function Login() {
    // const { signIn } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [formData, setFormData] = useState({
        identifier: "", // Can be email or mobile number
        pin: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login Submitted", formData);

        try {
            // const securePin = formData.pin + "*"; // Append a character to make it 6
            // await signIn(formData.email, securePin);
            // const user = result.user;
            // console.log('sign-in user', user);

            // navigate('/dashboard')
            // reset();
            const response = await axiosPublic.post("/login", {
                identifier: formData.identifier, // Can be email or mobile
                pin: formData.pin,  // Send plain PIN (Backend will compare it)
            });
            toast.success("Logged in successfully");

            console.log("User Role:", response.data.user.role);
            console.log("Balance:", response.data.user.balance);

        } catch (error) {
            console.error("Login Failed:", error);
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Email or Mobile Number</label>
                        <input
                            type="text"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            placeholder="Enter Email or Mobile Number"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">5-digit PIN</label>
                        <input
                            type="password"
                            name="pin"
                            value={formData.pin}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            maxLength="5"
                            pattern="\d{5}"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                    <p>Don&apos;t have an account? <Link className="text-blue-600" to='/register'>Register</Link> </p>
                </form>
            </div>
        </div>
    );
}