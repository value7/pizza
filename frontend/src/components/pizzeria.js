import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

var cookies = new Cookies();

class Pizzeria extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {};
    //this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    let that = this;
    console.log(this.props.match.params);

    axios.get('/api/pizzeria/getDetails/' + this.props.match.params.name)
    .then(function (response) {
      // handle success
      console.log(response);
      that.setState({
        pizzeria: response.data.pizzeria
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  }
  render() {
    return (
      <div>
      PIZZERIA SITE
        {this.state.pizzeria ? (
          <div>
            <div>name: {this.state.pizzeria.name}</div>
            <div>addresse: {this.state.pizzeria.addresse}</div>
            <div>link: {this.state.pizzeria.website}</div>
            </div>
        ) : (
          <div>loading</div>
        )}
      </div>
    )
  }
}

export default withRouter(Pizzeria);
