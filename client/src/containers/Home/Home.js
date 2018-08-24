import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import ToolBar from './components/ToolBar';

import './Home.scss';

import importedDataSet from '../../assets/dataset.json';

const accountOptions = importedDataSet
  .reduce((acc, row) => {
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

const dates = importedDataSet
  .reduce((acc, row) => {
    if (!acc.includes(row.MonthBooked)) acc.push(row.MonthBooked);
    return acc;
  }, [])
  .sort();

console.log('dates', dates);

const usersData = importedDataSet
  .map(data => data.Users);

const randColor1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
export default class Home extends Component {

  state = {
    accountsChosen: [],
    countriesChosen: [],
    dataChosen: [],
    graphData: {
      labels: dates,
      datasets: [
        /* {
          label: 'Users, Revenue, or Streams',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40],
          // data: [[65, 59, 80, 81, 56, 55, 40], [34, 23, 12, 53, 34, 23, 12]],
          // data: [], // TODO: update this with appropriate data
        }, */
      ],
    },
    importedDataSet,
  }

  updateResults = () => {
    const { accountsChosen, countriesChosen, importedDataSet } = this.state;

    const results = [];
    // TODO: update the `importedDataSet` to be one large object for O(1) look up time
    for (let account of accountsChosen) {
      // console.log('account', account);
      const { Account, ConsumerGroup, PromotionCode } = account;
      for (let Country of countriesChosen) {
        for (let row of importedDataSet) {
          /* console.log('row', row);
          console.log('Account', Account);
          console.log('ConsumerGroup', ConsumerGroup);
          console.log('PromotionCode', PromotionCode);
          console.log('Country', Country); */
          if (row.Country === Country
            && row.PromotionCode === PromotionCode
            && row.ConsumerGroup === ConsumerGroup
            && row.Account === Account) {
              results.push(row);
              break;
          }
        }
      }
    } 
    console.log('results', results);
  }

  handleUpdateAccountsChosen = (e) => {
    console.log('e', e);
    let { accountsChosen } = this.state;
    accountsChosen = e.map(account => account.data);
    this.setState({ accountsChosen }, this.updateResults);
  }

  handleUpdateCountriesChosen = (e) => {
    console.log('e', e);
    let { countriesChosen } = this.state;
    countriesChosen = e.map(country => country.value);
    this.setState({ countriesChosen }, this.updateResults);
  }

  handleUpdateDataChosen = (e) => {
    console.log('e', e);
    let { dataChosen } = this.state;
    dataChosen = e.map(data => data.value);
    this.setState({ dataChosen }, this.updateResults);
  }

  render() {
    const { accountsChosen, importedDataSet, graphData } = this.state;

    graphData.datasets = importedDataSet

    return (
      <div>
        <ToolBar
          accountOptions={accountOptions}
          // accountsChosen={accountsChosen}
          dataSet={importedDataSet}
          updateAccountsChosen={this.handleUpdateAccountsChosen}
          updateCountriesChosen={this.handleUpdateCountriesChosen}
          updateDataChosen={this.handleUpdateDataChosen}
        />
        <Line data={graphData} />
      </div>
    );
  }
}
