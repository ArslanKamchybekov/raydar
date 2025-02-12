import NavBar from "@/components/wrapper/navbar";
import AboutUs from "./_components/about-us";
import ContactForm from "./_components/contact-form";

export default function ContactPage() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold text-center mb-3">Contact Us</h1>
        <p className="leading-7 text-sm text-gray-600 text-center dark:text-gray-400 mb-8">
          Send any important inquiries or questions you may have. We will get
          back to you as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <ContactForm />
          <AboutUs />
        </div>
      </div>
    </>
  );
}
