import { Link } from 'react-router-dom';
import { Footer } from '../../components/marketing/Footer';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const services = [
  'Excavation',
  'GPS Design & Grading',
  'Erosion & Drainage',
  'Snow Plowing & Ice Management',
  'Metal Fabrication',
  'Fence Building',
];

const values = [
  {
    title: 'Family Owned',
    description: 'We are a true family operation, built on generations of trust and dedication to our craft.',
  },
  {
    title: 'Honest & Hands-On',
    description: 'We believe in transparent communication and getting our hands dirty alongside our team.',
  },
  {
    title: 'Hardworking',
    description: 'No job is too big or too small. We bring the same dedication to every project.',
  },
  {
    title: 'Customer Success',
    description: 'Your success is our success. We strive to exceed expectations on every job.',
  },
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="mt-6 text-lg text-gray-600">
                RM Jobsite Solutions specializes in excavation, grading, drainage, snow plowing,
                ice management, and metal fabrication. We also offer GPS design and troubleshooting
                services to help optimize your project timelines.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                What sets us apart is our extensive expertise in dirt work, construction management,
                and metal fabrication. Our team-focused approach ensures quality results on every
                project, no matter the size.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                As a family-owned business, we prioritize being honest, hands-on, and hardworking
                while striving to satisfy customer needs and help our clients succeed.
              </p>
            </div>
            <div>
              <img
                src="https://placehold.co/600x400/1f2937/ffffff?text=Our+Team"
                alt="RM Jobsite Solutions team"
                className="rounded-lg shadow-xl"
              />
            </div>
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

      {/* Values Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
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
