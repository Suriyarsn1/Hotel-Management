function getStatus(expiryDate, threshold, stock) {
  const now = new Date();
  const exp = new Date(expiryDate);
  if (exp < now) return { label: "EXPIRED", color: "bg-red-100 text-red-700" };
  if ((exp - now) / (1000 * 60 * 60 * 24) <= 3) return { label: "Expiring Soon!", color: "bg-yellow-100 text-yellow-800" };
  if (stock <= threshold) return { label: "Low Stock", color: "bg-orange-100 text-orange-700" };
  return { label: "OK", color: "bg-green-100 text-green-700" };
}
export default getStatus