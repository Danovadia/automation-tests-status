import React from "react";

import './TestChart.css';

import {
  ResponsiveContainer, PieChart, Pie, Legend, Cell
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
          name: '',
          updated: '',
          testsResults: [],
          totalTests: [],
        }
    }

    componentDidUpdate(prevProps, prevState) {
      let {data} = this.props;
      if (prevState.updated !== data.updated) {
        this.updateData()        
      }
      if (prevProps.numOfJobs !== this.props.numOfJobs) {
        this.setGrid(this.props.numOfJobs)
      }
    }

    componentDidMount() {
      this.setGrid(this.props.numOfJobs)
      this.updateData()
    }

    setGrid(numOfJobs) {
      console.log(numOfJobs)
      if (numOfJobs <= 3) {
        this.setState({ width: (window.innerWidth / numOfJobs) - 80, height: window.innerHeight - 150 })
      }
      if (numOfJobs > 3) {
        this.setState({ width: (window.innerWidth / 3) - 80, height: (window.innerHeight / 2) - 80 })
      }
    }

    updateData() {
      let {data} = this.props;

      let totalTests = data.tests.find((test) => test.name === 'total');
      let testsResults = data.tests.filter((test) => test.name !== 'total');
      
      this.setState(Object.assign(this.state, {
        name: data.name,
        updated: data.updated,
        totalTests: [totalTests],
        testsResults,
      }))
    }

    renderCustomizedLabel({cx, cy, midAngle, innerRadius, outerRadius, value}) {
       const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={value < 3 ? "10" : "20"}>
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
          <div className="test-chart-container" style={{ width: this.state.width, height: this.state.height }}>
            <span>{this.state.name}</span>
            <ResponsiveContainer>
              <PieChart className="test-chart">
              {/* <Pie className="total-tests" data={totalTests} dataKey="value" cx={400} cy={350} innerRadius={270} outerRadius={300} fill={colors.total} label /> */}
                <Pie
                  data={testsResults}
                  labelLine={false}
                  label={this.renderCustomizedLabel}
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
            </ResponsiveContainer>
            <div className="progress-wrapper">
              <div className="text-center" style={{width: this.state.width}}>{finishedTestsPercent.toFixed(0)}% - ({finishedTestsNum} / {totalTestsNum})</div>
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