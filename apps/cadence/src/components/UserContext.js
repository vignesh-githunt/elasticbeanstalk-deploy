import React, { useState} from "react";
import PropTypes from "prop-types";
import {useQuery} from '@apollo/react-hooks';
import CURRENT_USER_QUERY from './queries/CurrentUserQuery';
import { PageLoader } from "@nextaction/components";
import {useDispatch} from 'react-redux';
import {signInUser} from '../store/actions/user.actions';
import authReducer from '../store/reducers/auth.reducers';
import {useSelector} from 'react-redux';

const UserContext = React.createContext({});

export const UserProvider = (props) => {

  //fetch the current user
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

  useDispatch(authReducer(useSelector((state)=>state),signInUser('token', loading || error ? null : data.me.data[0] )));

  if (loading) {
    return (
      <UserContext.Provider value={{ error, loading }}>
        <PageLoader />
      </UserContext.Provider>
    );
  }
  
  let user = !error ? data.me.data[0] : null;
  
 return (
   <UserContext.Provider value={{ user, loading, error }}>
     {!loading && props.children}
   </UserContext.Provider>
 );
};
export const UserConsumer = UserContext.Consumer;

export default UserContext;

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
