import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EnquirySuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#FAF6EE]">
      <View className="flex-1 items-center justify-center px-8">
        {/* Check badge */}
        <View className="h-28 w-28 items-center justify-center rounded-full bg-[#F1F7F2]">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-[#14532D]">
            <Ionicons name="checkmark" size={44} color="#FFFFFF" />
          </View>
        </View>

        <Text className="mt-8 text-[11px] font-bold tracking-[2px] text-[#8A6A2B]">
          ENQUIRY RECEIVED
        </Text>

        <Text className="mt-2 text-center text-2xl font-extrabold text-stone-900">
          Thank you!
        </Text>

        <View className="mt-3 h-[3px] w-10 rounded-full bg-[#B8924A]" />

        <Text className="mt-4 text-center text-sm leading-6 text-stone-500">
          Your enquiry has been submitted successfully. Our team will review
          your requirements and get in touch with you soon.
        </Text>
      </View>

      {/* Actions */}
      <View className="px-5 pb-4">
        <TouchableOpacity
          onPress={() => router.replace("/my-enquiries")}
          activeOpacity={0.85}
          accessibilityRole="button"
          className="min-h-[54px] items-center justify-center rounded-2xl bg-[#14532D]"
        >
          <Text className="text-base font-bold text-white">My Enquiries</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/")}
          activeOpacity={0.85}
          accessibilityRole="button"
          className="mt-3 min-h-[54px] items-center justify-center rounded-2xl border border-[#14532D] bg-white"
        >
          <Text className="text-base font-bold text-[#14532D]">Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}