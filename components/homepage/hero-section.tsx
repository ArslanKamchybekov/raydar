import { ArrowRight, Github } from 'lucide-react';
import Link from "next/link";
import { BorderBeam } from "../magicui/border-beam";
import { Button } from "../ui/button";
import Image from 'next/image';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';

export default function HeroSection() {
    return (
        <section className='flex flex-col items-center justify-center leading-6 mt-[3rem]' aria-label="Nextjs Starter Kit Hero">
            <div className="flex flex-col min-h-screen items-center mt-[2.5rem] p-3 w-full">
                <h1 className="scroll-m-20 max-w-[800px] text-6xl font-bold tracking-tight text-center text-blue-400">
                    Find What You've Lost on Campus with Raydar
                </h1>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg text-center mt-4 dark:text-gray-400">
                    Raydar is the smart lost and found platform for UIC students. Upload images, get matches, and find your
                    belongings faster.
                </p>
                <div className="flex gap-4 mt-6">
                    <Link href="/upload" className="mt-2">
                        <Button size="lg">Upload Lost Item</Button>
                    </Link>
                    <Link href="/search" className="mt-2">
                        <Button size="lg" variant="outline">
                            Search Database
                        </Button>
                    </Link>
                </div>
                <br />
                <div className="flex justify-center items-center gap-3">
                    <Link
                        href=""
                        target='_blank'
                        className='animate-buttonheartbeat border p-2 rounded-full mt-5 hover:dark:bg-black hover:cursor-pointer'
                        aria-label="View on Github (opens in a new tab)"
                    >
                        <Github className='w-5 h-5' aria-hidden="true" />
                    </Link>
                </div>
                
                {/* Updated circular container */}
                <div className="relative flex justify-center mt-7">
                    <div className="relative rounded-full overflow-hidden w-[300px] h-[300px] border-4 border-white">
                        {/* Light mode image */}
                        <div className="absolute inset-0 dark:hidden">
                            <Image
                                src="/uic.png"
                                alt="UIC Logo"
                                fill
                                priority={true}
                                className="object-cover"
                            />
                        </div>
                        
                        {/* Dark mode image */}
                        <div className="absolute inset-0 hidden dark:block">
                            <Image
                                src="/uic.png"
                                alt="UIC Logo Dark Mode"
                                fill
                                priority={true}
                                className="object-cover"
                            />
                        </div>
                        
                        {/* Border beam */}
                        <BorderBeam 
                            size={300} 
                            duration={12} 
                            delay={9}
                            borderWidth={8}
                            className="absolute inset-0"
                            colorFrom="#ADD8E6"
                            colorTo="#00008B"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}