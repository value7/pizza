import React, {Component} from 'react'
import axios from 'axios';

class Pizzerias extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { pizzerias: [] };
    //this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    let that = this;
    axios.get('/api/getPizzerias')
    .then(function (response) {
      // handle success
      console.log(response);
      that.setState({
        pizzerias: response.data.pizzerias
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  }
  render() {
    return (
      <div>
        {this.state.pizzerias.map((pizzeria) =>
          <div>{pizzeria.name}</div>
        )}
      </div>
    )
  }
}

export default Pizzerias;
