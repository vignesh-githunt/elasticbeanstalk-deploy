import React, { useState } from 'react';
import { Col, Label, Input, Form, FormGroup, Button, Card, CardBody, Collapse } from "reactstrap";
import { ContentWrapper } from "@nextaction/components";


const CallProspect = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const [isEdit, setIsEdit] = useState(false);

  const toggleEdit = () => setIsEdit(!isEdit);

    return (
      <ContentWrapper className='prospectssection-activity'>

            <Col lg={12} className="prospectssection-activity-top">   
                   <div className="prospectssection-activity-top-right float-right border-bottam">
                      <ul>
                        <li><span>1 of 12 Prospects</span></li>
                        <li><a href="#"><span className="activity-leftarrow"><i className="fas fa-chevron-left"></i></span></a> <a href="#"><span className="activity-rightarrow"><i className="fas fa-chevron-right"></i></span></a></li>
                        <li><a href="#"><span className="activity-close lightgray"><i className="fas fa-times"></i></span></a></li>
                      </ul>
                    </div>
                  </Col> 
         <br />
               <Col lg={12} className="prospectssection-activity-header btop bbottom align-items-center">
                 <Col md={4}>   <h4>Daymond John</h4> </Col>
                  <Col md={8}> <div className="prospectssection-activity-header-right "> <a href="#" className="float-right reda"><span className="activity-edit"><i className="fas fa-pen"></i></span></a>
                      <ul className="float-right"> 
                        <li><i className="svgicon trucadence-icon lightgray"></i> Test</li>
                        <li><i className="fas fa-hand-pointer lightgray"></i> #2</li>
                        <li><i className="fas fa-arrow-right lightgray"></i> 1 Months ago</li>
                        <li><i className="fas fa-angle-double-right lightgray"></i> N/A</li>
                      </ul>
                    </div>
                    </Col>  
                  </Col> 

                  <div className="prospectssection-activity-content">

              {/* Start Info & Stats */}              
                    <div className="prospects-activity-details prospects-activity-common float-left pt-3 pb-2">
                      <div className="prospects-activity-details-sup">
                        <h3 className="bbottom pl-3 pr-3 pb-2"> <i className="fas fa-user lightgray"></i>     Info 
                          <Button outline color="primary" onClick={toggleEdit} className="float-right pros-right font13">Edit </Button>  
                        </h3>

                        <Collapse isOpen={isEdit}>
                          <Card>
                            <CardBody className="info-edit">
                            {/* <div className="activity-after-edit"> */}
                              <FormGroup>
                                <Label for="edit_info_fname" className="font-weight-bold">First Name:</Label>					   
                                <Input type="text"  id="edit_info_fname" />					    
                              </FormGroup>
                              <FormGroup>
                                  <Label for="edit_info_lname" className="font-weight-bold">Last Name:</Label>					   
                                  <Input type="text"  id="edit_info_lname" />					    
                                </FormGroup>  
                              <FormGroup>
                                  <Label for="edit_info_title" className="font-weight-bold">Title:</Label>					   
                                  <Input type="text"  id="edit_info_title" />					    
                                </FormGroup>
                                <FormGroup>
                                  <Label for="edit_info_email" className="font-weight-bold">Email:</Label>					   
                                <Input type="text"  id="edit_info_email" />					    
                                </FormGroup>
                                <FormGroup>
                                  <Label for="edit_info_phone" className="font-weight-bold">Phone:</Label>				   
                                  <Input type="text"  id="edit_info_phone" />					    
                                </FormGroup>
                            </CardBody>
                          </Card>
                        </Collapse>

                        <div className="activity-before-edit">
                        <div className="address-content pl-3 pr-3 mb-3">
                          <p><span>Daymond John</span></p>
                          <p className="font13">CEO</p>
                          <p className="font-italic">ABC Company</p>
                          <p>Boston, MA</p>
                          <p><span>Timezone:</span> 12:10 PM  EDT</p>
                          <p><span>Record Type:</span> Contact</p>
                        </div>
                        <ul className="address-details pl-3 pr-3 mb-4 ">
                          <li><a href="mailto:daymondjohn@cl.com"><i className="fas fa-envelope lightgray"></i> daymondjohn@cl.com</a></li>
                          <li><a href="#"><i className="fas fa-phone lightgray r100"></i> (603) 386-0306</a></li>
                          <li><a href="#"><i className="fas fa-home lightgray"></i> (603) 386-0306</a></li>
                          <li><a href="#"><i className="fas fa-city lightgray"></i> (603) 386-0306</a> <span>Ext: 5013</span></li>
                        </ul>
                        </div>
                      
                        <h3 className="btop bbottom p-3 pt-2 pb-2 stats"> <i className="fas fa-chart-bar lightgray"></i> Stats </h3>
                        <ul className="stats-details pl-3 pr-3">
                          <li>2<span><i className="fas fa-phone-alt lightgray"></i></span></li>
                          <li>5<span><i className="fas fa-envelope lightgray"></i></span></li>
                        </ul>
                      </div>
                    </div>
           {/* End Info & Stats */}

          {/* Start Actions, Custom Fields & Click Dialer */}
                  <div className="prospects-activity-calls prospects-activity-common float-left pt-3 pb-2">
                    <div className='prospects-custom-fields'>
                      <h3 className='bbottom'>Prospect Custom Fields   <Button outline color="primary" onClick={toggle} className="float-right pros-right"><i className='fa fa-angle-double-down'></i></Button> </h3>
                      <Collapse isOpen={isOpen}>
                        <Card>
                          <CardBody>
                      {/* <div class="activity-after-edit"> */}
                             <FormGroup>
                              <Label for="edit_pros_city" className="font-weight-bold">City: </Label>					   
                              <Input type="text"  id="edit_pros_city" />					    
                             </FormGroup>
                             <FormGroup>
                                <Label for="edit_pros_crm" className="font-weight-bold">CRM Link: </Label>					   
                                <Input type="text"  id="edit_pros_crm" />					    
                              </FormGroup>  
                             <FormGroup>
                                <Label for="edit_pros_email" className="font-weight-bold">Email Counter: </Label>					   
                                 <Input type="text"  id="edit_pros_email" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_extn" className="font-weight-bold">Extension: </Label>					   
                               <Input type="text"  id="edit_pros_extn" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_first_dialed" className="font-weight-bold">First Dialed Date: </Label>				   
                                 <Input type="text"  id="edit_pros_first_dialed" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_first_emailed" className="font-weight-bold">First Emailed Date: </Label>				   
                                 <Input type="text"  id="edit_pros_first_emailed" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_last_da" className="font-weight-bold">Last DA Call Outcome: </Label>				   
                                 <Input type="text"  id="edit_pros_last_da" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_last_dialed" className="font-weight-bold">Last Dialed Date: </Label>				   
                                 <Input type="text"  id="edit_pros_last_dialed" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_last_emailoc" className="font-weight-bold">Last Email Outcome: </Label>				   
                                 <Input type="text"  id="edit_pros_last_emailoc" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_last_emailed" className="font-weight-bold">Last Emailed Date: </Label>				   
                                 <Input type="text"  id="edit_pros_last_emailed" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_last_talker" className="font-weight-bold">Last Talker Call Outcome: </Label>				   
                                 <Input type="text"  id="edit_pros_last_talker" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_linkedin" className="font-weight-bold">Linkedin URL: </Label>				   
                                 <Input type="text"  id="edit_pros_linkedin" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_optout" className="font-weight-bold">Optout: </Label>				   
                                 <Input type="text"  id="edit_pros_optout" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_rec_type" className="font-weight-bold">Record Type: </Label>				   
                                 <Input type="text"  id="edit_pros_rec_type" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_report_name" className="font-weight-bold">Report Name: </Label>				   
                                 <Input type="text"  id="edit_pros_report_name" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_state" className="font-weight-bold">State: </Label>				   
                                 <Input type="text"  id="edit_pros_state" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_tag" className="font-weight-bold">Tag: </Label>				   
                                 <Input type="text"  id="edit_pros_tag" />					    
                              </FormGroup>
                              <FormGroup>
                                <Label for="edit_pros_timezone" className="font-weight-bold">Timezone: </Label>				   
                                 <Input type="text"  id="edit_pros_timezone" />					    
                              </FormGroup>
                          </CardBody>
                        </Card>
                      </Collapse>
                    </div>

                    <h3 className="bbottom btop"> <i className="fas fa-bolt lightgray"></i> Actions </h3>
                      <ul className="actions-list-icon pl-3 pr-3 bbottom">
                        <li><span className="green-bg"><i className="fas fa-phone-alt"></i></span></li>
                        <li><span className="blue-bg"><i className="fas fa-envelope"></i></span></li>
                        <li><span className="orenage-bg"><i className="fas fa-plus-circle"></i></span></li>
                        <li><span className="red-bg"><i className="fas fa-sign-in-alt"></i></span></li>
                      </ul>
                      <div className="call-connecting">
                        <p className="m-0 float-left"><span>CLICK</span>DIALER</p>
                        <ul className="call-connecting-icon float-right">
                          <li><span><i className="fas fa-circle text-danger"></i></span></li>
                          <li><span><i className="far fa-circle"></i></span></li>
                        </ul>                        
                      </div>
                      <div className="calldailing-section">   
                      <div className="calldailing-setting">
                      <div className="callduration">Talk Time: <p className="text-success">00:00</p></div>
                      <span><i className="far fa-circle text-white"></i></span> <span><i className="fas fa-cog text-white"></i></span>
                      </div>   
                      <div className="calldailing-part">
                      <ul>
                          <li><p>Dial:</p> 804-409-4090 <span className="calldailing-icon"><i className="fas fa-phone-alt text-success"></i></span></li>
                          <li><p>Access:</p> 159-800-820</li>
                        </ul> 
                        </div>   

                      <div className="calldailing-call" style={{display: 'none'}}>
                          <h3>(603) 386-0306</h3>
                          <h3>Calling . . .</h3>
                          <p><span><i className="fas fa-phone-alt"></i></span></p>
                          <ul>
                              <li>                          
                                <select className="connectleader-select" id="exampleFormControlSelect1">
                                  <option>Select VM</option>
                                  <option>Select VM</option>
                                </select>
                              </li>
                              <li><button type="button" className="btn btn-outline-danger text-white"><i className="fas fa-caret-right"></i> Leave VM</button></li>
                          </ul> 
                          <span className="minus-icon"><i className="fas fa-minus-circle text-white"></i></span>
                        </div> 
                                      
                      </div>
                    </div>
          {/* End Actions, Custom Fields & Click Dialer */}

          {/* Start All-Calls-Emails Tabs */}
                    <div className="prospects-activity-events prospects-activity-common float-left pb-2">
                      <div className="prospects-activity-eventstabs">
                        <ul className="nav nav-tabs">
                          <li className="nav-item active"> <a className="nav-link" href="#" data-toggle="tab" rel="#prospectsalltab">All</a> </li>
                          <li className="nav-item"> <a className="nav-link" href="#" data-toggle="tab" rel="#prospectscalltab">Calls</a> </li>
                          <li className="nav-item"> <a className="nav-link" href="#" data-toggle="tab" rel="#prospectsemailtab">Emails</a> </li>
                        </ul>
                        <div className="tab-content">
                          <div id="prospectsalltab" className="tab-pane">
                            <div className="activity-list"> <span className="activity-time">19 hrs</span> <span className="activity-icon"><i className="fas fa-phone-alt"></i></span>
                              <div className="activity-content">
                                <h3><span>Phone Call</span> to Daymond John</h3>
                                <h4>Meeting Scheduled</h4>
                                <p>05/06/2019   10:48 AM</p>
                              </div>
                            </div>
                            <div className="activity-list"> <span className="activity-time">1 Day</span> <span className="activity-icon"><i className="fas fa-phone-alt"></i></span>
                              <div className="activity-content">
                                <h3><span>Phone Call</span> to Daymond John</h3>
                                <h4>Got Referral</h4>
                                <p>05/06/2019   2:49 PM</p>
                              </div>
                            </div>
                            
                          </div>
                          <div id="prospectscalltab" className="tab-pane">
                            <div className="activity-list"> <span className="activity-time">19 hrs</span> <span className="activity-icon"><i className="fas fa-phone-alt"></i></span>
                              <div className="activity-content">
                                <h3><span>Phone Call</span> to Daymond John</h3>
                                <h4>Meeting Scheduled</h4>
                                <p>05/06/2019   10:48 AM</p>
                              </div>
                            </div>
                            <div className="activity-list"> <span className="activity-time">1 Day</span> <span className="activity-icon"><i className="fas fa-phone-alt"></i></span>
                              <div className="activity-content">
                                <h3><span>Phone Call</span> to Daymond John</h3>
                                <h4>Got Referral</h4>
                                <p>05/06/2019   2:49 PM</p>
                              </div>
                            </div>                           
                         
                          </div>
                          <div id="prospectsemailtab" className="tab-pane"><br />
                            
                           
                          </div>
                        </div>
                      </div>
                    </div>
          {/* End All-Calls-Emails Tabs */}

           </div>
        </ContentWrapper>
    )
}

export default CallProspect
