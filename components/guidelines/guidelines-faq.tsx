"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const guidelines = [
  {
    section: "1. Respectful and Honest Participation",
    details: [
      "Only submit real lost or found items.",
      "Do not submit false claims, prank posts, or misleading images.",
      "Be courteous when interacting with others in comments or messages.",
    ],
  },
  {
    section: "2. Accurate and Clear Submissions",
    details: [
      "When reporting a lost item, provide clear details (description, time, place, distinguishing features).",
      "When posting a found item, upload a clear image and accurate information.",
      "Avoid submitting blurry or irrelevant images.",
    ],
  },
  {
    section: "3. No Unauthorized Content",
    details: [
      "Do not scrape or copy Snapchat, Discord, or social media posts without permission.",
      "Avoid posting copyrighted or offensive material.",
      "Submissions must adhere to university policies and legal standards.",
    ],
  },
  {
    section: "4. AI and System Integrity",
    details: [
      "Use the sketch-based search feature responsibly—upload relevant sketches to find items.",
      "Do not attempt to manipulate or exploit the AI system for non-lost-and-found purposes.",
      "Report any system issues, abuse, or false positives to the admin team.",
    ],
  },
  {
    section: "5. Campus-Specific Use",
    details: [
      "This platform is designed for UIC students and staff; external users should not post items.",
      "Use official campus locations and building names when submitting location details.",
      "If you find an item in a restricted area, follow campus lost & found policies.",
    ],
  },
  {
    section: "6. Reporting and Enforcement",
    details: [
      "Users can report inappropriate or false submissions.",
      "Repeated violations may result in temporary or permanent bans from the platform.",
      "Admins reserve the right to remove any posts that violate guidelines.",
    ],
  },
];

export default function GuidelinesFAQ() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="mx-auto w-fit rounded-full border border-blue-200/80 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/50 px-4 py-1 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              <HelpCircle className="h-4 w-4" />
              <span>Guidelines</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            AI-Powered Lost & Found Community Guidelines
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Welcome to the AI-Powered Lost & Found platform for UIC! Our goal is
            to make it easier for students to recover lost belongings using
            AI-driven search, sketch-based identification, and community
            contributions.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {guidelines.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="border border-gray-200 dark:border-gray-800 rounded-lg px-2 bg-white dark:bg-gray-900 shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline py-4 px-2">
                  <span className="font-medium text-left text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {item.section}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-4">
                  <ul className="list-disc pl-4 space-y-2 text-gray-600 dark:text-gray-400">
                    {item.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
