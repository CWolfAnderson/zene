import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import ToolBar from './components/ToolBar';

import importedDataSet from '../../assets/dataset.json';
import getAccountOptions from './func/getAccountOptions';
import getCountryOptions from './func/getCountryOptions';
import getDateOptions from './func/getDateOptions';
import getDates from './func/getDates';

/*
TODOs:
Loop over the data set one time to import the accountOptions, countryOptions, dataOptions, and dates
Update the `importedDataSet` to be one large object for O(1) look up time
Add functionality to put all lines on one graph (Users, Revenue, & Streams)
Don't have the colors change for every filter change
*/

const accountOptions = getAccountOptions(importedDataSet);
const countryOptions = getCountryOptions(importedDataSet);
const dataOptions = getDateOptions(importedDataSet);
const dates = getDates(importedDataSet); // ["4/1/17", "5/1/17", "6/1/17"...]

export default class Home extends Component {

  state = {
    accountsChosen: [accountOptions[0].data, accountOptions[6].data],
    countriesChosen: [countryOptions[23].value],
    dataChosen: dataOptions.map(option => option.label),
    graphData: {},
    importedDataSet,
  }

  componentDidMount() {
    this.updateResults();
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

  updateGraphData = () => {
    const { dataChosen, graphData } = this.state;
    dataChosen.forEach((data) => {
      graphData[data] = {
        datasets: [],
        labels: dates,
      }
    });
    // console.log('graphData', graphData); // { Revenue: {datasets: Array(0), labels: Array(7)}, Streams: {datase...
    this.setState({ graphData });
  }

  updateResults = () => {

    this.updateGraphData();
    const { accountsChosen, countriesChosen, dataChosen, graphData, importedDataSet } = this.state;
    const results = [];

    // strip out rows from `importedDataSet` that we need
    accountsChosen.forEach((account) => {
      // console.log('account', account); // {Account: "Apple", ConsumerGroup: "Premium", PromotionCode: "Trial"}
      const { Account, ConsumerGroup, PromotionCode } = account;
      countriesChosen.forEach((Country) => {
        importedDataSet.forEach((row) => {
          if (row.Country === Country
            && row.PromotionCode === PromotionCode
            && row.ConsumerGroup === ConsumerGroup
            && row.Account === Account) {
              results.push(row);
          }
        });
      });
    }); 
    // console.log('results', results);

    // format only those rows we need
    dataChosen.forEach((dataDisplayed) => {

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
          // create an empty array of 0s, one for each x coordinate
          const data = new Array(dates.length + 1).join('0').split('').map(parseFloat);
          const index = dates.indexOf(res.MonthBooked);
          const randColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
          data[index] = res[dataDisplayed];
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
            pointHoverRadius: 3,
            pointHoverBackgroundColor: randColor,
            pointHoverBorderColor: randColor,
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data,
          });
        } else {
          const index = dates.indexOf(res.MonthBooked);
          datasets[datasets.length-1].data[index] = res[dataDisplayed];
        }

        // console.log('datasets', datasets);
        graphData[dataDisplayed].datasets = datasets;
        // console.log('graphData', graphData);
        this.setState({ graphData });
      });
    });
  }

  render() {
    const { dataChosen, importedDataSet, graphData } = this.state;

    return (
      <div className="container">
        <h3 className="text-center mb-5 mt-3">
          Zene - Music Visualized
        </h3>
        <ToolBar
          accountOptions={accountOptions}
          countryOptions={countryOptions}
          dataOptions={dataOptions}
          updateAccountsChosen={this.handleUpdateAccountsChosen}
          updateCountriesChosen={this.handleUpdateCountriesChosen}
          updateDataChosen={this.handleUpdateDataChosen}
        />

        {dataChosen.map((dataDisplayed) => {
          return (
            <div
              className="mt-4 mb-5"
              key={dataDisplayed}
            >
              <Line
                data={graphData[dataDisplayed] || {}}
                options={{
                  scales: {
                    yAxes: [{
                      ticks: {
                        min: 0,
                      },
                      scaleLabel: {
                        display: true,
                        fontSize: 14,
                        labelString: `Amount of ${dataDisplayed}`,
                      },
                    }],
                    xAxes: [{
                      scaleLabel: {
                        display: true,
                        fontSize: 14,
                        labelString: 'Month Booked',
                      },
                    }],
                  },
                  title: {
                    display: true,
                    fontSize: 20,
                    text: dataDisplayed,
                  },
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
