export default function Login() {
    return (
        <div className={`flex flex-col gap-4`}>
            <div>
                <h1 className={`text-5xl`}>Not an Accountant?</h1>
                <p className={`text-on-background!`}>Then this is your application.</p>
            </div>
            <div>
                <a href="/register" className={`px-4 py-1 rounded-lg bg-accent text-white`}>Sign in</a>
            </div>
        </div>
    );
}
