import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { isAuthenticated, loading } = auth;

  const authLinks = (
    <ul>
      <li>
        <NavLink to="/profiles">
          Developers
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard">
          <i className="fas fa-user"/>{' '}
          <span className="hide-sm">Dashboard</span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/posts">
          <i className="fas fa-user"/>{' '}
          <span className="hide-sm">Posts</span>
        </NavLink>
      </li>
      <li>
        <a onClick={() => dispatch(logout())} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li><NavLink to="/profiles">Developers</NavLink></li>
      <li><NavLink to="/register">Register</NavLink></li>
      <li><NavLink to="/login">Login</NavLink></li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <NavLink to="/"><i className="fas fa-code"></i> DevConnector</NavLink>
      </h1>
      { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }
    </nav>
  )
}

export default Navbar;