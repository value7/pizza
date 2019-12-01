import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

var cookies = new Cookies();

class Pizzeria extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {rating: 0};
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.submitRating = this.submitRating.bind(this);
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
  handleRatingChange(e) {
    this.setState({rating: e.target.value})
  }
  submitRating() {
    console.log(this.state)
    axios.post('/api/rating/add', {
      pizzeriaId: this.state.pizzeria.id,
      rating: this.state.rating
    })
    .then(function (response) {
      console.log(response);
      if(response.data.success) {
        console.log('TODO: what happens after rating')
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    return (
      <div>
      PIZZERIA SITE
        {this.state.pizzeria ? (
          <div>
            <div>
              <div>name: {this.state.pizzeria.name}</div>
              <div>addresse: {this.state.pizzeria.addresse}</div>
              <div>link: {this.state.pizzeria.website}</div>
              <div>rating: {this.state.pizzeria.rating}</div>
            </div>
            <div className="ratingWrapper">
            <input
              id="ratingSlider"
              type="range"
              min="0" max="10"
              value={this.state.rating}
              onChange={this.handleRatingChange}
              step="1"/>
              <button onClick={this.submitRating}>give {this.state.pizzeria.name} an {this.state.rating}/10</button>
            </div>
          </div>
        ) : (
          <div>loading</div>
        )}
      </div>
    )
  }
}

export default withRouter(Pizzeria);
