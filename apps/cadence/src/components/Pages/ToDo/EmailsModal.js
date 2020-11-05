/**
 * @author @rkrishna-gembrill
 * @version V11.0
 */

import React, { useEffect, useRef, useState } from 'react';
import Button from "../../Common/Button";
import CloseButton from "../../Common/CloseButton";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';


import {
  ButtonGroup,
  ButtonToolbar,
  ButtonDropdown,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  FormText,
  Fieldset,
  Input,
  InputGroup,
  Modal,  
  ModalBody, 
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Popover,
  PopoverBody, 
  PopoverHeader, 
  Row,
  Table,
  TabContent,
  TabPane,
  } from "reactstrap";
  


const EmailsModal = ({ showModal, handleAction, hideModal, tags }) => {

const [popoverOpen, setPopoverOpen] = useState(false);

const toggle = () => setPopoverOpen(!popoverOpen);


  return (
    <Modal size="xl" isOpen={showModal} centered={true} >

		<div className="d-flex align-items-center p-3 bg-dark text-light">
			<div className= "mr-auto">
				<h4>
					New Message			
				</h4>
			</div>
			<div className="mx-auto">
				<div>
				  <Button color="outline" size="md" id="Popover1" className="text-light">...</Button>
				  <Popover placement="left" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
					<PopoverBody><b>Rick Hussey</b><br></br>Title<br></br>Account Name</PopoverBody>
				  </Popover>
				</div>
			</div>
			<div className="ml-auto">
				
				<Nav className="ml-auto">
					<NavItem>
						<NavLink href="#">
							<small className="pt-2"><i> 1 of 12</i></small>
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#">
							<Button color="link" className="btn-sm">
								<i className="fas fa-chevron-left"></i>
							</Button>
							<Button color="link" className="btn-sm">
								<i className="fas fa-chevron-right"></i>
							</Button>
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#">
							<Button color="link" className="btn-sm">
								<i className="fas fa-times text-muted"></i>
							</Button>
						</NavLink>
					</NavItem>					
				</Nav>				
			</div>
		</div>

		<ModalBody className="py-0 border">
			<Row>
			<Col md={8} className="br">
				<div className="d-flex my-2 pb-2 bb">
					<div>Rick Hussey</div>
					<div className="ml-auto text-muted">CC BCC</div>
				</div>
				<FormGroup className="mt-n2">
					<InputGroup className="bb pt-2">
						<Label for="login-name">Subject</Label>
						<Input type="text" className="form-control mt-n2 border-0" name="login-name" id="exampleEmail" placeholder="" />
					</InputGroup>
				</FormGroup>
			  <Row>
				<Col></Col>
			  </Row>
			</Col>
			<Col md={4} className="bl">
				<div className="my-2 pb-2 bb">
					<div>Preview</div>
				</div>
			</Col>
			</Row>
		</ModalBody>
		<ModalFooter className="d-block">		
		<Row>
			<Col md={8}>
				<Row>
					<Col>
						<CKEditor editor={ClassicEditor} onInit={editor => {}}></CKEditor>
					</Col>
				</Row>
			</Col>
			<Col md={4}>
				<div className="d-flex justify-content-end">
					<CloseButton onClick={hideModal} />
					<button type="button" class="btn btn-success p-0 pl-2 ml-2">Send<em class="far fa-calendar ml-2 p-2 border-white bl"></em></button>
				</div>
			</Col>
		</Row>     
		</ModalFooter>
    </Modal>
  );
}

export default EmailsModal;