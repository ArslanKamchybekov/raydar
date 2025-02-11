import { Search, UploadCloud } from 'lucide-react';
import Link from "next/link";
import { Button } from "../ui/button";
import { currentUser } from '@clerk/nextjs/server';
import AnimatedRadar from './animate-radar';

export default async function HeroSection() {
    const user = await currentUser();

    return (
        <section 
            className="flex flex-col items-center justify-center leading-6 mt-12 px-4 sm:px-6"
            aria-label="Raydar Lost and Found Hero Section"
        >
            <div className="flex flex-col items-center justify-center w-full max-w-4xl py-8 mx-auto">
                {/* Title */}
                <h1 className="scroll-m-20 max-w-[800px] text-6xl font-bold tracking-tight text-center bg-gradient-to-t from-[#ADD8E6] to-[#00008B] bg-clip-text text-transparent dark:from-[#ADD8E6] dark:to-[#00008B] dark:bg-clip-text dark:text-transparent">
                    Find What You&apos;ve Lost on Campus with Raydar
                </h1>

                {/* Description */}
                <p className="mx-auto max-w-[600px] text-gray-500 text-center mt-4 sm:text-lg dark:text-gray-400">
                    Raydar is the smart lost and found platform for UIC students. Upload images, get matches, and find your belongings faster.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <Link href={user ? "/dashboard/upload-lost" : "/sign-in"}>
                        <Button size="lg" className="flex items-center gap-2">
                            <UploadCloud size={20} />
                            Upload Lost Item
                        </Button>
                    </Link>
                    <Link href="/dashboard/feed">
                        <Button size="lg" variant="outline" className="flex items-center gap-2">
                            <Search size={20} />
                            Search Database
                        </Button>
                    </Link>
                </div>  

                {/* Animated Radar */}
                <div className="relative w-full flex justify-center mt-8 overflow-hidden">
                    <AnimatedRadar />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" />
                </div> 
            </div>
        </section>
    );
}
