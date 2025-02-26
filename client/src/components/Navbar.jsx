import useLogout from "../hooks/useLogout";


export default function Navbar() {
    const logout = useLogout();

    return (
        <nav className="p-4 bg-blue-600 text-white flex justify-between">
            <h1 className="text-lg font-bold">My App</h1>
            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
                Logout
            </button>
        </nav>
    );
}
