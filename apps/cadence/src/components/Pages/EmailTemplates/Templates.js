/**
 * @author @Sk_khaja_moulali-gembrill
 * @version V11.0
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, CardHeader, Col, CustomInput, FormGroup, Input, InputGroup, InputGroupAddon, Row } from "reactstrap";
import { ContentWrapper } from "@nextaction/components";
import CommonButton from "../../Common/Button";
import PageHeader from "../../Common/PageHeader";
import Schedules from "./Schedules";
import Snippets from "./Snippets";
import EmailTemplates from "./EmailTemplates";

const Templates = ({ history }) => {
  const [activeTab, setActiveTab] = useState("Email Template");

  const handleTemplatesTabChange = (e) => {
    e.preventDefault();
    const tabValue = e.currentTarget.getAttribute("value");
    setActiveTab(tabValue);
  };

  return (
    <ContentWrapper>
      <PageHeader icon="fas fa-envelope fa-sm" pageName={activeTab}>
        <Row>
          <div className={activeTab === "Email Template" ? "mr-2" : "ml-2"}>
            <InputGroup>
              <Input placeholder="Search Templates" />
              <InputGroupAddon addonType="append">
                <Button outline className="boder-right-0 border-left-0">
                  <i className="fa fa-search"></i>
                </Button>
                <Button outline className="border-left-0">
                  <i className="fa fa-times"></i>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
          {activeTab === "Email Template" && (
            <div className={activeTab === "Email Template" ? "ml-auto" : ""}>
              <InputGroup>
                <Input placeholder="Search Categories" />
                <InputGroupAddon addonType="append">
                  <Button outline className="border-right-0 border-left-0">
                    <i className="fa fa-search"></i>
                  </Button>
                  <Button outline>
                    <i className="fa fa-times"></i>
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </div>
          )}
          <div className="ml-2">
            <CommonButton className="mr-2 pt-2" icon="fas fa-file-csv text-primary">
              <Link className="text-dark">Sample Templates</Link>
            </CommonButton>
            <CommonButton className="mr-2 pt-2" icon="fa fa-plus text-primary">
              <Link className="text-dark" to="/templates/email/add">Add a Template</Link>
            </CommonButton>
          </div>
        </Row>
      </PageHeader>
      <Row>
        <Col>
          <Card className="card-default">
            <CardHeader>
              <div className="card-tool">
                <ButtonGroup>
                  <Button
                    value="Email Template"
                    active={activeTab === "Email Template"}
                    onClick={handleTemplatesTabChange}
                  >
                    Email Templates
                  </Button>
                  <Button
                    value="Snippets"
                    active={activeTab === "Snippets"}
                    onClick={handleTemplatesTabChange}
                  >
                    Snippets
                  </Button>
                  <Button
                    value="Email Schedules"
                    active={activeTab === "Email Schedules"}
                    onClick={handleTemplatesTabChange}
                  >
                    Email Schedules
                  </Button>
                </ButtonGroup>
              </div>
              <div className="card-tool float-right">
                <FormGroup check inline>
                  <span className="text-dark mr-2">My Templates</span>
                  <CustomInput
                    type="switch"
                    id="exampleCustomSwitch"
                    name="customSwitch"
                  />
                  <span className="text-dark mr-2">All Templates</span>
                </FormGroup>
              </div>
            </CardHeader>

            <div>
              {activeTab === "Email Template" ? (
                <EmailTemplates />
              ) : activeTab === "Snippets" ? (
                <Snippets />
              ) : (
                    <Schedules />
                  )}
            </div>
          </Card>
        </Col>
      </Row>
    </ContentWrapper>
  );
};
export default Templates;