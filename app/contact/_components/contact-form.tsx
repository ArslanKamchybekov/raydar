"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Mail, User, MessageSquare, Send } from "lucide-react";
import { sendEmail } from "@/app/actions/contact";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
      };

      const result = await sendEmail(data);

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        duration: 2000, // 2 seconds
      });

      event.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 shadow-lg backdrop-blur-sm bg-white/40 dark:bg-black/40">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            className="bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-primary"
            placeholder="Your Name"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-primary"
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            required
            className="bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-primary min-h-[120px]"
            placeholder="How can we help you?"
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
