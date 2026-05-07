import { Link } from 'react-router-dom';
import { Footer } from '../../components/marketing/Footer';
import { ServiceCard } from '../../components/marketing/ServiceCard';
import {
  WrenchScrewdriverIcon,
  TruckIcon,
  CubeIcon,
  HomeModernIcon,
} from '@heroicons/react/24/outline';
import denverBg from '../../assets/denver-bg.jpg';
import fenceConstructionImg from '../../assets/fence-construction.jpg';
import gradingImg from '../../assets/grading.jpg';
import snowPlowingImg from '../../assets/snow-plowing.jpg';
import metalFabricationImg from '../../assets/metal-fabrication.jpg';

const featuredServices = [
  {
    title: 'Construction',
    description: 'Detailed estimates and hands-on communication for fence building and custom furniture projects.',
    image: fenceConstructionImg,
    icon: HomeModernIcon,
  },
  {
    title: 'Grading',
    description: '25+ years of excavation industry experience using GPS technology to determine grades and optimize timelines.',
    image: gradingImg,
    icon: TruckIcon,
  },
  {
    title: 'Snow Plowing',
    description: 'Residential and commercial snow removal services that are well-timed, efficient, and focused on safety.',
    image: snowPlowingImg,
    icon: CubeIcon,
  },
  {
    title: 'Metal Fabrication',
    description: 'Team with 15+ years experience offering budget-friendly solutions for projects of any size.',
    image: metalFabricationImg,
    icon: WrenchScrewdriverIcon,
  },
];

const values = [
  { title: 'Family Owned', description: 'A true family operation built on trust' },
  { title: 'Quality Services', description: 'Excellence in every project we undertake' },
  { title: 'Honest & Hardworking', description: 'Integrity in everything we do' },
  { title: 'Earning Your Business', description: 'Committed to exceeding expectations' },
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${denverBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              RM Jobsite Solutions
            </h1>
            <p className="mt-4 text-xl text-gray-300">
              25 years of providing quality products and services through the Rocky Mountain Lasers family.
            </p>
            <p className="mt-6 text-lg text-gray-400">
              Specializing in excavation, grading, drainage, snow plowing, ice management, and metal fabrication.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="btn-primary inline-flex items-center px-6 py-3 text-base font-medium"
              >
                Our Services
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-base font-medium rounded-md"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Services</h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive solutions for all your construction and jobsite needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                image={service.image}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="text-red-900 hover:text-red-700 font-medium transition-colors"
            >
              View all services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                A Family-Owned Business You Can Trust
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                At RM Jobsite Solutions, we bring extensive expertise in dirt work, construction management,
                and metal fabrication. Our team-focused approach ensures quality results on every project.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                As a family-owned operation, we prioritize being honest, hands-on, and hardworking while
                striving to satisfy customer needs and help our clients succeed.
              </p>
              <div className="mt-8">
                <Link
                  to="/about"
                  className="text-red-900 hover:text-red-700 font-medium transition-colors"
                >
                  Learn more about us &rarr;
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://placehold.co/600x400/1f2937/ffffff?text=About+RM+Jobsites"
                alt="RM Jobsite Solutions team at work"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">Why Choose Us</h2>
            <p className="mt-4 text-lg text-gray-400">
              Our commitment to excellence sets us apart
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900 mb-4">
                  <span className="text-white font-bold">✓</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-red-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-xl text-red-100">
            Contact us today for a free estimate on your next project.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-red-900 hover:bg-gray-100 transition-colors text-base font-medium rounded-md"
            >
              Get in Touch
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
