import React, {Component} from 'react'
import axios from 'axios';
import { Redirect } from "react-router-dom";

import auth from '../authentication';

class AddPizzeria extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', addresse: '', link: '', redirect: '' };
  }
  submitHandler = (event) => {
    event.preventDefault();
    console.log(this.state);
    axios.post('/api/pizzeria/add', {
      name: this.state.name,
      addresse: this.state.addresse,
      link: this.state.link
    })
    .then(function (response) {
      console.log(response);
      if(response.data.success) {
        console.log('redirect to the restaurant page TODO')
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  redirect = () => {
    console.log('asdfsadfsadfasdf');
    this.setState({redirect: "/protected"})
  }
  nameChangeHandler = (event) => {
    this.setState({name: event.target.value});
  }
  addresseChangeHandler = (event) => {
    this.setState({addresse: event.target.value});
  }
  linkChangeHandler = (event) => {
    this.setState({link: event.target.value});
  }
  render() {
    if(this.state.redirect.length > 0) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <form onSubmit={this.submitHandler}>
        <p>name:</p>
        <input
          type='text'
          onChange={this.nameChangeHandler}
        />
        <p>addresse:</p>
        <input
          type='text'
          onChange={this.addresseChangeHandler}
        />
        <p>link:</p>
        <input
          type='text'
          onChange={this.linkChangeHandler}
        />
        <input
          type='submit'
        />
      </form>
    );
  }
}

export default AddPizzeria;
