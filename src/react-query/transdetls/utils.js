export function filterById(transdetls, transId) {
  // eslint-disable-next-line array-callback-return
  return transdetls
    .filter(item => item.tl_id === transId)
    .map(r => {
      return { ...r };
    });
}
