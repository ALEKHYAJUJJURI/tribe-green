import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ErrorState, LoadingState } from "../../components/StateViews";
import { ApiError } from "../../services/api/client";
import { getProductBySlug } from "../../services/products";
import type { Product } from "../../types/product";
import { formatPriceRange } from "../../utils/format";

const CARD_SHADOW = {
  shadowColor: "#14532D",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export default function ProductDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        const data = await getProductBySlug(slug);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          setError("Product not found.");
        } else {
          setError("Unable to load product details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/products");
  };

  if (loading) return <LoadingState message="Loading product details..." />;

  if (error || !product) {
    return (
      <ErrorState
        message={error || "Product not found."}
        actionLabel={notFound || !error ? "Go Back" : "Try Again"}
        onAction={notFound || !error ? goBack : () => setAttempt((n) => n + 1)}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAF6EE]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Hero image with back button */}
        <View className="mx-5 mt-3">
          <Image
            source={{ uri: product.image }}
            className="h-80 w-full rounded-[28px] bg-stone-100"
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={goBack}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="absolute left-3 top-3 h-11 w-11 items-center justify-center rounded-full bg-white/95"
            style={CARD_SHADOW}
          >
            <Ionicons name="arrow-back" size={22} color="#14532D" />
          </TouchableOpacity>
        </View>

        <View className="mt-6 px-5">
          {/* Title block */}
          <View className="self-start rounded-full bg-[#F3E9D2] px-3 py-1">
            <Text className="text-xs font-bold text-[#8A6A2B]">
              {product.category}
            </Text>
          </View>

          <Text className="mt-3 text-[26px] font-extrabold leading-8 text-stone-900">
            {product.name}
          </Text>

          <View className="mt-4 flex-row items-center justify-between rounded-2xl border border-[#EFE8D8] bg-white px-4 py-4">
            <Text className="text-xs font-bold tracking-[1.5px] text-stone-500">
              PRICE RANGE
            </Text>
            <Text className="text-xl font-extrabold text-[#14532D]">
              {formatPriceRange(product.minPrice, product.maxPrice)}
            </Text>
          </View>

          {/* Description */}
          <View className="mt-4 rounded-2xl border border-[#EFE8D8] bg-white p-4">
            <Text className="text-base font-bold text-stone-900">
              Product Description
            </Text>
            <Text className="mt-2 text-sm leading-6 text-stone-600">
              {product.description}
            </Text>
          </View>

          {/* Occasions */}
          {product.occasions.length > 0 && (
            <View className="mt-4 rounded-2xl border border-[#EFE8D8] bg-white p-4">
              <Text className="text-base font-bold text-stone-900">
                Suitable Occasions
              </Text>

              <View className="mt-3 flex-row flex-wrap">
                {product.occasions.map((occasion) => (
                  <View
                    key={occasion}
                    className="mb-2 mr-2 rounded-full border border-[#D9E8DC] bg-[#F1F7F2] px-4 py-2"
                  >
                    <Text className="text-xs font-semibold text-[#14532D]">
                      {occasion}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Customisation */}
          {product.customisation.length > 0 && (
            <View className="mt-4 rounded-2xl border border-[#EFE8D8] bg-white p-4">
              <Text className="text-base font-bold text-stone-900">
                Customisation Options
              </Text>

              {product.customisation.map((option) => (
                <View key={option} className="mt-3 flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#166534" />
                  <Text className="ml-3 flex-1 text-sm text-stone-600">
                    {option}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed enquiry bar */}
      <View className="border-t border-[#EFE8D8] bg-white px-5 pb-3 pt-3">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/enquiry",
              params: { slug: product.slug },
            })
          }
          activeOpacity={0.85}
          accessibilityRole="button"
          className="min-h-[52px] flex-row items-center justify-center rounded-2xl bg-[#14532D]"
        >
          <Text className="font-bold text-white">
            Enquire About This Product
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}