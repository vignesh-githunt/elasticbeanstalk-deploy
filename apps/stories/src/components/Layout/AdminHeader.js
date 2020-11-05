import React from 'react';
import { withTranslation } from 'react-i18next';
import CUSTOMERSQUERYSTRING from "../queries/CustomersQuery";
import {useQuery} from '@apollo/react-hooks';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../store/actions/actions";
import {
  Nav,
  NavItem,
  FormGroup,
  Col
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router'
// React Select
import Select from 'react-select';
import { useState } from 'react';
import { useEffect } from 'react';

const AdminHeader = ({customerId, customerName, actions, history}) => {

  const [selectedOption, setSelectedOption] = useState({ value: customerId, label: customerName })
  const {
    data,
    loading,
    error
  } = useQuery(CUSTOMERSQUERYSTRING);
  const handleChangeSelect = (option) => {
    
    //const option = customers.filter((x) => (x.id == customerId))[0].map((x) => ({value: x.id, label: x.name}))
    setSelectedOption(option);
    actions.setCustomer(option.value, option.label);
    history.push("/dashboard")
  }

  useEffect(() => {
    setSelectedOption({ value: customerId, label: customerName });
  }, [customerId, customerName])

  if (loading) {
    return null;
  }

  if (error)
    return null;
  
  const customers = data.companies
  return (
    <header className="koncert-admin-header">
      <nav className="">
        <Nav navbar className="mr-auto flex-column flex-lg-row">
          <NavItem>
            <Link className="nav-link" to="/admin/dashboard">
              Dashboard
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/admin/customers">
              Customers
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/admin/warehouse">
              Warehouse
            </Link>
          </NavItem>
          <NavItem style={{ minWidth: "200px" }}>
            <Col md={12}>
              <FormGroup
                style={{
                  zIndex: "2051",
                  marginTop: "2px",
                  marginBottom: "2px",
                  paddingTop: "0px",
                  paddingBottom: "0px",
                }}
              >
                <Select
                  name="customer-select"
                  value={selectedOption}
                  onChange={(value) => handleChangeSelect(value)}
                  options={customers.map((customer) => ({
                    value: customer.id,
                    label: customer.name,
                  }))}
                  placeholder={"Select Customer"}
                />
              </FormGroup>
            </Col>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/admin/workers">
              Workers
            </Link>
          </NavItem>
        </Nav>
      </nav>
    </header>
  );

}

const mapStateToProps = state => ({ customerId: state.customer.id, customerName: state.customer.name })
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default withRouter(withTranslation('translations')(connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminHeader)));
