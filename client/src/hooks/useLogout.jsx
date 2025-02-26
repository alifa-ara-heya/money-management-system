import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";

export default function useLogout() {
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const logout = async () => {
        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                toast.error("No active session found.");
                return;
            }

            // ✅ Send request to backend to remove session
            await axiosPublic.post("/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // ✅ Clear localStorage
            localStorage.removeItem("authToken");

            toast.success("Logged out successfully");

            // ✅ Redirect to login page
            navigate("/login");

        } catch (error) {
            console.error("Logout Failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return logout;
}
