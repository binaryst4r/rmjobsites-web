import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Customer, Card } from "../../types/customer";

export const MyAccount = () => {
  const queryClient = useQueryClient();

  // Fetch customer data
  const { data: customer, isLoading: customerLoading } = useQuery<Customer>({
    queryKey: ["customer"],
    queryFn: () => api.getCustomer(),
  });

  // Fetch customer cards
  const { data: cardsData, isLoading: cardsLoading } = useQuery<{ cards: Card[] }>({
    queryKey: ["customer-cards"],
    queryFn: () => api.getCustomerCards(),
  });

  // Form state
  const [formData, setFormData] = useState({
    given_name: "",
    family_name: "",
    email: "",
    address_line_1: "",
    address_line_2: "",
    locality: "",
    administrative_district_level_1: "",
    postal_code: "",
  });

  // Update form when customer data loads
  useEffect(() => {
    if (customer) {
      setFormData({
        given_name: customer.given_name || "",
        family_name: customer.family_name || "",
        email: customer.email_address || "",
        address_line_1: customer.address?.address_line_1 || "",
        address_line_2: customer.address?.address_line_2 || "",
        locality: customer.address?.locality || "",
        administrative_district_level_1: customer.address?.administrative_district_level_1 || "",
        postal_code: customer.address?.postal_code || "",
      });
    }
  }, [customer]);

  // Update customer mutation
  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      return api.updateCustomer("me", {
        given_name: data.given_name,
        family_name: data.family_name,
        email: data.email,
        address: {
          address_line_1: data.address_line_1,
          address_line_2: data.address_line_2,
          locality: data.locality,
          administrative_district_level_1: data.administrative_district_level_1,
          postal_code: data.postal_code,
          country: "US",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      alert("Account information updated successfully!");
    },
    onError: (error: Error) => {
      alert(`Failed to update account: ${error.message}`);
    },
  });

  // Delete card mutation
  const deleteCardMutation = useMutation({
    mutationFn: (cardId: string) => api.deleteCustomerCard("me", cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-cards"] });
    },
    onError: (error: Error) => {
      alert(`Failed to delete card: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      deleteCardMutation.mutate(cardId);
    }
  };

  if (customerLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-600">Loading account information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Info Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Customer Info</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={`${formData.given_name} ${formData.family_name}`.trim()}
              onChange={(e) => {
                const parts = e.target.value.split(" ");
                setFormData({
                  ...formData,
                  given_name: parts[0] || "",
                  family_name: parts.slice(1).join(" ") || "",
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>
        </div>

        {/* Customer Address Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Customer Address</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Address Line 1"
              value={formData.address_line_1}
              onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Address 2"
              value={formData.address_line_2}
              onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.administrative_district_level_1}
                onChange={(e) => setFormData({ ...formData, administrative_district_level_1: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
            </div>
            <input
              type="text"
              placeholder="ZIP Code"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400"
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* Payment Cards Section */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Payment Cards</h2>
        {cardsLoading ? (
          <p className="text-gray-600">Loading payment cards...</p>
        ) : cardsData?.cards && cardsData.cards.length > 0 ? (
          <div className="space-y-3">
            {cardsData.cards.map((card) => (
              <div
                key={card.id}
                className="flex justify-between items-center p-4 border border-gray-300 rounded-md"
              >
                <div>
                  <p className="font-medium">
                    {card.card_brand} Ending in {card.last_4}
                  </p>
                  {card.exp_month && card.exp_year && (
                    <p className="text-sm text-gray-600">
                      Expires {card.exp_month}/{card.exp_year}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  disabled={deleteCardMutation.isPending}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Delete Card
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No payment cards on file</p>
        )}
      </div>
    </div>
  );
};
