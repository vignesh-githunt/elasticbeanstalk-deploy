import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import UserContext from "./UserContext";
import { useTracking } from "./SegmentTracker";

const ProtectedRoute = (props) => {
  const tracker = useTracking();
  const { user, loading: userLoading, error } = useContext(UserContext);
  if (userLoading) return null;

  if (!user || error) {
    return <Redirect to="/login" />;
  } 

  const { component: Component, requireAdmin, computedMatch, ...rest } = props;
  if (computedMatch !== undefined) {
    tracker.page(computedMatch.url);
  }
  if (user.rolesMask !== 1 && requireAdmin === true)
    return <Redirect to="/login" />;
  return <Route component={Component} {...rest} />;
};

export default ProtectedRoute;
