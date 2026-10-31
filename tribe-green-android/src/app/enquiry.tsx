import { useEffect, useState, type ReactNode } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { saveEnquiry } from "../storage/enquiryStore";
import ChoiceRow from "../components/ChoiceRow";
import { BUDGET_BANDS, CUSTOMISATIONS, OCCASIONS } from "../constants/filters";
import { ApiError } from "../services/api/client";
import { submitEnquiry } from "../services/enquiry";
import { getProducts } from "../services/products";
import type { EnquiryInput } from "../types/enquiry";
import type { Product } from "../types/product";
import { validateEnquiry } from "../utils/validation";
import DateTimePicker from "@react-native-community/datetimepicker";

const INPUT =
  "mb-3 min-h-[52px] rounded-xl border border-[#E7DFCB] bg-[#FDFBF7] px-4 py-3 text-base text-stone-900";
const PLACEHOLDER = "#9CA3AF";

const toggle = (list: string[], value: string) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <View className="mb-4 rounded-2xl border border-[#EFE8D8] bg-white p-4">
      <View className="mb-4 flex-row items-center">
        <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-[#14532D]">
          <Text className="text-xs font-bold text-white">{step}</Text>
        </View>
        <Text className="text-base font-bold text-stone-900">{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function EnquiryScreen() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug?: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsError, setProductsError] = useState(false);
  const [productsAttempt, setProductsAttempt] = useState(0);

  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    slug ? [slug] : [],
  );
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [units, setUnits] = useState("1");
  const [budget, setBudget] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [customisation, setCustomisation] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setProductsError(false);
        const data = await getProducts();
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setProductsError(true);
      }
    };

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [productsAttempt]);

  const handleSubmit = async () => {
    const issue = validateEnquiry({
      name,
      company,
      phone,
      email,
      occasion,
      units,
      budget,
      deliveryDate,
      selectedProducts,
    });

    if (issue) {
      Alert.alert(issue.title, issue.message);
      return;
    }

    const enquiry: EnquiryInput = {
      name: name.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim(),
      occasion,
      units: Number(units),
      budget,
      deliveryDate: deliveryDate.trim(),
      selectedProducts,
      customisation,
      message: message.trim(),
    };

    try {
      setSubmitting(true);
      await submitEnquiry(enquiry);

      // The enquiry already reached the server. A local save failure must not
      // be reported to the user as a failed submission.
      try {
        await saveEnquiry({
          ...enquiry,
          id: `${Date.now()}`,
          submittedAt: new Date().toISOString(),
          productNames: selectedProducts.map(
            (productSlug) =>
              products.find((product) => product.slug === productSlug)?.name ??
              productSlug,
          ),
        });
      } catch (storageError) {
        console.warn("Could not save enquiry locally:", storageError);
      }

      Alert.alert(
        "Enquiry Submitted",
        "Thank you! Your enquiry has been submitted successfully.",
        [{ text: "OK", onPress: () => router.replace("/enquiry-success") }],
      );
    } catch (error) {
      Alert.alert(
        "Submission Failed",
        error instanceof ApiError
          ? error.message
          : "Unable to submit your enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF6EE]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          <Text className="text-[11px] font-bold tracking-[2px] text-[#8A6A2B]">
            GET A QUOTE
          </Text>
          <Text className="mt-1 text-2xl font-extrabold text-stone-900">
            Product Enquiry
          </Text>

          <Text className="mb-6 mt-2 text-sm leading-5 text-stone-500">
            Share your requirements and our team will get in touch with you.
          </Text>

          {/* Products */}
          <Section step={1} title="Products *">
            {productsError ? (
              <TouchableOpacity
                onPress={() => setProductsAttempt((n) => n + 1)}
                className="flex-row items-center rounded-xl bg-red-50 px-4 py-3"
              >
                <Ionicons name="refresh" size={18} color="#B91C1C" />
                <Text className="ml-2 flex-1 text-sm text-red-700">
                  Couldn't load products. Tap to retry.
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
                {products.map((product) => (
                  <ChoiceRow
                    key={product.slug}
                    variant="checkbox"
                    label={product.name}
                    selected={selectedProducts.includes(product.slug)}
                    onPress={() =>
                      setSelectedProducts((prev) => toggle(prev, product.slug))
                    }
                  />
                ))}
              </View>
            )}
          </Section>

          {/* Customer Details */}
          <Section step={2} title="Contact Details">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full Name *"
              placeholderTextColor={PLACEHOLDER}
              className={INPUT}
            />

            <TextInput
              value={company}
              onChangeText={setCompany}
              placeholder="Company Name *"
              placeholderTextColor={PLACEHOLDER}
              className={INPUT}
            />

            <TextInput
              value={phone}
              onChangeText={(value) =>
                setPhone(value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10-digit Phone Number *"
              placeholderTextColor={PLACEHOLDER}
              keyboardType="phone-pad"
              maxLength={10}
              className={INPUT}
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address *"
              placeholderTextColor={PLACEHOLDER}
              keyboardType="email-address"
              autoCapitalize="none"
              className={`${INPUT} mb-0`}
            />
          </Section>

          {/* Occasion */}
          <Section step={3} title="Occasion *">
            {OCCASIONS.map((item) => (
              <ChoiceRow
                key={item}
                variant="radio"
                label={item}
                selected={occasion === item}
                onPress={() => setOccasion(item)}
              />
            ))}
          </Section>

          {/* Units + Budget */}
          <Section step={4} title="Quantity & Budget">
            <Text className="mb-2 text-sm font-semibold text-stone-700">
              Number of Units *
            </Text>

            <TextInput
              value={units}
              onChangeText={(value) => setUnits(value.replace(/\D/g, ""))}
              placeholder="Enter quantity"
              placeholderTextColor={PLACEHOLDER}
              keyboardType="number-pad"
              className={`${INPUT} mb-5`}
            />

            <Text className="mb-2 text-sm font-semibold text-stone-700">
              Budget Per Unit *
            </Text>

            {BUDGET_BANDS.map((band) => (
              <ChoiceRow
                key={band.label}
                variant="plain"
                label={band.label}
                selected={budget === band.label}
                onPress={() => setBudget(band.label)}
              />
            ))}
          </Section>

          {/* Delivery Date */}
          <Section step={5} title="Expected Delivery Date *">
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              className="min-h-[52px] flex-row items-center justify-between rounded-xl border border-[#E7DFCB] bg-[#FDFBF7] px-4 py-3"
            >
              <View className="flex-1 flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="#166534" />
                <Text
                  className={`ml-3 text-base ${
                    deliveryDate ? "text-stone-900" : "text-gray-400"
                  }`}
                >
                  {deliveryDate || "Select delivery date"}
                </Text>
              </View>

              <Text className="text-sm font-semibold text-[#14532D]">
                Choose date
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={
                  deliveryDate
                    ? new Date(`${deliveryDate}T12:00:00`)
                    : new Date()
                }
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);

                  if (event.type === "set" && selectedDate) {
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(
                      2,
                      "0",
                    );
                    const day = String(selectedDate.getDate()).padStart(2, "0");

                    setDeliveryDate(`${year}-${month}-${day}`);
                  }
                }}
              />
            )}
          </Section>

          {/* Customisation */}
          <Section step={6} title="Customisation Options">
            {CUSTOMISATIONS.map((item) => (
              <ChoiceRow
                key={item}
                variant="checkbox"
                label={item}
                selected={customisation.includes(item)}
                onPress={() => setCustomisation((prev) => toggle(prev, item))}
              />
            ))}
          </Section>

          {/* Message */}
          <Section step={7} title="Additional Message">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Tell us more about your requirements..."
              placeholderTextColor={PLACEHOLDER}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className={`${INPUT} mb-0 min-h-28`}
            />
          </Section>

          {/* Submit */}
          <TouchableOpacity
            disabled={submitting}
            onPress={handleSubmit}
            activeOpacity={0.85}
            accessibilityRole="button"
            className={`mt-2 min-h-[54px] items-center justify-center rounded-2xl ${
              submitting ? "bg-green-600" : "bg-[#14532D]"
            }`}
          >
            <Text className="text-base font-bold text-white">
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}