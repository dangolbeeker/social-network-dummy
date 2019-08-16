import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
        <li>
          {/* <Link to='/register'>Register</Link> */}
          <a onClick={logout} href='#!'>Log Out</a>
        </li>
      </ul>
  );

  const guestLinks = {
    <ul>
        {/* <li><Link to="profiles.html">Developers</Link></li> */}
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
  }

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code' /> DevConnector
        </Link>
      </h1>
      
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  auth: state.auth;
};

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
