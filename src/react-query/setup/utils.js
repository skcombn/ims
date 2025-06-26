export function filterById(documentno, docnoId) {
  // eslint-disable-next-line array-callback-return
  return documentno
    .filter(item => item.ar_custid === docnoId)
    .map(r => {
      return { ...r };
    });
}
