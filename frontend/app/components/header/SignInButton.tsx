export default function SignInButton() {
    return (
        <button
            className={`rounded-md px-3 py-2 border border-button-border bg-button-background hover:bg-button-background-hover text-button-foreground text-sm`}>
            <span>Sign In</span>
        </button>
    )
}