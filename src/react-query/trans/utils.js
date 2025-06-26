export function filterById(transactions, transId) {
  // eslint-disable-next-line array-callback-return
  return transactions
    .filter(item => item.t_id === transId)
    .map(r => {
      return { ...r };
    });
}
