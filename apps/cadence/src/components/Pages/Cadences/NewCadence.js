import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { parseUrl } from "query-string";
import {Col,Progress,Row } from "reactstrap";
import { ContentWrapper } from "@nextaction/components";
import UserContext from "../../UserContext";
import {
  CREATE_CADENCE,
  UPDATE_CADENCE,
  FETCH_CADENCE_QUERY,
} from "../../queries/CadenceQuery";
import NewCadenceEditor from "./NewCadenceEditor";

const NewCadence = ({ match, history,location }) => {
  const currentURL=location.state&&location.state.currentURL
  const editFlag=location.state&&location.state.editFlag
  
  const [createCadence, { loading: createLoading }] = useLazyQuery(
    CREATE_CADENCE
  );
  const [updateCadence, { loading: updateLoading }] = useLazyQuery(
    UPDATE_CADENCE
  );
  const [getCadence, { loading: getCdenceLoading }] = useLazyQuery(
    FETCH_CADENCE_QUERY
  );

  const { user, loading: userLoading } = useContext(UserContext);
  const cadenceID = match.params["id"];

  const { data: cadenceData, loading } = useQuery(FETCH_CADENCE_QUERY, {
    variables: {
      id: cadenceID,
    },
  });

  const onSubmit = (data) => {
    const { name, description, shareType } = data;
    if (cadenceID) {
      updateCadence({
        variables: {
          id: cadenceID,
          name: name,
          description: description,
          sharedType: shareType,
        },
      });
    } else {
      createCadence({
        variables: {
          name: name,
          description: description,
          sharedType: shareType,
        },
      });
    }
  };

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          <i className="svgicon trucadence-icon mr-2"></i>
          <span>{cadenceID ? "Edit Cadence" : "New Cadence"}</span>
        </div>
      </div>
      <NewCadenceEditor
        cadenceData={cadenceData}
        cadenceID={cadenceID}
        history={history}
        currentURL={currentURL}
        editFlag={editFlag}
      ></NewCadenceEditor>
    </ContentWrapper>
  );
};
export default withRouter(NewCadence);