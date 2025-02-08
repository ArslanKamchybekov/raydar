"use client"
import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="py-8 lg:py-12">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div>
                            <p className="font-medium">Navigation</p>
                            <ul className="mt-6 space-y-4 text-sm">
                                <li>
                                    <Link href="/lost-items" className="transition hover:opacity-75">
                                        Lost Items
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/found-items" className="transition hover:opacity-75">
                                        Found Items
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/report" className="transition hover:opacity-75">
                                        Report Item
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/how-it-works" className="transition hover:opacity-75">
                                        How It Works
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-medium">Support</p>
                            <ul className="mt-6 space-y-4 text-sm">
                                <li>
                                    <Link href="/faq" className="transition hover:opacity-75">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="transition hover:opacity-75">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/safety-tips" className="transition hover:opacity-75">
                                        Safety Tips
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-medium">Development Team</p>
                            <ul className="mt-6 space-y-4 text-sm">
                                <li>
                                    <Link 
                                        href="https://www.linkedin.com/in/arslankamchybekov/" 
                                        target="_blank" 
                                        className="flex items-center gap-2 transition hover:opacity-75"
                                    >
                                        <Linkedin size={16} />
                                        Arslan Kamchybekov
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="https://www.linkedin.com/in/akuppili/" 
                                        target="_blank" 
                                        className="flex items-center gap-2 transition hover:opacity-75"
                                    >
                                        <Linkedin size={16} />
                                        Anirudh Kupili
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="https://www.linkedin.com/in/isaac-alazar-17b949311/" 
                                        target="_blank" 
                                        className="flex items-center gap-2 transition hover:opacity-75"
                                    >
                                        <Linkedin size={16} />
                                        Isaac Alazar
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="https://www.linkedin.com/in/joshjonathanjungjr/" 
                                        target="_blank" 
                                        className="flex items-center gap-2 transition hover:opacity-75"
                                    >
                                        <Linkedin size={16} />
                                        Josh Jung
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="https://www.linkedin.com/in/pranav-shridhar/" 
                                        target="_blank" 
                                        className="flex items-center gap-2 transition hover:opacity-75"
                                    >
                                        <Linkedin size={16} />
                                        Pranav Shridhar
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t pt-8">
                        <ul className="flex flex-wrap gap-4 text-xs">
                            <li>
                                <Link href="/terms" className="transition hover:opacity-75">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="transition hover:opacity-75">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/guidelines" className="transition hover:opacity-75">
                                    Community Guidelines
                                </Link>
                            </li>
                        </ul>

                        <p className="mt-8 text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Raydar. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}