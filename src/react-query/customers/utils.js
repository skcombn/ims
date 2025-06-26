export function filterById(customers, custId) {
  // eslint-disable-next-line array-callback-return
  return customers
    .filter(item => item.ar_custid === custId)
    .map(r => {
      return { ...r };
    });
}
