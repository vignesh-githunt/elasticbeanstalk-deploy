import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ProtectedRoute from './components/ProtectedRoute'
/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';
// import BasePage from './components/Layout/BasePage';
import { BasePage } from '@koncert/shared-components';
import BaseHorizontal from './components/Layout/BaseHorizontal';
import Elements from './components/Pages/Elements';
import Personalization from './components/Pages/Personalization';
import { UserProvider } from "./components/UserContext";

/* Used to render a lazy component with react-router */
const waitFor = Tag => props => <Tag {...props} />;

const Dashboard = lazy(() => import('./components/Pages/Dashboard'));
const Customers = lazy(() => import('./components/Pages/Customers'));
const Customer = lazy(() => import('./components/Pages/Customer'));
const Warehouse = lazy(() => import('./components/Pages/Warehouse'));
const CustomerAccounts = lazy(() => import('./components/Pages/CustomerAccounts'));
const Senders = lazy(() => import('./components/Pages/Senders'));
const Stories = lazy(() => import('./components/Pages/Stories'));
const Settings = lazy(() => import('./components/Pages/Settings'));
const Story = lazy(() => import('./components/Pages/Story'));
const StoryConfiguration = lazy(() => import('./components/Stories/StoryConfiguration'));
const MessageBuilder = lazy(() => import('./components/Pages/MessageBuilder'));
const MessageQueuePage = lazy(() => import('./components/Pages/MessageQueuePage'));
const WarehouseAccount = lazy(() => import('./components/Pages/Account'));
const WarehouseContact = lazy(() => import('./components/Pages/Contact'));
const Workers = lazy(() => import('./components/Pages/Workers'));

const Login = lazy(() => import("./components/Pages/Login"));
const Register = lazy(() => import("./components/Pages/Register"));
const Recover = lazy(() => import("./components/Pages/Recover"));
const Lock = lazy(() => import("./components/Pages/Lock"));
const NotFound = lazy(() => import("./components/Pages/NotFound"));
const Error500 = lazy(() => import("./components/Pages/Error500"));
const Maintenance = lazy(() => import("./components/Pages/Maintenance"));
const ResetPassword = lazy(()=> import("./components/Pages/ResetPassword"));
const AccountConfirmation = lazy(()=> import("./components/Pages/AccountConfirmation"));
const Onboarding = lazy(()=> import("./components/Pages/Onboarding"));

// List of routes that uses the page layout
// listed here to Switch between layouts
// depending on the current pathname
const listofPages = [
  '/login',
  '/register',
  '/recover',
  '/lock',
  '/notfound',
  '/error500',
  '/maintenance',
  '/reset_password',
  '/confirmation'
];

const Routes = ({ location }) => {
  const currentKey = location.pathname.split('/')[1] || '/';
  const timeout = { enter: 500, exit: 500 };
  
  // Animations supported
  //      'rag-fadeIn'
  //      'rag-fadeInRight'
  //      'rag-fadeInLeft'

  const animationName = 'rag-fadeIn'

  if (listofPages.indexOf(location.pathname) > -1) {
    return (
      <BasePage>
        <Suspense fallback={<PageLoader />}>
          <Switch location={location}>
            <Route path="/login" component={waitFor(Login)} />
            <Route path="/register" component={waitFor(Register)} />
            <Route path="/recover" component={waitFor(Recover)} />
            <Route path="/lock" component={waitFor(Lock)} />
            <Route path="/notfound" component={waitFor(NotFound)} />
            <Route path="/error500" component={waitFor(Error500)} />
            <Route path="/maintenance" component={waitFor(Maintenance)} />
            <Route path="/reset_password" component={waitFor(ResetPassword)}  />
            <Route path="/confirmation" component={waitFor(AccountConfirmation)}  />
          </Switch>
        </Suspense>
      </BasePage>
    )
  }
  else {
    return (
      <UserProvider>
        <BaseHorizontal>
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
                      path="/onboarding"
                      component={waitFor(Onboarding)}
                    />
                    <ProtectedRoute
                      path="/admin/dashboard"
                      component={waitFor(Dashboard)}
                    />
                    <ProtectedRoute
                      requireAdmin={true}
                      path="/admin/workers"
                      component={waitFor(Workers)}
                    />
                    <ProtectedRoute
                      requireAdmin={true}
                      path="/admin/warehouse/accounts/:id"
                      component={waitFor(WarehouseAccount)}
                    />
                    <ProtectedRoute
                      requireAdmin={true}
                      path="/admin/warehouse/contacts/:id"
                      component={waitFor(WarehouseContact)}
                    />
                    <ProtectedRoute
                      requireAdmin={true}
                      path="/admin/warehouse"
                      component={waitFor(Warehouse)}
                    />
                    <ProtectedRoute
                      requireAdmin={true}
                      path="/admin/customers"
                      component={waitFor(Customers)}
                    />
                    <ProtectedRoute
                      path="/stories/messagequeue"
                      component={waitFor(MessageQueuePage)}
                    />
                    <ProtectedRoute
                      path="/stories/elements"
                      component={waitFor(Elements)}
                    />
                    <ProtectedRoute
                      path="/stories/personalization"
                      component={waitFor(Personalization)}
                    />
                    <ProtectedRoute
                      path="/stories/messagebuilder"
                      component={waitFor(MessageBuilder)}
                    />
                    <ProtectedRoute
                      path="/stories/:id/configuration"
                      component={waitFor(StoryConfiguration)}
                    />
                    <ProtectedRoute
                      path="/stories/:id"
                      component={waitFor(Story)}
                    />
                    <ProtectedRoute
                      path="/stories"
                      component={waitFor(Stories)}
                    />
                    <ProtectedRoute
                      path="/accounts"
                      component={waitFor(CustomerAccounts)}
                    />
                    <ProtectedRoute
                      path="/senders"
                      component={waitFor(Senders)}
                    />
                    <ProtectedRoute
                      path="/settings/:section"
                      component={waitFor(Settings)}
                    />
                    <ProtectedRoute
                      path="/settings/"
                      component={waitFor(Settings)}
                    />
                    <ProtectedRoute
                      path="/dashboard"
                      component={waitFor(Customer)}
                    />
                    <ProtectedRoute path="/" component={waitFor(Customer)} />
                  </Switch>
                </Suspense>
              </div>
            </CSSTransition>
          </TransitionGroup>
        </BaseHorizontal>
      </UserProvider>
    );
  }
}

export default withRouter(Routes);