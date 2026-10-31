import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { LoadingState } from "../../components/StateViews";
import { getSavedEnquiries } from "../../storage/enquiryStore";
import type { SavedEnquiry } from "../../types/enquiry";
import { formatDate } from "../../utils/format";

const CARD_SHADOW = {
  shadowColor: "#14532D",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

const formatDelivery = (value: string) => {
  const parsed = `${value}T12:00:00`;
  return Number.isNaN(new Date(parsed).getTime()) ? value : formatDate(parsed);
};

function DetailRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View className="mt-2 flex-row items-center">
      <Ionicons name={icon} size={16} color="#166534" />
      <Text className="ml-2 flex-1 text-sm text-stone-600">{text}</Text>
    </View>
  );
}

export default function MyEnquiriesScreen() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<SavedEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload every time the tab is focused so a new enquiry shows up immediately.
  useFocusEffect(
    useCallback(() => {
      let active = true;

      getSavedEnquiries().then((data) => {
        if (!active) return;
        setEnquiries(data);
        setLoading(false);
      });

      return () => {
        active = false;
      };
    }, [])
  );

  if (loading) return <LoadingState message="Loading your enquiries..." />;

  return (
    <SafeAreaView className="flex-1 bg-[#FAF6EE]">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-[11px] font-bold tracking-[2px] text-[#8A6A2B]">
          HISTORY
        </Text>
        <Text className="mt-1 text-2xl font-extrabold text-stone-900">
          My Enquiries
        </Text>

        <Text className="mb-5 mt-1 text-sm text-stone-500">
          Enquiries submitted from this phone
        </Text>

        <FlatList
          data={enquiries}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="items-center px-6 py-14">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
                <Ionicons name="clipboard-outline" size={28} color="#166534" />
              </View>

              <Text className="mt-4 text-base font-semibold text-stone-800">
                No enquiries yet
              </Text>

              <Text className="mt-2 text-center text-sm text-stone-500">
                Browse our products and send your first enquiry.
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/products")}
                activeOpacity={0.85}
                accessibilityRole="button"
                className="mt-5 min-h-[48px] justify-center rounded-2xl bg-[#14532D] px-6"
              >
                <Text className="font-semibold text-white">Browse Products</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View
              className="mb-4 overflow-hidden rounded-2xl border border-[#EFE8D8] bg-white"
              style={CARD_SHADOW}
            >
              <View className="h-1 bg-[#B8924A]" />

              <View className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="rounded-full bg-[#F1F7F2] px-3 py-1">
                    <Text className="text-[11px] font-bold text-[#14532D]">
                      Submitted
                    </Text>
                  </View>
                  <Text className="text-xs font-medium text-stone-500">
                    {formatDate(item.submittedAt)}
                  </Text>
                </View>

                <Text className="mt-3 text-base font-bold leading-6 text-stone-900">
                  {item.productNames.join(", ")}
                </Text>

                <View className="mt-2 border-t border-[#F3EEE0] pt-1">
                  <DetailRow
                    icon="business-outline"
                    text={`${item.company} · ${item.units} units`}
                  />
                  <DetailRow icon="sparkles-outline" text={item.occasion} />
                  <DetailRow
                    icon="wallet-outline"
                    text={`Budget: ${item.budget}`}
                  />
                  <DetailRow
                    icon="calendar-outline"
                    text={`Delivery by ${formatDelivery(item.deliveryDate)}`}
                  />
                  {item.customisation.length > 0 && (
                    <DetailRow
                      icon="color-wand-outline"
                      text={`Customisation: ${item.customisation.join(", ")}`}
                    />
                  )}
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}