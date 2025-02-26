import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";

export default function Register() {
    const { createUser, setUser, updateUserProfile } = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPublic = useAxiosPublic();

    const [showPin, setShowPin] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        name: "",
        pin: "",
        mobile: "",
        email: "",
        role: "Agent",
        nid: ""
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Submitted", formData);

        if (!/^\d{5}$/.test(formData.pin)) {
            setErrorMsg("PIN must be exactly 5 digits.");
            return;
        }

        setErrorMsg(""); // Clear previous errors

        // Append a special character to meet Firebase's 6-character requirement
        // const securePin = formData.pin + "*";

        try {
            // Create user in Firebase
            // const result = await createUser(formData.email, securePin);
            // const createdUser = result.user;

            // // Update profile
            // await updateUserProfile({ displayName: formData.name });

            // // Refresh user state
            // setUser({ ...createdUser, displayName: formData.name });

            const userInfo = {
                name: formData.name,
                email: formData.email,
                pin: formData.pin, // Store securely in the database
                mobile: formData.mobile,
                nid: formData.nid,
                role: formData.role, // Ensure consistency
            };

            // Save user info to the database
            const response = await axiosPublic.post('/users', userInfo);
            console.log(response);

            // Show success message
            toast.success('Registration successful.');
            // const from = location?.state?.from?.pathname || '/';
            // navigate("/");
            // navigate(from, { replace: true });

        } catch (error) {
            console.log("Error in registration", error);
            toast.error(error.message);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">

                        {/* name */}
                        <div>
                            <label className="block font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300  rounded mt-1"
                                required
                            />
                        </div>

                        {/* pin */}
                        <div className="relative">
                            <label className="block font-medium">5-digit PIN</label>
                            <input
                                type={showPin ? 'number' : 'password'}
                                name="pin"
                                placeholder="Please provide 5 digit PIN number"
                                value={formData.pin}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                maxLength="5"
                                minLength="5"
                                pattern="\d{5}" // Enforces 5-digit PIN
                                required
                            />
                            {
                                errorMsg && <p className='text-red-600 text-xs mt-6'>{errorMsg}</p>
                            }
                            <button
                                type="button"
                                onClick={() => setShowPin(!showPin)}
                                className='text-sm text-gray-500 absolute right-2 top-10'>
                                {
                                    showPin ? <FaEyeSlash /> : <FaEye />
                                }
                            </button>
                            {/* {
                                errorMsg && <p className='text-red-600 text-xs mt-6'>{errorMsg}</p>
                            } */}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {/* mobile number */}
                        <div>
                            <label className="block font-medium">Mobile Number</label>
                            <input
                                type="number"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>
                        {/* email */}
                        <div>
                            <label className="block font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>
                    </div>

                    {/* account type */}
                    <div>
                        <label className="block font-medium">Account Type</label>
                        <select
                            name="accountType"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        >
                            <option value="Agent">Agent</option>
                            <option value="User">User</option>
                        </select>
                    </div>

                    {/* nid */}
                    <div>
                        <label className="block font-medium">NID</label>
                        <input
                            type="text"
                            name="nid"
                            value={formData.nid}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Register
                    </button>
                    <p>Already have an account? <Link className="text-blue-600" to='/login'>Sign In</Link> </p>

                </form>
            </div>
        </div>
    );
}
