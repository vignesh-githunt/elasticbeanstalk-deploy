import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../store/actions/actions';
import HeaderHorizontal from './HeaderHorizontal';
import UserContext from '../UserContext';
import Footer from './Footer';

export const BaseHorizontal = (props) => {
  const { user, loading: userLoading } = useContext(UserContext);
  useEffect(() => {
    props.actions.changeSetting('horizontal', true);
    return () => props.actions.changeSetting('horizontal', true);
  }, [props.actions]);

  if (userLoading) return <i className="fa fa-spinner fa-spin fa-2x"></i>;

  return (
    <div className="wrapper">
      <HeaderHorizontal />

      <section
        className={
          'section-container ' +
          (user && user.rolesMask === 1 ? 'admin-section-container' : '')
        }
      >
        {props.children}
      </section>

      <Footer />
    </div>
  );
};

BaseHorizontal.propTypes = {
  actions: PropTypes.object,
  settings: PropTypes.object,
};

const mapStateToProps = (state) => ({
  settings: state.settings,
  customerId: state.customer.id,
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BaseHorizontal);
