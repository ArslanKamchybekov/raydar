import NavBar from "@/components/wrapper/navbar";
import AboutUs from "./_components/about-us";
import ContactForm from "./_components/contact-form";
import { HelpCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Have a question? Reach out to our team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ContactForm />
          <AboutUs />
        </div>
      </div>
    </>
  );
}
