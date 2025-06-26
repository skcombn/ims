export function filterById(payable, salesId) {
  // eslint-disable-next-line array-callback-return
  return payable
    .filter(item => item.empid === salesId)
    .map(r => {
      return { ...r };
    });
}
