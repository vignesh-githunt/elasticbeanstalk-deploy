import React, { useEffect,useState,useRef } from "react";
import { useQuery } from "@apollo/react-hooks";
import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Progress
} from "reactstrap";
import { useForm } from "react-hook-form";
import CloseButton from "../../Common/CloseButton";
import ClButton from "../../Common/Button";
import { FETCH_SCHEDULE_QUERY } from "../../queries/TouchQuery";
import SearchEmailTemplateModal from "./SearchEmailTemplateModal";
import WorkflowActions from "./WorkflowActions";

const EmailTouchModal = ({
  showModal,
  hideModal,
  Loading,
  currentUserId,
  currentCadence,
  handleAction,
  editFlag,
  editData,
  editOutcome
}) => {
  const [limit] = useState("10");
  const [offset] = useState(0);
  const formRef = React.useRef();
  const { handleSubmit, register, errors,reset } = useForm();
  const [Personalize, setPersonalize] = useState(false);
  const [scheduleTypeState, setScheduleTypeState] = useState(false);
  const [emailTouchFilter] = useState(`&filter[touchType]=EMAIL`);
  const [form, setForm] = useState({});
  const [ShowSearchEmailTemplateModal, setSearchEmailTemplateModal] = useState(
    false
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [workFlowState, setworkFlowState] = useState([])
  const wfdata = useRef([]);
  var WFoutput,emailTouchDataEdit;

  useEffect(()=>{
    if(editFlag){

      editData.map((edit)=>{
        let datetime=edit.scheduledDateTime && (edit.scheduledDateTime).split("T")
        emailTouchDataEdit=
      {
       "timeToWaitAndExecute":edit.waitPeriodBeforeStart,
        "timeToWaitUnit":edit.waitPeriodUnit,
        "templateName":edit.associations.emailTemplate.id,
        "previewEmailFlag":edit.timeToComplete!==null?setPersonalize(true):setPersonalize(false),
        "timeToComplete":edit.timeToComplete,
        "timeToCompleteUnit":edit.timeToCompleteUnit,
        "scheduleType":edit.scheduleType,
        "scheduledDate":datetime && datetime[0],
        "scheduleTime":datetime && datetime[1],
        "touchExecutionScheduleId":edit.associations.schedule.id,
        "scheduledTimezone":edit.scheduleTimezone
      }
      })
      reset(emailTouchDataEdit)
    }
    
  },[editData])

  const handleWorkFlow=(data)=>{
    WFoutput=data
    
  }
  
  const onSubmitEmailTouch = (data) => {
    const selectedEmailIds = selectedIds.map((tempalte) => tempalte.id);
    handleAction(data, selectedEmailIds,WFoutput);
    hideModal()
    
  };

 const handleModalClose = () => {
    setForm();
  };

  const handleOnChange = () => {
    setPersonalize(!Personalize);
  };

  const removeTemplate = (id) => {
    var filteredAry = selectedIds.filter((item) => item.id != id);
    setSelectedIds(filteredAry);
  };

  const {
    data: schedules,
    loading,
    error,
    refetch: refreshSchedules,
  } = useQuery(FETCH_SCHEDULE_QUERY, {
    variables: {
      limit,
      offset,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });
  const handleEmailSearch = () => {
    setSearchEmailTemplateModal(true);
  };

  return (
    <>
      <Modal size="lg" isOpen={showModal} onClosed={handleModalClose} centered>
        <Form name="addEmailTouch" onSubmit={handleSubmit(onSubmitEmailTouch)} 
        >
          <ModalHeader>Add Email Touch</ModalHeader>
          <ModalBody>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="time_to_wait_and_execute">Time to wait and Execute </Label>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input type="number"  min="0" name="timeToWaitAndExecute" step="1"  invalid={errors.timeToWaitAndExecute}  innerRef={register({required: "Required Time to wait and Execute",})}/>
                  <ErrorMessage
                    errors={errors}
                    name="timeToWaitAndExecute"
                    id="time_to_wait_and_execute"
                    className="invalid-feedback"
                    as="p"
                  ></ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input type="select" name="timeToWaitUnit" innerRef={register(true)}>
                    <option value="Mi">Minute(s)</option>
                    <option value="Ho">Hour(s)</option>
                    <option value="Da">Day(s)</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="add_prospect_title">Choose Templates </Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <InputGroup>
                    <Input
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEmailSearch();
                        }
                      }}
                    />
                    <InputGroupAddon addonType="append">
                      <Button outline onClick={handleEmailSearch}>
                        <i className="fa fa-search"></i>
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Label for="template_name">Selected Templates </Label>
              </Col>
              <Col>
                {selectedIds.map((template, i) => {
                  return (
                    <Row key={i}>
                      <Col name="templateName" id="template_name" innerRef={register(true)}>{template.name} </Col>
                      <Col>
                        <Button onClick={(e) => removeTemplate(template.id)}>
                          <i className="fas fa-times mr-2 text-danger"></i>
                        </Button>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
            </Row>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="email_touch_type">Email Touch Type </Label>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input
                    type="select"
                    name="emailTouchType"
                    id="email_touch_type"
                    innerRef={register(true)}
                    id="emailtouchtype"
                  >
                    <option value="New">New Email</option>
                    <option value="Reply">Reply Email</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="preview_email_flag">Personalize Email before send</Label>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input
                    type="checkbox"
                    name="previewEmailFlag"
                    id="preview_email_flag"
                    checked={Personalize}
                    onChange={handleOnChange}
                    innerRef={register(true)}
                  />
                </FormGroup>
              </Col>
            </Row>
            {Personalize && (
              <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="time_to_complete">Maximum Time to complete the Touch</Label>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Input
                    type="number"
                    min="0"
                    name="timeToComplete"
                    id="time_to_complete"
                    step="1"
                    invalid={errors.timeToComplete}
                    innerRef={register({
                      required: "Required Maximum Time to complete the Touch",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="timeToComplete"
                    className="invalid-feedback"
                    as="p"
                  ></ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Input
                    type="select"
                    name="timeToCompleteUnit"
                    innerRef={register(true)}
                  >
                    <option value="Mi">Minute(s)</option>
                    <option value="Ho">Hour(s)</option>
                    <option value="Da">Day(s)</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            )}
            {!Personalize && (
              <>
                <Row form>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="schedule_type">Select Schedule Type</Label>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Input
                        type="select"
                        name="scheduleType"
                        id="schedule_type"
                        innerRef={register(true)}
                        onChange={(e) => setScheduleTypeState(e.target.value)}
                      >
                        <option value=""></option>
                        <option value="Send by execution schedule">Send by execution schedule</option>
                        <option value="Send by exact date/time">Send by exact date/time</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                {scheduleTypeState==="Send by execution schedule" && (
                  <Row form>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="touch_execution_schedule_Id">Choose a Schedule</Label>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Input
                          type="select"
                          name="touchExecutionScheduleId"
                          id="touch_execution_schedule_Id"
                          innerRef={register(true)}
                        >
                          {!loading && schedules.schedules.data &&
                            schedules.schedules.data.map((schedule, i) => {
                              return (
                                <option value={schedule.id} key={i}>
                                  {schedule.name}
                                </option>
                              );
                            })}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                )}
                {scheduleTypeState==="Send by exact date/time" && (
                  <Row form>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="scheduled_date">Date/Time</Label>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Input
                          type="date"
                          name="scheduledDate"
                          id="scheduled_date"
                          innerRef={register(true)}
                        ></Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Input
                          type="time"
                          name="scheduleTime"
                          innerRef={register(true)}
                          id="time"
                        ></Input>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for="scheduled_timezone">Timezone</Label>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Input
                          type="select"
                          name="scheduledTimezone"
                          innerRef={register(true)}
                          id="scheduled_timezone"
                        >
                          <option value={"America/New_York"}>
                            EST – Eastern Standard Time
                          </option>
                          <option value={"America/Chicago"}>
                            CST - Central Standard Time
                          </option>
                          <option value={"America/Denver"}>
                            MST - Mountain Standard Time
                          </option>
                          <option value={"America/Los_Angeles"}>
                            PST - Pacific Standard Time
                          </option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </>
            )}

            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="txt_bcc">Send Emails through BCC</Label>
                </FormGroup>
              </Col>
              <Col md={9}>
                <FormGroup>
                  <Input type="text" name="txtBCC" id="txt_bcc" innerRef={register(true)}></Input>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={12}>
                <Card>
                  <WorkflowActions
                    register={register}
                    filterType="Email"
                    defaultFilter={emailTouchFilter}
                    isoutcome={true}
                    handleWorkFlow={handleWorkFlow}
                    editOutcome={editOutcome}
                    editFlag={editFlag}
                    currentCadence={currentCadence}
                  >
                  </WorkflowActions>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <ClButton
              type="submit"
              color="primary"
              icon="fa fa-check"
              loading={Loading}
              //onClick={onSubmitEmailTouch}
            >
              Save
            </ClButton>
            <CloseButton onClick={hideModal} />
          </ModalFooter>
        </Form>
        <SearchEmailTemplateModal
          showModal={ShowSearchEmailTemplateModal}
          currentUserId={currentUserId}
          currentCadence={currentCadence}
          handleAction={(data) => {
            setSelectedIds(data);
            setSearchEmailTemplateModal(false);
          }}
          hideModal={() => {
            setSearchEmailTemplateModal(false);
          }}
        />
      </Modal>
    </>
  );
};

export default EmailTouchModal;