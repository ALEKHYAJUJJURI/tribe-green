import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { CATEGORIES } from "../../constants/filters";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Drinkware: "cafe-outline",
  Apparel: "shirt-outline",
  "Work Essentials": "briefcase-outline",
  Wellness: "gift-outline",
};

const CARD_SHADOW = {
  shadowColor: "#14532D",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#FAF6EE]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Header */}
       {/* Header */}
<View className="flex-row items-center px-5 pb-2 pt-4">
  <Image
    source={require("../../../assets/logo-symbol-512.png")}
    style={{ width: 44, height: 44 }}
    resizeMode="contain"
    accessibilityLabel="Tribe Green logo"
  />
  <View className="ml-3">
    <Text className="text-[26px] font-extrabold tracking-tight text-[#14532D]">
      tribe<Text className="text-[#8A6A2B]">green</Text>
    </Text>
    <Text className="text-sm text-stone-500">
      Thoughtful gifts. Meaningful connections.
    </Text>
  </View>
</View>

        {/* Hero */}
        <View
          className="mx-5 mt-4 overflow-hidden rounded-[28px] bg-[#14532D] p-6"
          style={CARD_SHADOW}
        >
          <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
          <View className="absolute -bottom-14 right-6 h-32 w-32 rounded-full bg-[#B8924A]/15" />

          <Text className="text-[11px] font-bold tracking-[2px] text-[#E3C98F]">
            CORPORATE GIFTING MADE EASY
          </Text>

          <Text className="mt-3 text-[32px] font-extrabold leading-[40px] text-white">
            Make Every Gift Count.
          </Text>

          <View className="mt-3 h-[3px] w-10 rounded-full bg-[#B8924A]" />

          <Text className="mt-4 text-sm leading-6 text-green-100">
            Discover thoughtful corporate gifts for your employees, clients and
            business partners.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/products")}
            activeOpacity={0.85}
            accessibilityRole="button"
            className="mt-6 min-h-[48px] flex-row items-center self-start rounded-2xl bg-[#FAF6EE] px-6"
          >
            <Text className="font-bold text-[#14532D]">Explore Products</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#14532D"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="mt-9 px-5">
          <View className="mb-4 flex-row items-end justify-between">
            <View>
              <Text className="text-[11px] font-bold tracking-[2px] text-[#8A6A2B]">
                BROWSE
              </Text>
              <Text className="mt-1 text-xl font-bold text-stone-900">
                Shop by Category
              </Text>
            </View>
            <Text className="text-sm font-medium text-stone-500">
              {CATEGORIES.length} Categories
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {CATEGORIES.map((name) => (
              <TouchableOpacity
                key={name}
                onPress={() => router.push("/products")}
                activeOpacity={0.85}
                accessibilityRole="button"
                className="mb-3 w-[48%] rounded-2xl border border-[#EFE8D8] bg-white p-4"
                style={CARD_SHADOW}
              >
                <View className="mb-4 h-12 w-12 items-center justify-center rounded-xl bg-[#F1F7F2]">
                  <Ionicons
                    name={CATEGORY_ICONS[name] ?? "gift-outline"}
                    size={24}
                    color="#166534"
                  />
                </View>

                <Text className="font-semibold text-stone-800">{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Occasions */}
        <View className="mx-5 mt-4 rounded-3xl border border-[#EFE8D8] bg-white p-5">
          <Text className="text-[11px] font-bold tracking-[2px] text-[#8A6A2B]">
            OCCASIONS
          </Text>
          <Text className="mt-1 text-xl font-bold text-stone-900">
            Made for Every Occasion
          </Text>

          <Text className="mt-2 text-sm leading-6 text-stone-500">
            From employee onboarding to festive celebrations, find gifts that
            leave a lasting impression.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/products")}
            activeOpacity={0.85}
            accessibilityRole="button"
            className="mt-5 min-h-[48px] flex-row items-center justify-center rounded-2xl border border-[#14532D]"
          >
            <Text className="font-bold text-[#14532D]">View All Products</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#14532D"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}