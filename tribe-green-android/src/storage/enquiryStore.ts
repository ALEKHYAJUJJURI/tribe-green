import AsyncStorage from "@react-native-async-storage/async-storage";

import type { SavedEnquiry } from "../types/enquiry";

const STORAGE_KEY = "tribe-green:my-enquiries";

export async function getSavedEnquiries(): Promise<SavedEnquiry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveEnquiry(enquiry: SavedEnquiry): Promise<void> {
  const existing = await getSavedEnquiries();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([enquiry, ...existing]));
}