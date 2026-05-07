import { Link } from 'react-router-dom';
import { Footer } from '../../components/marketing/Footer';

interface Block {
  title: string;
  intro: React.ReactNode;
  items: { label: string; asterisk?: boolean }[];
  ctaTo: string;
  ctaLabel: string;
  image: string;
  footnote?: string;
}

const blocks: Block[] = [
  {
    title: 'Equipment Services',
    image: 'https://placehold.co/800x500/1f2937/ffffff?text=Equipment+Services',
    intro: (
      <>
        Quick turn around times to keep you on the jobsite.{' '}
        <Link to="/request-service" className="text-red-900 font-medium hover:text-red-700">
          Submit a service request form
        </Link>{' '}
        and we&rsquo;ll get back to you with a custom quote.
      </>
    ),
    footnote: '* 50% off equipment rentals during service repairs',
    items: [
      { label: 'Level', asterisk: true },
      { label: 'Laser', asterisk: true },
      { label: 'Pipe Laser', asterisk: true },
      { label: 'Slope Laser', asterisk: true },
      { label: 'Transit', asterisk: true },
      { label: 'Theodolite', asterisk: true },
      { label: 'GPS - On-site Service', asterisk: true },
      { label: 'GPS 3D Modeling' },
      { label: 'Chase Drain Fabrication' },
    ],
    ctaTo: '/request-service',
    ctaLabel: 'Submit a service request',
  },
  {
    title: 'Equipment Rentals',
    image: 'https://placehold.co/800x500/1f2937/ffffff?text=Equipment+Rentals',
    intro: (
      <>
        Flexible rental times and reasonable prices to keep your job moving.{' '}
        <Link to="/rent-equipment" className="text-red-900 font-medium hover:text-red-700">
          Submit an equipment rental request form
        </Link>{' '}
        and we&rsquo;ll get back to you to set up the details.
      </>
    ),
    items: [
      { label: 'Laser' },
      { label: 'Level' },
      { label: 'Pipe Laser' },
      { label: 'Slope Laser' },
      { label: 'Transit' },
      { label: 'Theodolite' },
      { label: 'GPS On-Site' },
    ],
    ctaTo: '/rent-equipment',
    ctaLabel: 'Submit a rental request',
  },
  {
    title: 'Shop Products',
    image: 'https://placehold.co/800x500/1f2937/ffffff?text=Shop+Products',
    intro: (
      <>
        Offering a variety of job site supplies and solutions for pick up, delivery and shipping.
        Visit our showroom today or{' '}
        <Link to="/shop" className="text-red-900 font-medium hover:text-red-700">
          order on our website
        </Link>
        ! First time website orders receive a $25 credit!
      </>
    ),
    items: [
      { label: 'Batteries & Chargers' },
      { label: 'Field Supplies' },
      { label: 'Grade Rods' },
      { label: 'Lasers' },
      { label: 'Levels & Transit' },
      { label: 'Marking Paint' },
      { label: 'Roll Flagging' },
      { label: 'Safety Gear' },
      { label: 'Surveying & GPS' },
      { label: 'Tapes & Rulers & Wheels' },
      { label: 'Theodolites' },
      { label: 'Tripods' },
      { label: 'Wood Stakes' },
      { label: 'And more!' },
    ],
    ctaTo: '/shop',
    ctaLabel: 'Click here to shop online today',
  },
];

export const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Service, Rentals, and More
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Three ways we keep your jobsite moving &mdash; service, rentals, and supplies.
            </p>
          </div>
        </div>
      </section>

      {/* Three Blocks */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {blocks.map((block, idx) => (
            <div
              key={block.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div>
                <img
                  src={block.image}
                  alt={`${block.title} placeholder`}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{block.title}</h2>
                <p className="mt-4 text-lg text-gray-600">{block.intro}</p>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
                  {block.items.map((item) => (
                    <li key={item.label} className="flex items-start gap-2">
                      <span className="text-red-900 mt-1">&bull;</span>
                      <span>
                        {item.label}
                        {item.asterisk && <span className="text-red-900">*</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                {block.footnote && (
                  <p className="mt-4 text-sm text-gray-500 italic">{block.footnote}</p>
                )}
                <div className="mt-8">
                  <Link
                    to={block.ctaTo}
                    className="inline-flex items-center px-5 py-2.5 bg-red-900 text-white hover:bg-red-800 transition-colors text-sm font-medium rounded-md"
                  >
                    {block.ctaLabel} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
