export function filterById(items, itemId) {
  // eslint-disable-next-line array-callback-return
  return items
    .filter(item => item.empid === itemId)
    .map(r => {
      return { ...r };
    });
}
