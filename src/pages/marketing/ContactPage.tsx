import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Footer } from '../../components/marketing/Footer';
import { api } from '../../lib/api';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const mutation = useMutation({
    mutationFn: (data: ContactFormData) => api.submitContactForm(data),
    onSuccess: () => {
      setFormData({ name: '', email: '', phone: '', message: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
            <p className="mt-6 text-xl text-gray-300">
              Get in touch with our team. We're here to help with your next project.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {mutation.isSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900">Message Sent!</h3>
                    <p className="text-green-700 mt-1">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => mutation.reset()}
                      className="mt-4 text-green-700 underline hover:no-underline"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="label">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="label">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="input resize-none"
                    />
                  </div>

                  {mutation.isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                      {mutation.error instanceof Error
                        ? mutation.error.message
                        : 'Failed to send message. Please try again.'}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {mutation.isPending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ryan Neeley</h3>
                  <p className="text-gray-600">Owner & Primary Contact</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPinIcon className="h-6 w-6 text-red-900 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">
                        5385 Quebec St, Unit B<br />
                        Commerce City, CO 80022
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <PhoneIcon className="h-6 w-6 text-red-900 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <a
                        href="tel:303-909-6148"
                        className="text-red-900 hover:text-red-700 transition-colors"
                      >
                        303-909-6148
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <EnvelopeIcon className="h-6 w-6 text-red-900 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a
                        href="mailto:Ryan@rmjobsites.com"
                        className="text-red-900 hover:text-red-700 transition-colors"
                      >
                        Ryan@rmjobsites.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-6 bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-gray-500">Map placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
