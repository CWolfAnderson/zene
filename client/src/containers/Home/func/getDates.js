const getDates = (dataSet) => {
  return dataSet.reduce((acc, row) => {
    if (!acc.includes(row.MonthBooked)) acc.push(row.MonthBooked);
    return acc;
  }, []);
  // TODO: make sure dates are sorted properly
}

export default getDates;
