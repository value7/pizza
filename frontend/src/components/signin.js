import React, {Component} from 'react'
import axios from 'axios';
import { Redirect } from "react-router-dom";

import auth from '../authentication';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '', redirect: '' };
  }
  submitHandler = (event) => {
    event.preventDefault();
    console.log("You are submitting " + this.state.username + " " + this.state.password);
    auth.signin(this.state.username, this.state.password, this.redirect);
  }
  redirect = () => {
    console.log('asdfsadfsadfasdf');
    this.setState({redirect: "/protected"});
    this.props.update();
  }
  nameChangeHandler = (event) => {
    this.setState({username: event.target.value});
  }
  passwordChangeHandler = (event) => {
    this.setState({password: event.target.value});
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
        <p>password:</p>
        <input
          type='password'
          onChange={this.passwordChangeHandler}
        />
        <input
          type='submit'
        />
      </form>
    );
  }
}

export default SignIn;
