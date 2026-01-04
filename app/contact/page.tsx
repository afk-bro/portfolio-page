'use client'

import { useState } from 'react'
import { Mail, Github, Linkedin, Clock, Send, CheckCircle } from 'lucide-react'
import { siteMetadata } from '@/data/metadata'
import { Button } from '@/components/ui/Button'

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: siteMetadata.email,
    href: `mailto:${siteMetadata.email}`,
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'View Profile',
    href: siteMetadata.social.github,
    external: true,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Connect',
    href: siteMetadata.social.linkedin,
    external: true,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '', // Spam protection
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check - if filled, it's likely a bot
    if (formData.honeypot) {
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would send this to an API endpoint
    console.log('Form submitted:', formData)

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', message: '', honeypot: '' })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="section">
      <div className="container-content max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 text-neutral-900 dark:text-neutral-50 mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Have a question or want to work together? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div>
            <h2 className="text-h3 text-neutral-900 dark:text-neutral-50 mb-6">
              Contact Information
            </h2>

            <div className="space-y-4 mb-8">
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <method.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-50">
                      {method.label}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {method.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Response Time */}
            <div className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div>
                <div className="font-medium text-primary-900 dark:text-primary-100">
                  Response Time
                </div>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  I typically respond within 24-48 hours. For urgent matters,
                  please reach out via LinkedIn.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-h3 text-neutral-900 dark:text-neutral-50 mb-6">
              Send a Message
            </h2>

            {isSubmitted ? (
              <div className="card p-8 text-center">
                <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-4" />
                <h3 className="text-h4 text-neutral-900 dark:text-neutral-50 mb-2">
                  Message Sent!
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
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

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.name
                        ? 'border-error-500'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email
                        ? 'border-error-500'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                    aria-describedby={errors.email ? 'email-error' : undefined}
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
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                      errors.message
                        ? 'border-error-500'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                    aria-describedby={
                      errors.message ? 'message-error' : undefined
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
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
