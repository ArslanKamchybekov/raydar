"use client";

import { HelpCircle } from "lucide-react";
import Navbar from "@/components/wrapper/navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Contact Information",
    answer:
      "For questions about our Privacy Policy, Terms of Service, or general inquiries, contact us at: contact@raydar.tech",
  },
  {
    question: "Privacy Policy Overview",
    answer:
      "Last Updated: February 11, 2025. This Privacy Policy explains how Raydar collects, uses, and protects your personal information when you use our lost and found service platform.",
  },
  {
    question: "1. Information Collection",
    answer:
      "We collect: (1) Authentication data through Google, GitHub, Facebook, or email sign-in, (2) Item data including images, descriptions, and location information, (3) Device information for service optimization, and (4) Usage data to improve our platform.",
  },
  {
    question: "2. Data Usage & Storage",
    answer:
      "Your information helps us: (1) Manage lost and found items, (2) Improve user experience, (3) Send relevant notifications, and (4) Maintain platform security. We retain data only as long as necessary or required by law.",
  },
  {
    question: "3. Information Sharing",
    answer:
      "We may share data with: (1) Trusted service providers, (2) Legal authorities when required, and (3) Other parties during business transfers. We implement security measures to protect your data.",
  },
  {
    question: "Terms of Service Overview",
    answer:
      "These Terms of Service govern your use of Raydar's lost and found platform. By using our service, you agree to these terms and must be at least 13 years old.",
  },
  {
    question: "1. User Responsibilities",
    answer:
      "Users must: (1) Provide accurate information, (2) Maintain account security, (3) Report items truthfully, and (4) Respect other users' privacy and rights.",
  },
  {
    question: "2. Platform Rules",
    answer:
      "Prohibited activities include: (1) Posting false or misleading information, (2) Harassing other users, (3) Attempting unauthorized access, and (4) Using the platform for illegal purposes.",
  },
  {
    question: "3. Service Limitations",
    answer:
      "Raydar: (1) Does not guarantee item recovery, (2) Is not responsible for user interactions, (3) May modify or terminate service at any time, and (4) Reserves the right to remove content or accounts that violate our terms.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-950">
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="mx-auto w-fit rounded-full border border-blue-200/80 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/50 px-4 py-1 mb-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <HelpCircle className="h-4 w-4" />
                  <span>Privacy and Terms of Service</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Privacy and Terms of Service
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                Everything you need to know about Raydar&apos;s Privacy Policy
                and Terms of Service. Can&apos;t find the answer you&apos;re
                looking for? Reach out to our team.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index + 1}`}
                    className="border border-gray-200 dark:border-gray-800 rounded-lg px-2 bg-white dark:bg-gray-900 shadow-sm"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 px-2">
                      <span className="font-medium text-left text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 pb-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
