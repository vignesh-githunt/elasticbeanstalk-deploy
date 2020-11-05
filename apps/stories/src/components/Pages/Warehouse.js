import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import { AccountDatasQuery } from '../queries/AccountDatasQuery';
import { PeopleQuery } from '../queries/PeopleQuery';
import AccountsList from '../AccountsList';
import ContactsList from '../ContactsList';
import DataProviderList from '../DataProviderList';
import DataProviderEditor from '../DataProviderEditor';

const AccountsListWithData = AccountDatasQuery(AccountsList)
const ContactsListWithData = PeopleQuery(ContactsList);

class Accounts extends Component {

    state = {
      activeTab: 'accounts'
    }

    toggleTab = tab => {
      if (this.state.activeTab !== tab) {
          this.setState({
              activeTab: tab
          });
      }
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Warehouse</div>
                    <div className="ml-auto">
                      <DataProviderEditor />
                    </div>
                </div>
                <Row>
                <Col xl={12}>
                  <Card className="card-default">
                    <CardHeader>Data Providers</CardHeader>
                    <CardBody>
                      <DataProviderList />
                    </CardBody>
                    <CardFooter className={"text-right"}>
                      
                    </CardFooter>
                  </Card>
                </Col>
                    
                </Row>
                <Row>
                  <Col xl={ 12 }>
                    <Nav tabs justified>
                      <NavItem>
                        <NavLink
                          className={ this.state.activeTab === 'accounts' ? 'active':'' }
                          onClick={() => { this.toggleTab('accounts'); }}
                        >Accounts
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={ this.state.activeTab === 'contacts' ? 'active':'' }
                          onClick={() => { this.toggleTab('contacts'); }}
                        >Contacts</NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                      <TabPane tabId="accounts">
                        <AccountsListWithData {...this.props} baseUrl="/admin/warehouse/accounts" />
                      </TabPane>
                      <TabPane tabId="contacts">
                        <ContactsListWithData {...this.props} baseUrl="/admin/warehouse/contacts" />
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
            </ContentWrapper>
            );
    }
}

export default withTranslation('translations')(Accounts);
