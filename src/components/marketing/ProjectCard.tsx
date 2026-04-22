interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
}

export const ProjectCard = ({ title, category, image }: ProjectCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-red-400 text-xs uppercase tracking-wider mb-1">{category}</p>
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
};
