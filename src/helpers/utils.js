export const formatCurrency = (number) => {
  const newNumber = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
  return newNumber;
};

export const formatNumber = (number) => {
  const newNumber = Intl.NumberFormat("en-US", {
    maximumFractionDigits: 3,
  }).format(number);
  return newNumber;
};

export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type]);
  if (type === "colors") {
    unique = unique.flat();
  }
  return ["all", ...new Set(unique)];
};

// export function formatPrice(cents) {
//   if (!cents) return null;

//   return cents.toLocaleString("en-US", {
//     style: "currency",
//     currency: "USD",
//   });
// }
export function formatPriceZero(cents) {
  //if (!cents) return null;

  return cents.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
