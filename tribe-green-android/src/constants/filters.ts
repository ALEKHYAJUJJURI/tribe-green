export const CATEGORIES = [
  "Drinkware",
  "Apparel",
  "Work Essentials",
  "Wellness",
];

export const OCCASIONS = [
  "Employee Onboarding",
  "Corporate Diwali Gifting",
  "New Year Gifts",
  "Client and Vendor Gifting",
  "Events and Trade Shows",
  "Employee Recognition",
];

export interface BudgetBand {
  label: string;
  min: number; // inclusive
  max: number; // exclusive
}

export const BUDGET_BANDS: BudgetBand[] = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500–₹1,500", min: 500, max: 1500 },
  { label: "₹1,500–₹3,000", min: 1500, max: 3000 },
  { label: "Above ₹3,000", min: 3000, max: Infinity },
];

export const CUSTOMISATIONS = [
  "Logo printing",
  "Laser engraving",
  "Name personalisation",
];