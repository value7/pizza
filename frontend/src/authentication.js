import axios from 'axios';
import Cookies from 'universal-cookie';

var cookies = new Cookies();

const auth = {
  isAuthenticated: false,
  authenticate(cb) {
    axios.post('/api/authenticate', {
    name: 'test',
    password: 'test'
  })
  .then(function (response) {
    console.log(response);
    if(response.data.success) {
      cookies.set('token', response.data.token, { path: '/', maxAge: 86400 });
      cookies.set('user', response.data.user, { path: '/', maxAge: 86400 });
      auth.isAuthenticated = true;
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
