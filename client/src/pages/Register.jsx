import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        pin: "",
        mobile: "",
        email: "",
        accountType: "Agent",
        nid: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted", formData);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div>
                        <label className="block font-medium">Mobile Number</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
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
                    <div>
                        <label className="block font-medium">Account Type</label>
                        <select
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        >
                            <option value="Agent">Agent</option>
                            <option value="User">User</option>
                        </select>
                    </div>
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
