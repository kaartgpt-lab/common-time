/**
 * Slugify for product URLs
 */
export function slugify(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Price formatter: paise to INR display
 */
export function formatPrice(paise) {
  if (paise == null || isNaN(paise)) return "₹0";
  const rupees = paise;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}
