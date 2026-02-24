"use client"

import {useAuth} from "react-oidc-context";
import {useEffect} from "react";

function SignIn() {
    const auth = useAuth();

    useEffect(() => {
        auth.signinSilent().then();
    }, []);

    if (auth.isAuthenticated) {
        return (
            <div>
                <p>You are already signed in.</p>
                <p>{auth.user?.profile.name}</p>
                <p>{auth.user?.profile.email}</p>
                <p>{auth.user?.access_token}</p>
                <button onClick={() => auth.removeUser()}
                        className={`px-4 py-1 rounded-lg bg-accent text-white`}>
                    Logout
                </button>
            </div>
        )
    } else {
        return (
            <button onClick={() => auth.signinRedirect()}
                    className={`px-4 py-1 rounded-lg bg-accent text-white`}>
                Sign in
            </button>
        )
    }
}

export default function Login() {
    return (
        <div className={`flex flex-col gap-4`}>
            <div>
                <h1 className={`text-5xl`}>Not an Accountant?</h1>
                <p className={`text-on-background!`}>Then this is your application.</p>
            </div>
            <div>
                <SignIn/>
            </div>
        </div>
    )
}
