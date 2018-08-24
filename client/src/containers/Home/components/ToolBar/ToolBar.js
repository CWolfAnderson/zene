import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

import './ToolBar.scss';

// const accountOptions = ['Spotify (Free)', 'Spotify (Paid)', 'Apple Music (Free)', 'Apple Music (Paid)']
  // .map(account => ({ label: account, value: account }));

const ToolBar = ({ accountOptions, dataOptions, dataSet, updateAccountsChosen, updateCountriesChosen, updateDataChosen }) => {

  const countryOptions = dataSet
    .reduce((acc, row) => {
      if (!acc.includes(row.Country)) acc.push(row.Country);
      return acc;
    }, [])
    .sort()
    .map(country => ({ label: country, value: country }));

  return (
    <div className="row">
      <div className="col">
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
      <div className="col">
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
      <div className="col">
        Data:
        <Select
          closeMenuOnSelect={false}
          components={makeAnimated()}
          defaultValue={[...dataOptions]}
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
