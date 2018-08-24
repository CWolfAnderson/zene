import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import ToolBar from './components/ToolBar';

import './Home.scss';

import importedDataSet from '../../assets/dataset.json';

/*
TODOs:
Update the `importedDataSet` to be one large object for O(1) look up time
Put all lines on one graph (Users, Revenue, & Streams)
Don't have the colors change for every filter change
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

// console.log('dates', dates); // ["4/1/17", "5/1/17", "6/1/17"...]

const dataOptions = ['Users', 'Revenue', 'Streams']
  .map(data => ({ label: data, value: data }));

export default class Home extends Component {

  state = {
    accountsChosen: [],
    countriesChosen: [],
    dataChosen: dataOptions.map(option => option.label),
    graphData: {},
    importedDataSet,
  }

  componentDidMount() {
    this.updateGraphData();
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

    // strip out rows that we need
    accountsChosen.forEach((account) => {
      // console.log('account', account); // {Account: "Apple", ConsumerGroup: "Premium", PromotionCode: "Trial"}
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
    // console.log('results', results);

    // format only the rows we need
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
          const data = new Array(dates.length + 1).join('0').split('').map(parseFloat);
          const index = dates.indexOf(res.MonthBooked);
          const randColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
          data[index] = res[dataDisplayed]; // TODO: change this from users to a state variable
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
          datasets[datasets.length-1].data[index] = res[dataDisplayed];
        }

        // console.log('datasets', datasets);
        graphData[dataDisplayed].datasets = datasets;
        // console.log('graphData', graphData);
        this.setState({ graphData });
      });
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

        {dataChosen.map((dataDisplayed) => {
          return (
            <div
              className="mt-5 mb-5"
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
