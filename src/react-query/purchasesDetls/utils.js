export function filterById(purchases, purchasesId) {
  // eslint-disable-next-line array-callback-return
  return purchases
    .filter(item => item.empid === purchasesId)
    .map(r => {
      return { ...r };
    });
}
