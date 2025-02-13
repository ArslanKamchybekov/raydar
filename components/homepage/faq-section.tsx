"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is Raydar?",
    answer:
      "Raydar is a lost and found platform that helps connect people who have lost items with those who have found them.",
  },
  {
    question: "How does it work?",
    answer:
      "Users can report found items or search for lost items. Our platform uses advanced matching algorithms to help connect lost items with their owners.",
  },
  {
    question: "Is it free to use?",
    answer: "Yes, Raydar is completely free to use for all users.",
  },
  {
    question: "How do I report a found item?",
    answer:
      "Simply click on 'Report Found Item' in the navigation menu, fill out the item details, and submit the form.",
  },
  {
    question: "How can I search for my lost item?",
    answer:
      "Use the 'Find Lost Items' feature to search through our database of found items. You can also upload a sketch or photo of your lost item.",
  },
];

const FAQSection: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="mx-auto w-fit rounded-full border border-blue-200/80 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/50 px-4 py-1 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. If you can&apos;t find what
            you&apos;re looking for, feel free to contact us.
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
  );
};

export default FAQSection;
