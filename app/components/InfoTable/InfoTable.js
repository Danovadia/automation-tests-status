import React from "react";

import './InfoTable.css';

export default class InfoTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          tableData: []
        }
    }

    componentDidUpdate(prevProps) {
      if (this.props.tableData !== this.state.tableData) {
        this.setState({tableData: this.props.tableData})
      }
    }

    render() {
      let tableData = this.state.tableData;
      return (
        <table className="infoTable">
          <tbody>
            {tableData.map((line, index) => (
              <tr key={index}>
                <td>
                  {line.name}
                </td>
                <td>
                  {line.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
}