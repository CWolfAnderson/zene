import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

import './ToolBar.scss';

// const accountOptions = ['Spotify (Free)', 'Spotify (Paid)', 'Apple Music (Free)', 'Apple Music (Paid)']
  // .map(account => ({ label: account, value: account }));

const dataOptions = ['Users', 'Revenue', 'Streams']
  .map(data => ({ label: data, value: data }));

const ToolBar = ({ accountOptions, dataSet, updateAccountsChosen, updateCountriesChosen, updateDataChosen }) => {

  const countryOptions = dataSet
    .reduce((acc, row) => {
      if (!acc.includes(row.Country)) acc.push(row.Country);
      return acc;
    }, [])
    .sort()
    .map(country => ({ label: country, value: country }));

  return (
    <div>
      <div style={{ width: '800px' }}>
        Account:
        <Select
          closeMenuOnSelect={false}
          components={makeAnimated()}
          isMulti
          onChange={updateAccountsChosen}
          options={accountOptions}
          placeholder="Select Account(s)"
        />
      </div>
      <div style={{ width: '800px' }}>
        Countries:
        <Select
          closeMenuOnSelect={false}
          components={makeAnimated()}
          isMulti
          onChange={updateCountriesChosen}
          options={countryOptions}
          placeholder="Select Countries"
        />
      </div>
      <div style={{ width: '800px' }}>
        Data:
        <Select
          closeMenuOnSelect={false}
          components={makeAnimated()}
          isMulti
          onChange={updateDataChosen}
          options={dataOptions}
          placeholder="Select Data"
        />
      </div>
    </div>
  );
}

export default ToolBar;
