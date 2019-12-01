import axios from 'axios';
import Cookies from 'universal-cookie';

var cookies = new Cookies();

const auth = {
  isAuthenticated: false,
  username: undefined,
  signin(name, pass, cb) {
    axios.post('/api/authenticate', {
    name: name,
    password: pass
    })
    .then(function (response) {
      console.log(response);
      if(response.data.success) {
        cookies.set('token', response.data.token, { path: '/', maxAge: 86400 });
        cookies.set('user', response.data.user, { path: '/', maxAge: 86400 });
        auth.isAuthenticated = true;
        auth.username = response.data.user;
        cb();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  checkIfCookie(cb) {
    if(typeof cookies.get('token') !== 'undefined' && typeof cookies.get('user') !== 'undefined') {
      auth.isAuthenticated = true;
      auth.username = cookies.get('user');
    }
    if(typeof cb !== 'undefined') {
      cb();
    }
  },
  signup(name, pass, cb) {
    axios.post('/api/users/signup', {
      name: name,
      password: pass
    })
    .then(function (response) {
      console.log(response);
      if(response.data.success) {
        cookies.set('token', response.data.token, { path: '/', maxAge: 86400 });
        cookies.set('user', response.data.user, { path: '/', maxAge: 86400 });
        auth.isAuthenticated = true;
        auth.username = response.data.user;
        cb();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  signout(cb) {
    cookies.remove('token', { path: '/' });
    cookies.remove('user', { path: '/' });
    auth.isAuthenticated = false;
    cb();
  }
};

export default auth;
