import {useAuth} from "react-oidc-context";

export default function LogInButton() {
    const auth = useAuth();
    return (
        <button
            onClick={() => auth.signinRedirect()}
            className={`rounded-md px-3 py-2 border border-button-secondary-border bg-button-secondary-background hover:bg-button-secondary-background-hover text-button-secondary-foreground text-sm`}>
            <span>Log In</span>
        </button>
    )
}