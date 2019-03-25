import React from "react";

import './Dashboard.css';
import TestChart from "../../components/TestChart/TestChart";

export default class Dashboard extends React.Component {
    render() {
        return (
            <div>
                <div className="header-title">Automation test results</div>
                <TestChart></TestChart>
            </div>
        )
    }
}