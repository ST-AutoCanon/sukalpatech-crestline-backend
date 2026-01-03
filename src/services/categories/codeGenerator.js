export function generateNextCode(lastCode) {
  if (!lastCode) return "0001";

  const next = parseInt(lastCode, 10) + 1;
  return next.toString().padStart(4, "0");
}
