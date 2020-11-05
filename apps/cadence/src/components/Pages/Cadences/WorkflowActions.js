import React, { useState,useEffect } from "react";
import { Alert, Col, Row, Progress } from "reactstrap";
import { connect } from "react-redux";
import { Input, Table } from "reactstrap";
import { useQuery } from "@apollo/react-hooks";
import { getAllCadences } from "../../../store/actions/actions";
import { FETCH_OUTCOMES_QUERY } from "../../queries/CadenceQuery";
import FETCH_CALLDISPOSITIONS_QUERY from "../../queries/CallDispositionsQuery";

const WorkflowActions = ({
  register,
  cadences,
  isoutcome,
  defaultFilter,
  filterType,
  handleWorkFlow,
  editFlag,
  editOutcome,
  currentCadence
  
}) => {
  const [limit] = useState("100");
  const [offset] = useState(0);
  const [moveCadences, setMoveCadences] = useState({});
  const [selectCadences, setSelectCadences] = useState({});
  
  const workflowConfig = (filterType) => {
    switch (filterType) {
      case "Email":
        return {
          filter: `&filter[touchType]=EMAIL`,
          query: FETCH_OUTCOMES_QUERY,
        };
      case "Call":
        return {
          filter: defaultFilter,
          query: FETCH_CALLDISPOSITIONS_QUERY,
        };
      case "Text":
        return {
          filter: `&filter[touchType]=TEXT`,
          query: FETCH_OUTCOMES_QUERY,
        };
      default:
        return {
          filter: `&filter[touchType]=EMAIL`,
          query: FETCH_OUTCOMES_QUERY,
        };
    }
  };

  const {
    data: workflowdata,
    loading,
    error,
    refetch: refreshOutcomesGrid,
  } = useQuery(workflowConfig(filterType).query, {
    variables: {
      limit,
      offset,
      filter: workflowConfig(filterType).filter,
    },
  });
  useEffect(()=>{
    if(editFlag){

      
      editOutcome.map((outcomeData)=>{
        setMoveCadences({
          ...moveCadences,
          [outcomeData.outcome]: outcomeData.action,
        });
        
        outcomeData.movedToMultiTouchId!=0&& setSelectCadences({
          ...selectCadences,
          [outcomeData.outcome]:outcomeData.movedToMultiTouchId
        });


      })
    }
    
  },[editOutcome])
  
  useEffect(()=>
    handleWorkFlow(workflow)
  )

  if (loading)
    return (
      <Row>
        <Col>
          <Progress animated color="info" value="100" />
        </Col>
      </Row>
    );

  const workflowdatas = isoutcome
    ? workflowdata.outcomes.data
    : workflowdata.callDispositions.data;

    var workflow=[]
    for(let i=0;i<workflowdatas.length;i++){
      let temp=[]
      temp={outcome:workflowdatas[i]["name"],action:moveCadences[workflowdatas[i]["name"]]?moveCadences[workflowdatas[i]["name"]]: workflowdatas[i]["defaultAction"],movedToMultiTouchId:selectCadences[workflowdatas[i]["name"]]?selectCadences[workflowdatas[i]["name"]]: 0}
      workflow.push(temp)

    }
  return (
    <>
      <Table striped className="mb-0">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>Action</th>
            <th className="text-uppercase"></th>
          </tr>
        </thead>
        <tbody>
          {workflow.length > 0 &&
            workflow.map((column, index) => {
              
              return (
                <tr key={index}>
                  <td>{column.outcome}</td>
                  <td>
                    <Input
                      type="select"
                      name="action"
                      innerRef={register(true)}
                      value={column.action}
                      onChange={(e) => {
                        setMoveCadences({
                          ...moveCadences,
                          [column.outcome]: e.currentTarget.value,
                        });
                      }}
                    >
                      <option value="Exit Cadence">Exit Cadence</option>
                      <option value="Move To Next Touch">Move To Next Touch</option>
                      <option value="Move To Another Cadence">Move To Another Cadence</option>
                      <option value="No Action">No Action</option>
                    </Input>
                  </td>
                  <td>
                    <Input
                      type="select"
                      name="movedToMultiTouchId"
                      value={column.movedToMultiTouchId}
                      innerRef={register(true)}
                      disabled={column.action != "Move To Another Cadence"}
                      onChange={(e)=>{setSelectCadences({...selectCadences,[column.outcome]:e.currentTarget.value})}}
                    >
                      <option value={"Select Cadence"}> Select Cadence</option>
                      {cadences.data &&
                        cadences.data.map((cadence, i) => {
                          if(cadence.id !==currentCadence.id){
                            return (
                              <option value={cadence.id} key={i} >
                                {cadence.name}
                              </option>
                            );
                          }
                        })}
                    </Input>
                  </td>
                </tr>
              );
            })}
            
          {workflowdatas.length == 0 && (
            <tr>
              <td colSpan="3">
                <Alert color="danger" className="text-center" role="alert">
                  <h4>
                    <i className="fas fa-exclamation-circle fa-lg mr-2"></i>
                    No Data Available
                  </h4>
                </Alert>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

const mapStateToProps = (state) => ({
  cadences: state.cadences,
});

export default connect(mapStateToProps, { getAllCadences })(WorkflowActions);