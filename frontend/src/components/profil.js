import React, {Component} from 'react'
import axios from 'axios';
import Cookies from 'universal-cookie';

var cookies = new Cookies();

class Profil extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { user: null };
    //this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    let that = this;
    var username = cookies.get('user');
    console.log(username);
    var token = cookies.get('token');
    var headers = {
      'x-access-token': token
    }

    axios.get('/api/users/' + username, { params:{}, headers: headers })
    .then(function (response) {
      // handle success
      console.log(response);
      that.setState({
        user: response.data.user
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
        {this.state.user ? (
          <div> username: {this.state.user.name} </div>
        ) : (
          <div> not logged in at the moment </div>
        )}
      </div>
    )
  }
}

export default Profil;
