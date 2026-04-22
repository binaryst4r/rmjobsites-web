import { Footer } from '../../components/marketing/Footer';
import { ProjectCard } from '../../components/marketing/ProjectCard';

const metalFabricationProjects = [
  {
    title: 'Custom Gate Installation',
    image: 'https://placehold.co/400x400/1f2937/ffffff?text=Gate+1',
  },
  {
    title: 'Steel Structure Build',
    image: 'https://placehold.co/400x400/1f2937/ffffff?text=Structure+1',
  },
];

const snowRemovalProjects = [
  {
    title: 'Commercial Lot Clearing',
    image: 'https://placehold.co/400x400/1f2937/ffffff?text=Snow+1',
  },
  {
    title: 'Residential Driveway Service',
    image: 'https://placehold.co/400x400/1f2937/ffffff?text=Snow+2',
  },
  {
    title: 'Parking Garage Snow Removal',
    image: 'https://placehold.co/400x400/1f2937/ffffff?text=Snow+3',
  },
  {
    title: 'Industrial Site Plowing',
    image: 'https://placehold.co/400x400/1f2937/ffffff?text=Snow+4',
  },
];

export const ProjectsPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Projects</h1>
            <p className="mt-6 text-xl text-gray-300">
              Take a look at some of our recent work and see the quality we deliver.
            </p>
          </div>
        </div>
      </section>

      {/* Metal Fabrication Projects */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Metal Fabrication</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {metalFabricationProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                category="Metal Fabrication"
                image={project.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Snow Removal Projects */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Snow Removal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {snowRemovalProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                category="Snow Removal"
                image={project.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Have a Project in Mind?</h2>
          <p className="mt-4 text-xl text-gray-400">
            We'd love to discuss how we can help bring your vision to life.
          </p>
          <div className="mt-8">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-red-900 text-white hover:bg-red-800 transition-colors text-base font-medium rounded-md"
            >
              Get a Free Estimate
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
