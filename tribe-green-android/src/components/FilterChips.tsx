import { ScrollView, Text, TouchableOpacity } from "react-native";

interface FilterChipsProps {
  allLabel: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

export default function FilterChips({
  allLabel,
  options,
  selected,
  onSelect,
}: FilterChipsProps) {
  const items: { label: string; value: string | null }[] = [
    { label: allLabel, value: null },
    ...options.map((option) => ({ label: option, value: option })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-3 flex-grow-0"
      contentContainerStyle={{ paddingRight: 10 }}
    >
      {items.map((item) => {
        const isSelected = selected === item.value;

        return (
          <TouchableOpacity
            key={item.label}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            className={`mr-2 min-h-[40px] justify-center rounded-full border px-4 ${
              isSelected
                ? "border-[#14532D] bg-[#14532D]"
                : "border-[#E7DFCB] bg-white"
            }`}
          >
            <Text
              className={`text-[13px] font-semibold ${
                isSelected ? "text-white" : "text-stone-600"
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}