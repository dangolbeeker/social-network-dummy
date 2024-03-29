import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
  console.log(alerts);
  return (
    alerts !== null &&
    (alerts.length > 0) &
      alerts.map(alert => (
        {console.log(alert.msg)}
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {/* {alert.msg} */}
          HERE
        </div>
      ))
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
