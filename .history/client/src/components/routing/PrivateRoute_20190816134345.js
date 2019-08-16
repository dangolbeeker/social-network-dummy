import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return <div />;
};

PrivateRoute.propTypes = {};

export default PrivateRoute;
