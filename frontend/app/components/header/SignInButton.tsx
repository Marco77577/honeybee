import {useAuth} from "react-oidc-context";

export default function SignInButton() {
    const auth = useAuth();
    return (
        <button
            onClick={() => auth.signinRedirect()}
            className={`rounded-md px-3 py-2 border border-button-border bg-button-background hover:bg-button-background-hover text-button-foreground text-sm`}>
            <span>Sign In</span>
        </button>
    )
}