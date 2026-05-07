import { Link } from 'react-router-dom';
import { Footer } from '../../components/marketing/Footer';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const services = [
  'Equipment Service',
  'Equipment Rentals',
  'GPS 3D Modeling',
  'GPS On-site Service',
  'Supplies',
  'Custom Fabrication',
];

export const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About Us</h1>
            <p className="mt-6 text-xl text-gray-300">
              Building on 25 years of quality products and services through the Rocky Mountain Lasers family.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Our Story</h2>
          <img
            src="https://placehold.co/900x400/1f2937/ffffff?text=Our+Team"
            alt="RM Jobsite Solutions team"
            className="mt-8 w-full rounded-lg shadow-xl"
          />
          <div className="mt-8 space-y-5 text-lg text-gray-600">
            <p>
              Welcome to RM Jobsite Solutions &ndash; where local expertise meets family values for
              top-notch quality every time!
            </p>
            <p>
              With a proud heritage rooted in the Rocky Mountain Lasers Family, we've been serving
              our community with integrity and excellence for over 25 years. Specializing in
              excavation, grading, drainage, snow plowing, ice management, and metal fabrication,
              we're your go-to folks for all things quality craftsmanship.
            </p>
            <p>
              What sets us apart? It's simple &ndash; we're not just a business; we're a tight-knit
              family dedicated to delivering nothing but the best. From our extensive knowledge in
              dirt work and construction management to our precision metal fabrication, we pour our
              heart and soul into every project we undertake.
            </p>
            <p>
              As a local, small business, we understand the importance of building strong
              relationships within our community. That's why honesty, reliability, and personalized
              service are at the core of everything we do. When you choose RM Jobsite Solutions,
              you're not just a customer &ndash; you're part of the family.
            </p>
            <p>
              Whether you need expert guidance on GPS design or a reliable team to tackle your
              excavation needs, trust us to exceed your expectations every step of the way. Our
              commitment to quality products and unparalleled customer service is what drives us
              forward, and we can't wait to show you the RM Jobsite Solutions difference.
            </p>
            <p>
              So, let us be your trusted partners in success. Together, we'll build something truly
              remarkable &ndash; because when it comes to quality craftsmanship, nobody does it
              better than a local, small family business like ours.
            </p>
            <p>
              Let's make your jobsite ready today!{' '}
              <Link to="/contact" className="text-red-900 font-medium hover:text-red-700">
                Get in touch with us today
              </Link>
              , and let's build something great, together!
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What We Do</h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive jobsite solutions for any project
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service}
                className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm"
              >
                <CheckCircleIcon className="h-6 w-6 text-red-900 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{service}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/services"
              className="text-red-900 hover:text-red-700 font-medium transition-colors"
            >
              View detailed services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-24 bg-red-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Let's Work Together</h2>
          <p className="mt-4 text-xl text-red-100">
            Ready to start your next project? We'd love to hear from you.
          </p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-red-900 hover:bg-gray-100 transition-colors text-base font-medium rounded-md"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
