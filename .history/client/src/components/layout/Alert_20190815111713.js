import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
  return <div />;
};

Alert.propTypes = {};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect()(Alert);
