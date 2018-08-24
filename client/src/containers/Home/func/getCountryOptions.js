const getCountryOptions = (dataSet) => {
  return dataSet.reduce((acc, row) => {
    if (!acc.includes(row.Country)) acc.push(row.Country);
    return acc;
  }, [])
  .sort()
  .map(country => ({ label: country, value: country }));
}

export default getCountryOptions;
