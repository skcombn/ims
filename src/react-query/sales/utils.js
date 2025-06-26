export function filterById(sales, salesId) {
  // eslint-disable-next-line array-callback-return
  return sales
    .filter(item => item.empid === salesId)
    .map(r => {
      return { ...r };
    });
}
