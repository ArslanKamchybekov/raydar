import { ArrowRight, Github, UploadCloud } from 'lucide-react';
import Link from "next/link";
import { Button } from "../ui/button";
import { currentUser } from '@clerk/nextjs/server';
import AnimatedRadar from './animate-radar';

export default async function HeroSection() {
    const user = await currentUser();
    return (
        <section className='flex flex-col items-center justify-center leading-6 mt-[3rem]' aria-label="Nextjs Starter Kit Hero">
            <div className="flex flex-col min-h-screen items-center mt-[2.5rem] p-3 w-full">
                <h1 className="scroll-m-20 max-w-[800px] text-6xl font-bold tracking-tight text-center bg-gradient-to-t from-[#ADD8E6] to-[#00008B] bg-clip-text text-transparent dark:from-[#ADD8E6] dark:to-[#00008B] dark:bg-clip-text dark:text-transparent">
                    Find What You've Lost on Campus with Raydar
                </h1>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg text-center mt-4 dark:text-gray-400">
                    Raydar is the smart lost and found platform for UIC students. Upload images, get matches, and find your
                    belongings faster.
                </p>
                <div className="flex gap-4 mt-6">
                    <Link href={user ? "/dashboard/upload-lost" : "/sign-in"}
                     className="mt-2">
                        <Button size="lg">
                            <UploadCloud size={24} />
                            Upload Lost Item
                        </Button>
                    </Link>
                    <Link href="/dashboard/feed" 
                    className="mt-2">
                        <Button size="lg" variant="outline">
                            Search Database
                        </Button>
                    </Link>
                </div>  
                <div className="relative mt-8">
                    <AnimatedRadar />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>              
            </div>
        </section>
    );
}