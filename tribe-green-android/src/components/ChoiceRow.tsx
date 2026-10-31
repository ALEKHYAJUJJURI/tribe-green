import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChoiceRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  variant: "radio" | "plain" | "checkbox";
}

export default function ChoiceRow({
  label,
  selected,
  onPress,
  variant,
}: ChoiceRowProps) {
  const frame = selected
    ? "border-[#14532D] bg-[#F1F7F2]"
    : "border-[#EFE8D8] bg-white";

  if (variant === "checkbox") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        className={`mb-2 min-h-[48px] flex-row items-center rounded-xl border px-4 py-3 ${frame}`}
      >
        <View
          className={`mr-3 h-6 w-6 items-center justify-center rounded-md border ${
            selected ? "border-[#14532D] bg-[#14532D]" : "border-stone-300 bg-white"
          }`}
        >
          {selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </View>

        <Text
          className={`flex-1 text-sm ${
            selected ? "font-semibold text-[#14532D]" : "text-stone-700"
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  if (variant === "plain") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        className={`mb-2 min-h-[48px] justify-center rounded-xl border px-4 py-3 ${frame}`}
      >
        <Text
          className={`text-sm ${
            selected ? "font-semibold text-[#14532D]" : "font-medium text-stone-700"
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      className={`mb-2 min-h-[48px] flex-row items-center rounded-xl border px-4 py-3 ${frame}`}
    >
      <View
        className={`mr-3 h-6 w-6 items-center justify-center rounded-full border-2 ${
          selected ? "border-[#14532D]" : "border-stone-300"
        }`}
      >
        {selected && <View className="h-3 w-3 rounded-full bg-[#14532D]" />}
      </View>

      <Text
        className={`flex-1 text-sm ${
          selected ? "font-semibold text-[#14532D]" : "text-stone-700"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}