const formatRupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const formatPriceRange = (min: number, max: number) =>
  min === max ? formatRupees(min) : `${formatRupees(min)} - ${formatRupees(max)}`;


export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });