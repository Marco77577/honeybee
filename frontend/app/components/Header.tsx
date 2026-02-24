import Honeycomb from "@/app/components/Honeycomb";

export default function Header() {
    return (
        <header className={`py-12`}>
            <div className={`mx-auto container flex items-center gap-4`}>
                <Honeycomb strokeWidth={8} className={`h-8 text-honey`}/>
                <h1 className={`text-3xl`}>honeybee</h1>
            </div>
        </header>
    )
}