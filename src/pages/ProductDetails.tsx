import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Product } from "../types/Product";
import { formatCentsToDollars } from "../lib/money";
import { CheckCircleIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useCart } from "../lib/cart-context";
import { useNotification } from "../lib/notification-context";

export const ProductDetails = () => {
  const { productId } = useParams();
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const { addItem } = useCart();
  const { showSuccess } = useNotification();

  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => api.getProductById(productId || ""),
    enabled: !!productId,
  });

  const product: Product | undefined = productData?.product;

  // Set default selected variation when product loads
  if (product && !selectedVariationId && product.variations.length > 0) {
    setSelectedVariationId(product.variations[0].id);
  }

  const selectedVariation = product?.variations.find(
    (v) => v.id === selectedVariationId
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-5 sm:px-6 lg:px-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-5 sm:px-6 lg:px-8">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  // Get the main image - from selected variation or product
  const mainImage = selectedVariation?.image_urls?.[0] || product.image_urls[0];

  // Get price from selected variation or first variation
  const price = selectedVariation?.price_money || product.variations[0]?.price_money;

  // If any variation has its own distinct image, keep the rich button-card picker.
  // Otherwise fall back to a simple dropdown.
  // TODO: mute out-of-stock variations once a real inventory signal is wired up
  // (Square's `available_for_booking` is for Appointments, not retail stock).
  const topImage = product.image_urls[0];
  const hasDistinctVariantImages = product.variations.some(
    (v) => v.image_urls?.[0] && v.image_urls[0] !== topImage
  );

  const handleAddToBag = () => {
    if (!selectedVariation) return;

    addItem({
      productId: product.id,
      variationId: selectedVariation.id,
      productName: product.name,
      variationName: selectedVariation.name,
      price: selectedVariation.price_money.amount,
      imageUrl: selectedVariation.image_urls?.[0] || product.image_urls[0],
    });

    showSuccess(`${product.name} - ${selectedVariation.name} added to cart!`, 'Added to Cart');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Back to Categories */}
        <div className="px-4 py-4">
          <Link
            to="/shop"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Categories
          </Link>
        </div>

        {/* Mobile Product Title and Price */}
        <div className="px-4">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold">${formatCentsToDollars(price.amount)}</span>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="text-sm">In stock and ready to ship</span>
            </div>
          </div>
        </div>

        {/* Mobile Product Image */}
        <div className="px-4 mb-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Mobile Product Description */}
        {product.description && (
          <div className="px-4 mb-6 text-gray-700 whitespace-pre-line">
            {product.description}
          </div>
        )}

        {/* Mobile Variations */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Variations</h3>
          {hasDistinctVariantImages ? (
            <div className="space-y-3">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariationId(variation.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedVariationId === variation.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{variation.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        This is some description of the variation.
                      </div>
                    </div>
                    {selectedVariationId === variation.id && (
                      <CheckCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <select
              className="input"
              value={selectedVariationId ?? ""}
              onChange={(e) => setSelectedVariationId(e.target.value)}
            >
              {product.variations.map((variation) => (
                <option key={variation.id} value={variation.id}>
                  {variation.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Mobile Add to Bag Button */}
        <div className="px-4 pb-8">
          <button
            onClick={handleAddToBag}
            className="w-full bg-black text-white py-4 rounded font-semibold hover:bg-gray-800 transition-colors"
          >
            Add to Bag
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Desktop Back to Categories */}
          <div className="mb-6">
            <Link
              to="/shop"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back to Categories
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-12">
            {/* Desktop Left Column - Image */}
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden sticky top-8">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Desktop Right Column - Details */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-2xl font-bold">${formatCentsToDollars(price.amount)}</span>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="text-sm">In stock and ready to ship</span>
                </div>
              </div>

              {/* Desktop Product Description */}
              {product.description && (
                <div className="mb-8 text-gray-700 whitespace-pre-line">
                  {product.description}
                </div>
              )}

              {/* Desktop Size/Variations */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Size</h3>
                {hasDistinctVariantImages ? (
                  <div className="space-y-3">
                    {product.variations.map((variation) => (
                      <button
                        key={variation.id}
                        onClick={() => setSelectedVariationId(variation.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedVariationId === variation.id
                            ? "border-red-900 bg-red-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{variation.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              This is some description of the variation.
                            </div>
                          </div>
                          {selectedVariationId === variation.id && (
                            <CheckCircleIcon className="w-6 h-6 text-red-900 shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <select
                    className="input"
                    value={selectedVariationId ?? ""}
                    onChange={(e) => setSelectedVariationId(e.target.value)}
                  >
                    {product.variations.map((variation) => (
                      <option key={variation.id} value={variation.id}>
                        {variation.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Desktop Add to Bag Button */}
              <button
                onClick={handleAddToBag}
                className="w-full bg-black text-white py-4 rounded font-semibold hover:bg-gray-800 transition-colors"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
