import { Link } from 'react-router-dom';
import { Footer } from '../../components/marketing/Footer';
import { ServiceCard } from '../../components/marketing/ServiceCard';

const services = [
  {
    title: 'Excavation',
    description:
      'Professional excavation services for residential and commercial projects. We handle site preparation, trenching, and earth moving with precision and efficiency.',
    image: 'https://placehold.co/600x400/1f2937/ffffff?text=Excavation',
  },
  {
    title: 'GPS Design & Grading',
    description:
      'Utilizing cutting-edge GPS technology to determine precise grades and optimize project timelines. Over 25 years of excavation industry experience.',
    image: 'https://placehold.co/600x400/1f2937/ffffff?text=GPS+Grading',
  },
  {
    title: 'Erosion & Drainage',
    description:
      'Comprehensive erosion control and drainage solutions to protect your property. We design and implement effective water management systems.',
    image: 'https://placehold.co/600x400/1f2937/ffffff?text=Drainage',
  },
  {
    title: 'Fence Building',
    description:
      'Custom fence construction for residential and commercial properties. We provide detailed estimates and hands-on communication throughout the project.',
    image: 'https://placehold.co/600x400/1f2937/ffffff?text=Fence+Building',
  },
  {
    title: 'Metal Fabrication',
    description:
      'Expert metal fabrication services including gates, structures, and custom work. Our team has 15+ years of experience delivering budget-friendly solutions.',
    image: 'https://placehold.co/600x400/1f2937/ffffff?text=Metal+Fabrication',
    subcategories: ['Gates', 'Structures', 'Custom Work'],
  },
  {
    title: 'Snow Plowing',
    description:
      'Reliable residential and commercial snow removal services. Well-timed, efficient, and focused on providing you with a safe location.',
    image: 'https://placehold.co/600x400/1f2937/ffffff?text=Snow+Plowing',
  },
];

export const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Services</h1>
            <p className="mt-6 text-xl text-gray-300">
              Comprehensive jobsite solutions backed by 25 years of industry experience.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="flex flex-col">
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  image={service.image}
                />
                {service.subcategories && (
                  <div className="mt-3 px-2">
                    <p className="text-sm text-gray-500">
                      Includes: {service.subcategories.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Need Something Else?</h2>
            <p className="mt-4 text-lg text-gray-600">
              We offer additional services to meet your specific project needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Request a Service</h3>
              <p className="text-gray-600 mb-4">
                Have a specific service need? Submit a request and we'll get back to you with a custom quote.
              </p>
              <Link
                to="/request-service"
                className="text-red-900 hover:text-red-700 font-medium transition-colors"
              >
                Submit a request &rarr;
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Equipment Rental</h3>
              <p className="text-gray-600 mb-4">
                Need to rent equipment for your project? Browse our available equipment options.
              </p>
              <Link
                to="/rent-equipment"
                className="text-red-900 hover:text-red-700 font-medium transition-colors"
              >
                View equipment &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-red-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-xl text-red-100">
            Contact us today for a free estimate on your next project.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-red-900 hover:bg-gray-100 transition-colors text-base font-medium rounded-md"
            >
              Contact Us
            </Link>
            <a
              href="tel:303-909-6148"
              className="inline-flex items-center px-6 py-3 border border-white text-white hover:bg-white/10 transition-colors text-base font-medium rounded-md"
            >
              Call 303-909-6148
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
