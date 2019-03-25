import React from "react";

import './TestChart.css';

import {
  PieChart, Pie, Legend, Cell
} from 'recharts';
import {Progress} from "reactstrap";

const colors = {
  total: "#8ebfec",
  pass: "#7cdc7c",
  fail: "#f34545",
  skip: "#afafaf",
  openissue: "#e8b264",
}

const RADIAN = Math.PI / 180;


export default class TestChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          updated: '',
          testsResults: [],
          totalTests: [],
        }
    }

    componentDidMount() {
      this.getTestsAndSetToState()
      setInterval(()=>{
        this.getTestsAndSetToState()
      }, 5000)
    }

    getTestsAndSetToState() {
      let that = this;
      fetch('/data')
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }

            // Examine the text in the response
            response.json().then(function(data) {
              data = data[0];
              let totalTests = data.tests.find((test) => test.name === 'total');
              let testsResults = data.tests.filter((test) => test.name !== 'total');
              
              that.setState(Object.assign(that.state, {
                updated: data.updated,
                totalTests: [totalTests],
                testsResults,
              }))
            });
          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    }

    renderCustomizedLabel({cx, cy, midAngle, innerRadius, outerRadius, value}) {
       const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={value < 3 ? "20" : "30"}>
          {value}
        </text>
      );
    };

    render() {
        const { totalTests, testsResults } = this.state;
        const totalTestsNum = totalTests.length > 0 ? totalTests[0].value : 0;
        const finishedTestsNum = testsResults.reduce((acc, cur) => acc + cur.value, 0);
        const finishedTestsPercent = totalTests.length > 0 ? finishedTestsNum / totalTestsNum * 100 : 0;
        return (
          <div className="test-chart-container">
            <PieChart width={800} height={580} className="test-chart">
            {/* <Pie className="total-tests" data={totalTests} dataKey="value" cx={400} cy={350} innerRadius={270} outerRadius={300} fill={colors.total} label /> */}
              <Pie
                data={testsResults}
                cx={400}
                cy={280}
                labelLine={false}
                label={this.renderCustomizedLabel}
                outerRadius={250}
                fill="#8884d8"
                dataKey="value"
                legendType="square"
              >
                {
                  testsResults.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[entry.name.toLowerCase()]} />)
                }
              </Pie>
              <Legend verticalAlign="top" height={36} formatter={
                (value, entry) => {
                  const { color } = entry;
                  
                  return value !== "empty" && <span>{value}</span>;
                }
              }/>
            </PieChart>
            <div className="progress-wrapper">
              <div className="text-center">{finishedTestsPercent.toFixed(0)}% - ({finishedTestsNum} / {totalTestsNum})</div>
              <Progress multi>
                {testsResults.map((test, index) => (
                  <Progress bar value={(test.value / totalTests[0].value) * 100} color={test.name} key={index}/>
                ))}
              </Progress>
            </div>
          </div>
        )
    }
}