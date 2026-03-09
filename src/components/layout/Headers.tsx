import ToggleDark from "@/src/components/layout/ToggleDark";
import Search from "@/src/components/layout/Search";

export default function Headers() {
    return (
        <header className="flex items-center w-full px-8 py-5 bg-surface dark:bg-dark-surface justify-between md:justify-end">
            
            <div className="text-gray-500 md:hidden">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                    </svg>
                </span>
            </div>

            <div className="w-full max-w-md relative ml-4 md:ml-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                    </svg>
                </div>
                <Search />
            </div>
            <ToggleDark></ToggleDark>
        </header>
    );
}