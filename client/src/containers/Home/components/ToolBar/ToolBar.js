import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

const ToolBar = ({
  accountOptions,
  countryOptions,
  dataOptions,
  updateAccountsChosen,
  updateCountriesChosen,
  updateDataChosen
  }) => {

  return (
    <div className="row">
      <div className="col">
        Account:
        <Select
          closeMenuOnSelect={false}
          components={makeAnimated()}
          defaultValue={[accountOptions[0], accountOptions[6]]}
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
          defaultValue={[countryOptions[23]]}
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
