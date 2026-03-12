import {useAuth} from "react-oidc-context";
import PrimaryButton from "@/app/components/button/PrimaryButton";

export default function SignInButton() {
    const auth = useAuth();
    return <PrimaryButton
        onClick={() => auth.signinRedirect()}
        title="Sign In"/>
}