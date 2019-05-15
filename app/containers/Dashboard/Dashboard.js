import React from "react";

import './Dashboard.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import TestChart from "../../components/TestChart/TestChart";

import Slider from "react-slick";

const sliderSettings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false
};

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            jobs: []
        }
    }

    componentDidMount() {
        this.getJobsAndSetToState()
        setInterval(()=>{
          this.getJobsAndSetToState()
        }, 5000)
      }
  
      getJobsAndSetToState() {
        let that = this;
        fetch('/data')
          .then(
            function(response) {
              if (response.status !== 200) {
                console.log(response.status);
                return;
              }
  
              response.json().then(function(jobs) {
                that.setState({jobs})
              });
            }
          )
          .catch(function(err) {
            console.log('Fetch Error :-S', err);
          });
      }

    render() {
      return (
        <div>
          <div className="header-title">{this.state.jobs.length > 0 ? "Automation test results" : "No tests are currently running"}</div>
          <Slider {...sliderSettings}>
            {this.state.jobs.map((job, index) => (
              <div className="charts-container" key={index}>
                <TestChart data={job} numOfJobs={this.state.jobs.length}/>
                </div>
            ))}
          </Slider>
        </div>
      )
    }
}