import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export function LoadingState({ message }: { message: string }) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#FAF6EE]">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
        <ActivityIndicator size="large" color="#166534" />
      </View>
      <Text className="mt-4 text-sm font-medium text-stone-500">{message}</Text>
    </SafeAreaView>
  );
}

interface ErrorStateProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export function ErrorState({ message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#FAF6EE] px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <Ionicons name="alert-circle-outline" size={32} color="#B91C1C" />
      </View>

      <Text className="mt-5 text-center text-base font-semibold text-stone-800">
        {message}
      </Text>

      <TouchableOpacity
        onPress={onAction}
        activeOpacity={0.85}
        accessibilityRole="button"
        className="mt-6 min-h-[48px] items-center justify-center rounded-2xl bg-[#14532D] px-8"
      >
        <Text className="font-bold text-white">{actionLabel}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}