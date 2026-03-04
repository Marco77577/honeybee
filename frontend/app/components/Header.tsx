import Honeycomb from "@/app/components/Honeycomb";

export default function Header() {
    return (
        <header>
            <div className={`mx-auto container flex items-center justify-between py-4`}>
                <div className={`flex items-center gap-3`}>
                    <Honeycomb strokeWidth={8} className={`h-8 text-honey`}/>
                    <h1 className={`text-3xl`}>honeybee</h1>
                </div>
                <div className={`flex items-center gap-3`}>
                    <button className={`rounded-md px-3 py-2 border border-button-secondary-border bg-button-secondary-background hover:bg-button-secondary-background-hover text-button-secondary-foreground text-sm`}>Log In</button>
                    <button className={`rounded-md px-3 py-2 border border-button-border bg-button-background hover:bg-button-background-hover text-button-foreground text-sm`}>Sign Up</button>
                </div>
            </div>
        </header>
    )
}