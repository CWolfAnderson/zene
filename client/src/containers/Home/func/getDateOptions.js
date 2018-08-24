const getDateOptions = (dataSet) => {
  return ['Users', 'Revenue', 'Streams']
  .map(data => ({ label: data, value: data }));
}

export default getDateOptions;
