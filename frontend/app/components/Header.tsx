import Honeycomb from "@/app/components/Honeycomb";

export default function Header() {
    return (
        <header className={`py-12`}>
            <div className={`mx-auto container flex items-center gap-4`}>
                <Honeycomb strokeWidth={8} className={`h-8 text-yellow-500`}/>
                <h1 className={`text-3xl font-semibold leading-10 tracking-tight`}>honeybee</h1>
            </div>
        </header>
    )
}