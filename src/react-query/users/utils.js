export function filterById(suppliers, suppId) {
  // eslint-disable-next-line array-callback-return
  return suppliers
    .filter(item => item.ap_custid === suppId)
    .map(r => {
      return { ...r };
    });
}
