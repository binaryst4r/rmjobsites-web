import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Category } from "../types/Category";
import { useNavigate } from "react-router-dom";

export const CategoryList = () => {
  const navigate = useNavigate();
  const {data} = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
  });
  const categories: Category[] = data?.categories || [];
  console.log(categories);

  const handleCategoryClick = (category: Category) => {
    console.log(category);
    navigate(`/shop/category/${category.id}`);
  }

  return (
    <div className="max-w-7xl mx-auto pb-6 px-5 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center py-5 md:py-10 border-b border-gray-300">Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 md:mt-10">
        {categories.map((category) => {
          const imageUrl = category.image_urls[0];
          return (
          <div role="button" onClick={() => handleCategoryClick(category)} key={category.id} className="flex flex-col">
            {imageUrl ? (
              <img src={imageUrl} alt={category.name} className="w-full h-auto object-cover rounded-t-lg" />
            ) : (
              <div className="w-full h-36 bg-gray-200 rounded-t-lg" />
            )}
            <h2 className="text-base font-bold text-gray-900 mt-2">{category.name}</h2>
          </div>
        )})}
      </div>
    </div>
  )
}