import React from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/react-hooks";

import { CURRENT_USER_QUERY } from "./queries/CurrentUserQuery";
//import Error500 from "./Pages/Error500";
import PageLoader from "./Common/PageLoader";

const UserContext = React.createContext({});

export const UserProvider = (props) => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  // let loading = false;
  // let error;
  // let data = {me: {email:"anders@connectleader.com"}}
  if (loading) {
    return (
      <UserContext.Provider value={{ error, loading }}>
        <PageLoader />
      </UserContext.Provider>
    );
  }

  let user = !error ? data.me : null;
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
