import React, { useState } from 'react';
import classnames from 'classnames';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Container,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import StaticElement from './StaticElement';
import TypeTriggeredElement from './TypeTriggeredElement';
import ValueTriggeredElement from './ValueTriggeredElement';

const ElementEditor = ({
  onModified,
  customerId,
  user,
  userLoading,
  story,
  plotPoint,
  element,
  isDefault = false,
  defaultOpen = false,
  history,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (defaultOpen) history.push('/stories/messagequeue');
  };

  // const TimeTriggered = () => {
  //   return (
  //     <FormGroup>
  //       <label>TimeTriggered</label>
  //     </FormGroup>
  //   );
  // };

  const [triggerType, setTriggerType] = useState(
    element.triggerType || 'Static'
  );

  const [activeTab, setActiveTab] = useState(triggerType);
  return (
    <React.Fragment>
      {element.id ? (
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            toggleModal();
          }}
        >
          <i className="fa fa-edit"></i>
        </a>
      ) : (
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            toggleModal();
          }}
          className="btn btn-secondary btn-xs"
        >
          <i className="fa fa-plus"></i> Add
        </a>
      )}

      <Modal isOpen={isOpen} toggle={toggleModal} size={'xl'}>
        <ModalHeader toggle={toggleModal}>
          {element.id ? 'Edit Element' : 'Create Element'}
        </ModalHeader>
        <ModalBody>
          <Container className="container-xl">
            <div role="tabpanel">
              {/* Nav tabs */}
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === 'Static',
                      disabled: element.id && activeTab !== 'Static',
                      'text-muted': element.id && activeTab !== 'Static',
                    })}
                    onClick={() => {
                      setTriggerType('Static');
                      setActiveTab('Static');
                    }}
                  >
                    Static Text
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === 'TypeTriggered',
                      disabled: element.id && activeTab !== 'TypeTriggered',
                      'text-muted': element.id && activeTab !== 'TypeTriggered',
                    })}
                    onClick={() => {
                      setTriggerType('TypeTriggered');
                      setActiveTab('TypeTriggered');
                    }}
                  >
                    Type Triggered Text
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === 'ValueTriggered',
                      disabled: element.id && activeTab !== 'ValueTriggered',
                      'text-muted':
                        element.id && activeTab !== 'ValueTriggered',
                    })}
                    onClick={() => {
                      setTriggerType('ValueTriggered');
                      setActiveTab('ValueTriggered');
                    }}
                  >
                    Value Triggered Text
                  </NavLink>
                </NavItem>
              </Nav>
              {/* Tab panes */}
              <TabContent activeTab={activeTab}>
                <TabPane tabId="Static">
                  <StaticElement
                    element={element}
                    isDefault={isDefault}
                    plotPoint={plotPoint}
                    toggleModal={toggleModal}
                    customerId={customerId}
                    story={story}
                    onModified={onModified}
                    user={user}
                    userLoading={userLoading}
                  />
                </TabPane>
                <TabPane tabId="TypeTriggered">
                  <TypeTriggeredElement
                    element={element}
                    isDefault={isDefault}
                    plotPoint={plotPoint}
                    toggleModal={toggleModal}
                    customerId={customerId}
                    story={story}
                    onModified={onModified}
                    user={user}
                    userLoading={userLoading}
                  />
                </TabPane>
                <TabPane tabId="ValueTriggered">
                  <ValueTriggeredElement
                    element={element}
                    isDefault={isDefault}
                    plotPoint={plotPoint}
                    toggleModal={toggleModal}
                    customerId={customerId}
                    story={story}
                    onModified={onModified}
                    user={user}
                    userLoading={userLoading}
                  />
                </TabPane>
              </TabContent>
            </div>
          </Container>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default ElementEditor;
