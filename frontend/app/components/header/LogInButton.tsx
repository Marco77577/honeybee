import {useAuth} from "react-oidc-context";
import SecondaryButton from "@/app/components/button/SecondaryButton";

export default function LogInButton() {
    const auth = useAuth();
    return <SecondaryButton
        onClick={() => auth.signinRedirect()}
        title="Log In"/>
}