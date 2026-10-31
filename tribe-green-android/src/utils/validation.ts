
import { BUDGET_BANDS, OCCASIONS } from "../constants/filters";

export interface ValidationIssue {
  title: string;
  message: string;
}

export interface EnquiryFormValues {
  name: string;
  company: string;
  phone: string;
  email: string;
  occasion: string;
  units: string;
  budget: string;
  deliveryDate: string;
  selectedProducts: string[];
}

const checkDate = (value: string): "ok" | "invalid" | "past" => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return "invalid";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  // Reject impossible dates such as 2026-02-30.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return "invalid";
  }

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return date.getTime() >= todayUtc ? "ok" : "past";
};

export function validateEnquiry(
  v: EnquiryFormValues
): ValidationIssue | null {
  // Required fields
  if (
    !v.name.trim() ||
    !v.company.trim() ||
    !v.phone.trim() ||
    !v.email.trim() ||
    !v.occasion ||
    !v.budget ||
    !v.deliveryDate.trim() ||
    !v.units.trim()
  ) {
    return {
      title: "Missing Details",
      message: "Please fill in all required fields.",
    };
  }

  // Name
  if (v.name.trim().length < 2) {
    return {
      title: "Invalid Name",
      message: "Name must contain at least 2 characters.",
    };
  }

  if (!/^[\p{L}\p{M} .'-]+$/u.test(v.name.trim())) {
    return {
      title: "Invalid Name",
      message: "Name can contain letters, spaces, apostrophes, dots, and hyphens only.",
    };
  }

  // Company
  if (v.company.trim().length < 2) {
    return {
      title: "Invalid Company",
      message: "Company name must contain at least 2 characters.",
    };
  }

  // Phone: Indian mobile number
  if (!/^[6-9]\d{9}$/.test(v.phone.trim())) {
    return {
      title: "Invalid Phone",
      message: "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.",
    };
  }

  // Email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) {
    return {
      title: "Invalid Email",
      message: "Please enter a valid email address.",
    };
  }

  // Occasion
  if (!(OCCASIONS as readonly string[]).includes(v.occasion)) {
    return {
      title: "Invalid Occasion",
      message: "Please select a valid occasion.",
    };
  }

  // Quantity
  const units = Number(v.units);

  if (!Number.isInteger(units) || units < 1) {
    return {
      title: "Invalid Quantity",
      message: "Units must be a whole number greater than zero.",
    };
  }

  // Budget
  const validBudgets = BUDGET_BANDS.map((band) => band.label);

  if (!validBudgets.includes(v.budget)) {
    return {
      title: "Invalid Budget",
      message: "Please select a valid budget option.",
    };
  }

  // Delivery date
  const dateStatus = checkDate(v.deliveryDate.trim());

  if (dateStatus === "invalid") {
    return {
      title: "Invalid Date",
      message: "Enter a real date in YYYY-MM-DD format.",
    };
  }

  if (dateStatus === "past") {
    return {
      title: "Invalid Date",
      message: "Delivery date can't be in the past.",
    };
  }

  // Products
  if (v.selectedProducts.length === 0) {
    return {
      title: "Product Required",
      message: "Please select at least one product.",
    };
  }

  return null;
}
