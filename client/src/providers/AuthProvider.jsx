import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { app } from "../firebase/firebase.config";


export const AuthContext = createContext(null);
const auth = getAuth(app);


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    //creating user
    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    //sign in existing user
    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    //log out user
    const logOut = () => {
        setLoading(true)
        return signOut(auth)
    }


    const updateUserProfile = updatedData => {
        return updateProfile(auth.currentUser, updatedData);
    }

    const authInfo = {
        user,
        setUser,
        loading,
        createUser,
        signIn,
        logOut,
        updateUserProfile
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser) // Update the user state
            if (currentUser) {
                const userInfo = { email: currentUser.email }

                console.log(userInfo); // Example: { email: "user@example.com" }

                // get token and store in client side

                // axiosPublic.post('/jwt', userInfo)
                //     .then(res => {
                //         if (res.data.token) {
                //             localStorage.setItem('access-token', res.data.token)
                //             // console.log('Token saved to local storage', res.data.token);
                //             setLoading(false)
                //         }
                //     })

            } else {
                //remove token
                // localStorage.removeItem('access-token')
                // setLoading(false) // Stop showing a loading spinner
            }
            // console.log('current user email', currentUser);
        })

        return () => {
            unSubscribe(); //cleanUp listener
        }
    })

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;