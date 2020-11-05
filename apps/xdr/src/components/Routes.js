import React, { Suspense } from "react"
import { withRouter, Switch, Route } from "react-router-dom"
import PageLoader from './Common/PageLoader'
import { UserProvider } from "./UserContext";
import ProtectedRoute from './ProtectedRoute';
import Dashboard from "./Pages/Dashboard";
import Cadence from "./Pages/Cadence";
import ResearchQueue from "./Pages/ResearchQueue";
import MessageQueuePage from "./Pages/MessageQueuePage";
import Login from "./Pages/Login";

const listofPages = [
  '/login'
]

const Routes = ({ location, toggle, parentElement }) => {
  if (listofPages.indexOf(location.pathname) > -1) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Switch location={location}>
          <Route path="/login" component={Login} />
        </Switch>
      </Suspense>
    );
  } else {
    return (
      <UserProvider>
        <Suspense fallback={<PageLoader />}>
          <Switch location={location}>
            <ProtectedRoute
              path="/research"
              component={ResearchQueue}
              toggle={toggle}
              parentElement={parentElement}
            />
            <ProtectedRoute
              path="/messagequeue"
              component={MessageQueuePage}
              toggle={toggle}
              parentElement={parentElement}
            />
            <ProtectedRoute
              path="/cadence"
              component={Cadence}
              toggle={toggle}
              parentElement={parentElement}
            />
            <ProtectedRoute
              path="/"
              component={Dashboard}
              toggle={toggle}
              parentElement={parentElement}
            />
          </Switch>
        </Suspense>
      </UserProvider>
    );
  }
};

export default withRouter(Routes);