import React from 'react';
// import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import loadable from '@loadable/component';
// import { Link, Router } from 'wouter';
import { Router, Link } from '@reach/router';


// const HomePage = loadable(() => import('./pages/home'));
// const Counter = loadable(() => import('./pages/counter/counter'));
const Login = loadable(() => import('./pages/loginPage/login'));
const Animate1 = loadable(() => import('./pages/animateTest/animate1'));
const Datetimepicker = loadable(() => import('./pages/tmp/datetimepicker'));
// const selectStyle = {
//   color:'red',
//   fontWeight: 'bold'
// }

function RouteExample() {
  return (
    <>
      <ul>
        {/* <li>
          <Link href="/a">
            <a> CounterExample</a>
          </Link>
        </li> */}
        <li>
          <Link to="/">
            <a> Login</a>
          </Link>
        </li>
        <li>
          <Link to="/a">
            <a> animate1</a>
          </Link>
        </li>
      </ul>
      <hr />
      {/* <Route path="/" component={HomePage} /> */}
      {/* <HomePage /> */}

      <Router>
        {/* <Counter path="/a" /> */}
        <Login path="/" />
        <Animate1 path="a" />
      </Router>
    </>
  )
}

export default RouteExample;
