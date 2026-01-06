"use client";

import { useState, useRef } from "react";
import { Mail, Github, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { siteMetadata } from "@/data/metadata";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS = 3; // Max 3 submissions per minute

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    description: "Direct contact",
    value: siteMetadata.email,
    href: `mailto:${siteMetadata.email}`,
  },
  {
    icon: Github,
    label: "GitHub",
    description: "Code & projects",
    value: "View Profile",
    href: siteMetadata.social.github,
    external: true,
  },
];

export default function ContactPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "", // Spam protection
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submissionTimestamps = useRef<number[]>([]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name is optional - no validation needed

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check rate limiting
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    // Filter out timestamps older than the rate limit window
    submissionTimestamps.current = submissionTimestamps.current.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
    );
    return submissionTimestamps.current.length >= MAX_SUBMISSIONS;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's likely a bot
    if (formData.honeypot) {
      return;
    }

    // Rate limiting check
    if (checkRateLimit()) {
      addToast(
        "Too many submissions. Please wait a minute before trying again.",
        "error",
        5000,
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Record the submission timestamp for rate limiting
    submissionTimestamps.current.push(Date.now());

    // In a real app, you would send this to an API endpoint
    console.log("Form submitted:", formData);

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "", honeypot: "" });

    // Show success toast notification
    addToast(
      "Message sent successfully! I'll get back to you soon.",
      "success",
      5000,
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="section">
      <div className="container-content max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 text-ocean-800 dark:text-sand-500 mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-ocean-300 dark:text-sand-500/75">
            Have a question or want to work together? I&apos;d love to hear from
            you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div>
            <h2 className="text-h3 text-ocean-800 dark:text-sand-500 mb-6">
              Contact Information
            </h2>

            <div className="space-y-4 mb-8">
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 p-4 rounded-card bg-sand-50 dark:bg-white/5 hover:bg-ocean-50 dark:hover:bg-white/10 transition-colors duration-180 ease-smooth border border-ocean-100 dark:border-white/10"
                >
                  <method.icon className="w-6 h-6 text-bronze-700 dark:text-bronze-400" />
                  <div className="flex-1">
                    <div className="font-medium text-ocean-800 dark:text-sand-500">
                      {method.label}
                    </div>
                    <div className="text-sm text-ocean-400 dark:text-sand-500/70">
                      {method.description}
                    </div>
                  </div>
                  <span className="text-sm text-muted-400 dark:text-sand-500/60">
                    {method.value}
                  </span>
                </a>
              ))}
            </div>

            {/* Response Time */}
            <div className="flex items-start gap-3 p-4 bg-bronze-50 dark:bg-bronze-900/20 rounded-card border border-bronze-200/50 dark:border-bronze-700/30">
              <Clock className="w-5 h-5 text-bronze-700 dark:text-bronze-400 mt-0.5" />
              <div>
                <div className="font-medium text-bronze-900 dark:text-bronze-300">
                  Response Time
                </div>
                <p className="text-sm text-bronze-700 dark:text-bronze-400/80">
                  I typically respond within 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-h3 text-ocean-800 dark:text-sand-500 mb-2">
              Send a Message
            </h2>
            <p className="text-sm text-muted-400 dark:text-sand-500/70 mb-6">
              Feel free to reach out about roles, collaborations, or questions
              about my work.
            </p>

            {isSubmitted ? (
              <div className="card p-8 text-center">
                <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-4" />
                <h3 className="text-h4 text-ocean-800 dark:text-sand-500 mb-2">
                  Message Sent!
                </h3>
                <p className="text-ocean-400 dark:text-sand-500/75 mb-4">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {/* Name (optional) */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-ocean-700 dark:text-sand-500/90 mb-2"
                  >
                    Name{" "}
                    <span className="text-muted-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-2 rounded-button border bg-white dark:bg-white/5 text-ocean-800 dark:text-sand-500 placeholder:text-muted-400 dark:placeholder:text-sand-500/50 focus:ring-2 focus:ring-bronze-400 focus:border-bronze-400 border-ocean-300/30 dark:border-white/10 transition-colors duration-180"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-ocean-700 dark:text-sand-500/90 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2 rounded-button border bg-white dark:bg-white/5 text-ocean-800 dark:text-sand-500 placeholder:text-muted-400 dark:placeholder:text-sand-500/50 focus:ring-2 focus:ring-bronze-400 focus:border-bronze-400 transition-colors duration-180 ${
                      errors.email
                        ? "border-error-500"
                        : "border-ocean-300/30 dark:border-white/10"
                    }`}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-ocean-700 dark:text-sand-500/90 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me a bit about what you'd like to discuss..."
                    className={`w-full px-4 py-2 rounded-button border bg-white dark:bg-white/5 text-ocean-800 dark:text-sand-500 placeholder:text-muted-400 dark:placeholder:text-sand-500/50 focus:ring-2 focus:ring-bronze-400 focus:border-bronze-400 resize-none transition-colors duration-180 ${
                      errors.message
                        ? "border-error-500"
                        : "border-ocean-300/30 dark:border-white/10"
                    }`}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
