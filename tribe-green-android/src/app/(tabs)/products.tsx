import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import FilterChips from "../../components/FilterChips";
import {
  BUDGET_BANDS,
  CATEGORIES,
  OCCASIONS,
} from "../../constants/filters";
import { getProducts } from "../../services/products";
import type { Product } from "../../types/product";

import { ErrorState, LoadingState } from "../../components/StateViews";
import { formatPriceRange } from "../../utils/format";

const BUDGET_LABELS = BUDGET_BANDS.map((band) => band.label);

const CARD_SHADOW = {
  shadowColor: "#14532D",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export default function ProductsScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      setProducts(await getProducts());
    } catch {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = Boolean(search.trim() || category || occasion || budget);

  const clearFilters = () => {
    setSearch("");
    setCategory(null);
    setOccasion(null);
    setBudget(null);
  };

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    const band = BUDGET_BANDS.find((item) => item.label === budget);

    return products.filter((product) => {
      if (query && !product.name.toLowerCase().includes(query)) return false;
      if (category && product.category !== category) return false;
      if (occasion && !product.occasions.includes(occasion)) return false;
      // A product matches a band if its price range overlaps the band.
      if (band && !(product.minPrice < band.max && product.maxPrice >= band.min)) {
        return false;
      }
      return true;
    });
  }, [products, search, category, occasion, budget]);

  if (loading) return <LoadingState message="Loading products..." />;

  if (error) {
    return (
      <ErrorState
        message={error}
        actionLabel="Try Again"
        onAction={loadProducts}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAF6EE]">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-[11px] font-bold tracking-[2px] text-[#8A6A2B]">
          CATALOGUE
        </Text>
        <Text className="mt-1 text-2xl font-extrabold text-stone-900">
          Our Products
        </Text>

        <Text className="mb-4 mt-1 text-sm text-stone-500">
          Explore our corporate gifting collection
        </Text>

        <View className="mb-4 min-h-[48px] flex-row items-center rounded-2xl border border-[#E7DFCB] bg-white px-4">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            className="ml-3 flex-1 py-3 text-base text-stone-900"
          />
        </View>

        <FilterChips
          allLabel="All"
          options={CATEGORIES}
          selected={category}
          onSelect={setCategory}
        />
        <FilterChips
          allLabel="All Occasions"
          options={OCCASIONS}
          selected={occasion}
          onSelect={setOccasion}
        />
        <FilterChips
          allLabel="Any Budget"
          options={BUDGET_LABELS}
          selected={budget}
          onSelect={setBudget}
        />

        <View className="mb-3 mt-1 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-stone-500">
            {filteredProducts.length} products found
          </Text>

          {hasActiveFilters && (
            <TouchableOpacity
              onPress={clearFilters}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className="text-sm font-semibold text-[#14532D]">
                Clear all
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.slug}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="items-center px-6 py-14">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
                <Ionicons name="search-outline" size={28} color="#166534" />
              </View>

              <Text className="mt-4 text-base font-semibold text-stone-800">
                No products found
              </Text>

              <Text className="mt-2 text-center text-sm text-stone-500">
                Try another search or filter.
              </Text>

              {hasActiveFilters && (
                <TouchableOpacity
                  onPress={clearFilters}
                  className="mt-5 min-h-[44px] justify-center rounded-xl border border-[#14532D] px-5"
                >
                  <Text className="font-semibold text-[#14532D]">
                    Clear filters
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(`/products/${item.slug}`)}
              accessibilityRole="button"
              className="mb-4 w-[48%] overflow-hidden rounded-2xl border border-[#EFE8D8] bg-white"
              style={CARD_SHADOW}
            >
              <View>
                <Image
                  source={{ uri: item.image }}
                  className="h-40 w-full bg-stone-100"
                  resizeMode="cover"
                />
                <View className="absolute left-2 top-2 rounded-full bg-[#FAF6EE]/95 px-3 py-1">
                  <Text className="text-[10px] font-bold text-[#8A6A2B]">
                    {item.category}
                  </Text>
                </View>
              </View>

              <View className="p-3">
                <Text
                  className="min-h-[40px] text-sm font-bold leading-5 text-stone-900"
                  numberOfLines={2}
                >
                  {item.name}
                </Text>

                <Text className="mt-2 text-sm font-bold text-[#14532D]">
                  {formatPriceRange(item.minPrice, item.maxPrice)}
                </Text>

                <View className="mt-3 flex-row items-center">
                  <Text className="text-xs font-semibold text-[#166534]">
                    View Details
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="#166534"
                    style={{ marginLeft: 4 }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}