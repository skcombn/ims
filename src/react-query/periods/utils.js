export function filterByEmpId(payrun, empId) {
  // eslint-disable-next-line array-callback-return
  return payrun
    .filter((item) => item.empid === empId)
    .map((r) => {
      return { ...r };
    });
}
