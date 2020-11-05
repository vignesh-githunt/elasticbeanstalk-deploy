import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import {
  Card,
  CardBody,
  CardHeader,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

const EmailMessages = ({ row }) => {
  const [activeTab, setActiveTab] = useState("0");
  const {
    values: { emailContent }
  } = row;
  const messageKeys = Object.keys(emailContent);
  return (
    <Card className="card-default">
      <CardHeader>
        Emails
        <div className="card-tool float-right">
          <em className="fa fa-times" {...row.getToggleRowExpandedProps()}></em>
        </div>
      </CardHeader>
      <CardBody>
        <div role="tabpanel">
          {/* Nav tabs */}
          <Nav tabs>
            {messageKeys.map((key, index) => (
              <NavItem key={key}>
                <NavLink
                  className={activeTab === String(index) ? "active" : ""}
                  onClick={() => {
                    setActiveTab(String(index));
                  }}
                >
                  {key}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          {/* Tab panes */}
          <TabContent activeTab={activeTab}>
            {messageKeys.map((key, index) => (
              <TabPane tabId={String(index)} key={key}>
                {emailContent[key].map((sentence, index) => {
                  if (index === 0) {
                    return (
                      <p key={index}>
                        <strong>Subject: {sentence}</strong>
                      </p>
                    );
                  } else {
                    return <p key={index}>{ReactHtmlParser(sentence)}</p>;
                  }
                })}
              </TabPane>
            ))}
          </TabContent>
        </div>
      </CardBody>
    </Card>
  );
};

export default EmailMessages;