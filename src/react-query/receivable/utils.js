export function filterById(receivable, salesId) {
  // eslint-disable-next-line array-callback-return
  return receivable
    .filter(item => item.empid === salesId)
    .map(r => {
      return { ...r };
    });
}
