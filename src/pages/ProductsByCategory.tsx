import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Link, useParams } from "react-router-dom";
import type { Product } from "../types/Product";
import type { Category } from "../types/Category";
import { formatCentsToDollars } from "../lib/money";

export const ProductsByCategory = () => {
  const { categoryId } = useParams();

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => api.getCategoryById(categoryId || ""),
    enabled: !!categoryId,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => api.getProductsByCategoryId(categoryId || ""),
    enabled: !!categoryId,
  });

  const category: Category | undefined = categoryData?.category;
  const products: Product[] = productsData?.products || [];

  if (categoryLoading || productsLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-5 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-5 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center pb-5 border-b border-gray-300">
        {category?.name || "Products"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-15 mt-5 md:mt-10">
        {products.map((product) => {
          const imageUrl = product.image_urls[0];
          const variations = product.variations;
          const variation = variations[0];
          const price = variation?.price_money?.amount;
          return (
            <Link to={`/shop/product/${product.id}`} key={product.id} className="block">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-auto object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-44 bg-gray-200" />
              )}
              <div className="flex justify-between items-center mt-2">
                <h2>{product.name}</h2>
                <p>${formatCentsToDollars(price)}</p>
              </div>
              <span className="text-xs text-gray-500">
                {product.variations.length > 1 ? `${product.variations.length} Variations` : `${product.variations.length} Variation`}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
