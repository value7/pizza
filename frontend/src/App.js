import React, { Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import auth from './authentication';
import Cookies from 'universal-cookie';
import Pizzerias from './components/pizzerias';
import SignUp from './components/signup';
import SignIn from './components/signin';
import Profil from './components/profil';
import AddPizzeria from './components/addPizzeria';
import Pizzeria from './components/pizzeria';

var cookies = new Cookies();

// This example has 3 pages: a public page, a protected
// page, and a login screen. In order to see the protected
// page, you must first login. Pretty standard stuff.
//
// First, visit the public page. Then, visit the protected
// page. You're not yet logged in, so you are redirected
// to the login page. After you login, you are redirected
// back to the protected page.
//
// Notice the URL change each time. If you click the back
// button at this point, would you expect to go back to the
// login page? No! You're already logged in. Try it out,
// and you'll see you go back to the page you visited
// just *before* logging in, the public page.

class AuthExample extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    // Don't call this.setState() here!
    this.state = { loggedIn: this.props.auth };
    this.shouldUpdateAuth = this.shouldUpdateAuth.bind(this);
  }
  componentDidMount() {
    //check cookie for logged in
    console.log(cookies.get('token'));
    if(cookies.get('token')) {
      this.setState({loggedIn: true, username: undefined})
    }
    auth.checkIfCookie(this.shouldUpdateAuth);
  }
  shouldUpdateAuth() {
    console.log('shouldUpdateAuth' + auth.isAuthenticated);
    if(auth.isAuthenticated !== this.state.loggedIn) {
      this.setState({loggedIn: auth.isAuthenticated, username: auth.username})
    }
  }
  logProps() {
    console.log(this.props);
    console.log(auth.isAuthenticated);
  }
  render() {
    console.log(this.props)
    return (
      <Router>
        <div>
        {this.state.username ? 'hello ' + this.state.username : 'not logged in'}
          <ul>
            <li>
              <Link to="/pizzerias">Pizzerias</Link>
            </li>
            {this.state.loggedIn ? (
              <div>
              <li>
                <Link to="/protected">Protected Page</Link>
              </li>
              <li>
                <Link to="/profil">Profil Page</Link>
              </li>
              <li>
                <Link to="/addPizzeria">Add Pizza Page</Link>
              </li>
              </div>
            ) : (
              <li>
                <Link to="/protected">Protecte and you are not coming in Page</Link>
              </li>
            )}
            <li>
              <Link to="/login">Login Page</Link>
            </li>
            <li>
              <Link to="/signup">SignUp Page</Link>
            </li>
          </ul>
          <Switch>
            <Route path="/pizzerias">
              <Pizzerias />
            </Route>
            <Route path="/login">
              <SignIn update={this.shouldUpdateAuth} />
            </Route>
            <Route path="/signup">
              <SignUp update={this.shouldUpdateAuth} />
            </Route>
            <Route path="/pizzeria/:name">
              <Pizzeria />
            </Route>
            <PrivateRoute path="/protected">
              <ProtectedPage />
            </PrivateRoute>
            <PrivateRoute path="/profil">
              <Profil />
            </PrivateRoute>
            <PrivateRoute path="/addPizzeria">
              <AddPizzeria />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    );
  }
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

function AuthButton() {
  let history = useHistory();

  return auth.isAuthenticated ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth.signout(() => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  //check if cookie is present
  auth.checkIfCookie();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}


export default AuthExample;
