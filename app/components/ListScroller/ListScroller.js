import React from "react";

import Slider from "react-slick";

import './ListScroller.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default class ListScroller extends React.Component {
    constructor(props) {
        super(props)
        this.settings = {
          infinite: true,
          slidesToShow: 8,
          slidesToScroll: 1,
          vertical: true,
          verticalSwiping: true,
          autoplay: true,
          autoplaySpeed: 1500,
          arrows: false
        };
        this.state = {
          list: []
        }
    }

    componentDidUpdate(prevProps) {
      if (this.props.list !== this.state.list) {
        this.setState({list: this.props.list})
      }
    }

    render() {
      let list = this.state.list;
      return (
        <div>
          <Slider {...this.settings}>
            {list.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </Slider>
        </div>
      )
    }
}