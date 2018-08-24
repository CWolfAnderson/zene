const getAccountOptions = (dataSet) => {
  return dataSet.reduce((acc, row) => {
    const accountOption = `${row.Account} (${row.ConsumerGroup}, ${row.PromotionCode})`;
    let found = false;
    for (let option of acc) {
      if (option.label === accountOption) {
        found = true;
        break;
      }
    }

    if (!found) {
      acc.push({
        data: {
          Account: row.Account,
          ConsumerGroup: row.ConsumerGroup,
          PromotionCode: row.PromotionCode,
        },
        label: accountOption,
        value: accountOption,
      });
    }

    return acc;
  }, [])
  .sort((a, b) => (a.label> b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
}

export default getAccountOptions;
