import { Loader2 } from "lucide-react";
import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

import { WelcomeMsg } from "@/components/welcome-msg";
import { Filters } from "./filters";
import { HeaderLogo } from "@/components/header-logo"
import { Navigation } from "./navigation";

export const Header = () => {
    return ( 
        <header className="bg-gradient-to-b from-blue-700 to-blue-500
        px-4 py-8 lg:px-14 pb-36">

            <div className="max-w-screen-2xl mx-auto">  {/*this is so the contents in this div only expand up to a certain screen length */}
                <div className="w-full flex items-center justify-between mb-14">
                    <div className = "flex items-center lg:gap-x-16">
                        <HeaderLogo />
                        <Navigation />
                    </div>
                    <ClerkLoaded>
                        <UserButton afterSignOutUrl="/" />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin text-muted-foreground text-slate-400"></Loader2>
                    </ClerkLoading>
                </div>
                <WelcomeMsg />
                <Filters />
            </div>
        </header>
    );
};