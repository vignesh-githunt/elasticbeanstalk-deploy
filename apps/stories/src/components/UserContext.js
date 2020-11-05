import React from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "./queries/CurrentUserQuery";
import PageLoader from "./Common/PageLoader";

const UserContext = React.createContext({});

export const UserProvider = (props) => {
  const { client, data, loading, error } = useQuery(CURRENT_USER_QUERY);

  const logout = () => {
    client.clearStore()
  };

  if (loading) {
    return (
      <UserContext.Provider value={{ error, loading, logout }}>
        <PageLoader />
      </UserContext.Provider>
    );
  }

  let user = !error ? data.me : null;
  return (
    <UserContext.Provider value={{ user, loading, error, logout }}>
      {!loading && props.children}
    </UserContext.Provider>
  );
};
export const UserConsumer = UserContext.Consumer;

export default UserContext;

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
