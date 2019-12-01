import React, {Component} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

var cookies = new Cookies();

class Pizzerias extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { pizzerias: [] };
    //this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    let that = this;
    axios.get('/api/pizzeria/getAll')
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
    });

  }
  render() {
    return (
      <div>
        {this.state.pizzerias.map((pizzeria) =>
          <Link to={"/pizzeria/" + pizzeria.name} key={pizzeria.id}>{pizzeria.name}({pizzeria.rating}/10)</Link>
        )}
      </div>
    )
  }
}

export default Pizzerias;
