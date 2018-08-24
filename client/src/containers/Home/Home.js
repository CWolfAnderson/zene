import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import ToolBar from './components/ToolBar';

import './Home.scss';

import importedDataSet from '../../assets/dataset.json';

/*
TODOs:
Handle clearing filters
*/

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
  // .sort(); // TODO: make sure dates are sorted properly

console.log('dates', dates);

const dataOptions = ['Users', 'Revenue', 'Streams']
  .map(data => ({ label: data, value: data }));

export default class Home extends Component {

  state = {
    accountsChosen: [],
    countriesChosen: [],
    dataChosen: dataOptions.map(option => option.label),
    graphData: {
      datasets: [],
      labels: dates,
    },
    importedDataSet,
  }

  updateResults = () => {
    const { accountsChosen, countriesChosen, graphData, importedDataSet } = this.state;

    const results = [];
    // TODO: update the `importedDataSet` to be one large object for O(1) look up time
    accountsChosen.forEach((account) => {
      // console.log('account', account);
      const { Account, ConsumerGroup, PromotionCode } = account;
      countriesChosen.forEach((Country) => {
        importedDataSet.forEach((row) => {
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
          }
        });
      });
    }); 
    console.log('results', results);
    const datasets = [];
    results.forEach((res) => {
      const uid = `${res.Account} ${res.ConsumerGroup} ${res.PromotionCode} ${res.Country}`;
      let found = false;
      for (let set of datasets) {
        if (set.uid === uid) {
          found = true;
          break;
        }
      }

      if (!found) {
        const data = new Array(dates.length + 1).join('0').split('').map(parseFloat);
        const index = dates.indexOf(res.MonthBooked);
        const randColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        data[index] = res.Users; // TODO: change this from users to a state variable
        const uid = `${res.Account} ${res.ConsumerGroup} ${res.PromotionCode} ${res.Country}`;
        datasets.push({
          uid,
          label: `${res.Country} - ${res.Account} (${res.ConsumerGroup}, ${res.PromotionCode})`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: randColor,
          borderColor: randColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: randColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: randColor,
          pointHoverBorderColor: randColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data,
        });
      } else {
        const index = dates.indexOf(res.MonthBooked);
        datasets[datasets.length-1].data[index] = res.Users;
      }

      console.log('datasets', datasets);
      graphData.datasets = datasets;
      this.setState({ graphData });
    });

  }

  handleUpdateAccountsChosen = (e) => {
    // console.log('e', e);
    let { accountsChosen } = this.state;
    accountsChosen = e.map(account => account.data);
    this.setState({ accountsChosen }, this.updateResults);
  }

  handleUpdateCountriesChosen = (e) => {
    // console.log('e', e);
    let { countriesChosen } = this.state;
    countriesChosen = e.map(country => country.value);
    this.setState({ countriesChosen }, this.updateResults);
  }

  handleUpdateDataChosen = (e) => {
    // console.log('e', e);
    let { dataChosen } = this.state;
    dataChosen = e.map(data => data.value);
    this.setState({ dataChosen }, this.updateResults);
  }

  render() {
    const { dataChosen, importedDataSet, graphData } = this.state;

    return (
      <div className="container">
        <ToolBar
          accountOptions={accountOptions}
          dataOptions={dataOptions}
          dataSet={importedDataSet}
          updateAccountsChosen={this.handleUpdateAccountsChosen}
          updateCountriesChosen={this.handleUpdateCountriesChosen}
          updateDataChosen={this.handleUpdateDataChosen}
        />
        <div
          style={{
            width: '1000px',
          }}
        >
          {dataChosen.map((dataDisplayed) => {
            return (
              <Line
                data={graphData}
                key={dataDisplayed}
                options={{
                  scales: {
                    yAxes: [{
                      ticks: {
                        // max: this.props.maxY,
                        min: 0,
                        // stepSize: 3
                      }
                    }]
                  },
                  title: {
                    display: true,
                    text: dataDisplayed,
                  },
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
