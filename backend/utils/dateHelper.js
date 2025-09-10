export function getDateKey(date = new Date()) {
  const istOffset = 5.5 * 60 * 60 * 1000; // +5:30
  const istDate = new Date(date.getTime() + istOffset);

  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istDate.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
