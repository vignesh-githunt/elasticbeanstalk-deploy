import React, { Suspense, lazy } from "react";
import { withRouter, Switch, Route } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import ProtectedRoute from "./components/ProtectedRoute";
/* loader component for Suspense*/

import { PageLoader, BasePage } from "@koncert/shared-components";

import { Base } from "./components/Layout/Base";

import { UserProvider } from "./components/UserContext";

/* Used to render a lazy component with react-router */
const waitFor = (Tag) => (props) => <Tag {...props} />;

const Accounts = lazy(() => import("./components/Pages/Accounts/Accounts"));
const AccountView = lazy(() =>
  import("./components/Pages/Accounts/AccountView")
);
const ExamplePage = lazy(() => import("./components/Pages/ExamplePage"));
const Dashboard = lazy(() => import("./components/Pages/Dashboard"));
const PendingCalls = lazy(() => import("./components/Pages/PendingCalls/PendingCalls"));
const ToDo = lazy(() => import("./components/Pages/ToDo/ToDo"));
const Prospects = lazy(() => import("./components/Pages/Prospects/Prospects"));
const ProspectView = lazy(() => import("./components/Pages/Prospects/ProspectView"));
const Cadences = lazy(() => import("./components/Pages/Cadences/Cadences"));
const CadenceView = lazy(() => import("./components/Pages/Cadences/CadencesView"));
const NewCadence = lazy(() => import("./components/Pages/Cadences/NewCadence"));
const EditProspect = lazy(() => import("./components/Pages/EditProspect"));
const SettingsPage = lazy(() => import("./components/Pages/Settings/Settings"));
const EmailSchedule = lazy(() => import("./components/Pages/Settings/AddEmailExecutionSchedule"));
const Reports = lazy(() => import("./components/Pages/Reports/Reports"));

//Email Template Components Imports
const Templates = lazy(() => import("./components/Pages/EmailTemplates/Templates"));
const AddOrEditEmailTemplate = lazy(() => import("./components/Pages/EmailTemplates/AddEditEmailTemplate"));
const Login = lazy(() => import("./components/Pages/Login"));

const listofPages = [
  "/login",
  "/register",
  "/recover",
  "/lock",
  "/notfound",
  "/error500",
  "/maintenance",
  "/reset_password",
  "/confirmation",
];

const Routes = ({ location }) => {
  const currentKey = location.pathname.split("/")[1] || "/";
  const timeout = { enter: 500, exit: 500 };

  const animationName = "rag-fadeIn";

  if (listofPages.indexOf(location.pathname) > -1) {
    return (
      <BasePage>
        <Suspense fallback={<PageLoader />}>
          <Switch location={location}>
            <Route path="/login" component={waitFor(Login)} />
          </Switch>
        </Suspense>
      </BasePage>
    );
  } else {
    return (
      <UserProvider>
        <Base productName="ConnectLeader - LLC.">
          <TransitionGroup>
            <CSSTransition
              key={currentKey}
              timeout={timeout}
              classNames={animationName}
              exit={false}
            >
              <div>
                <Suspense fallback={<PageLoader />}>
                  <Switch location={location}>
                    <ProtectedRoute
                      path="/dashboard"
                      component={waitFor(Dashboard)}
                      exact
                    />
                    <ProtectedRoute
                      path="/pendingCalls"
                      component={waitFor(PendingCalls)}
                      exact
                    />
                    <ProtectedRoute
                      path="/toDo"
                      component={waitFor(ToDo)}
                      exact
                    />
                    <ProtectedRoute
                      path="/prospects"
                      component={waitFor(Prospects)}
                      exact
                    />
                    <ProtectedRoute
                      path="/prospects/:id"
                      component={waitFor(ProspectView)}
                      exact
                    />
                    <ProtectedRoute
                      path="/accounts"
                      component={waitFor(Accounts)}
                      exact
                    />
                    <ProtectedRoute
                      path="/cadences"
                      component={waitFor(Cadences)}
                      path="/accounts/:id"
                      component={waitFor(AccountView)}
                      exact
                    />
                    <ProtectedRoute
                      path="/cadences"
                      component={waitFor(Cadences)}
                      exact
                    />
                    <ProtectedRoute
                      path="/cadences/:id/:section"
                      component={waitFor(CadenceView)}
                    />
                    <ProtectedRoute
                      path="/cadences/new"
                      component={waitFor(NewCadence)}
                      exact
                    />
                    <ProtectedRoute
                      path="/cadences/:id"
                      component={waitFor(NewCadence)}
                      exact
                    />
                    <ProtectedRoute
                      exact
                      path="/templates"
                      component={waitFor(Templates)}
                    />
                    <ProtectedRoute
                      path="/templates/email/add"
                      component={waitFor(AddOrEditEmailTemplate)}
                    />

                    <ProtectedRoute
                      path="/ExamplePage"
                      component={waitFor(ExamplePage)}
                      exact
                    />
                    <ProtectedRoute
                      path="/reports"
                      component={waitFor(Reports)}
                      exact
                    />
                    <ProtectedRoute
                      path="/prospects/:id"
                      component={waitFor(ProspectView)}
                    />
                    <ProtectedRoute path="/editprospect" component={waitFor(EditProspect)} />
                    <ProtectedRoute
                      path="/editprospect"
                      component={waitFor(EditProspect)}
                    />
                    <ProtectedRoute
                      path="/settings"
                      component={waitFor(SettingsPage)}
                      exact
                    />
                    <ProtectedRoute
                      path="/settings/emailExecutionSchedule/:id/:action"
                      component={waitFor(EmailSchedule)}
                      exact
                    />
                    <ProtectedRoute
                      path="/settings/emailExecutionSchedule/:action"
                      component={waitFor(EmailSchedule)}
                      exact
                    />

                    <ProtectedRoute
                      path="/settings/:tab"
                      component={waitFor(SettingsPage)}
                    />
                    <ProtectedRoute path="/" component={waitFor(ExamplePage)} />

                    <ProtectedRoute path="/" component={waitFor(ExamplePage)} />
                  </Switch>
                </Suspense>
              </div>
            </CSSTransition>
          </TransitionGroup>
        </Base>
      </UserProvider>
    );
  }
};

export default withRouter(Routes);
