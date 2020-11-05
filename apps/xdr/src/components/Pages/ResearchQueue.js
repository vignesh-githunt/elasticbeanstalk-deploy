import React, { useContext } from 'react';
import Header from '../Layout/Header';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col } from 'reactstrap';
import USER_FETCHABLES_QUERY from '../queries/UserFetchablesQuery';
import { useQuery } from '@apollo/react-hooks';
import UserContext from '../UserContext';

const ResearchQueue = (props) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const { loading, data } = useQuery(USER_FETCHABLES_QUERY, {
    variables: {
      userId: user.id,
    },
    skip: userLoading,
  });
  // const [format, setFormat] = useState('day');
  // const [startDate, setStartDate] = useState(new Date('2020-03-01'));
  // const [endDate, setEndDate] = useState(new Date());

  if (loading) return <i className="fa fa-spinner fa-spin"></i>;

  return (
    <React.Fragment>
      <Header parentElement={props.parentElement} toggle={props.toggle} />
      <ContentWrapper>
        <div className="content-heading">
          <div>ResearchQueue</div>
        </div>
        <Row>
          {data && data._plugin_FetchablesMeta && (
            <Col>
              {data._plugin_FetchablesMeta.count} Research Requests in your
              Queue
            </Col>
          )}
        </Row>
        {data &&
          data.plugin_Fetchables &&
          data.plugin_Fetchables.map((f) => {
            return (
              <Row>
                <Col>
                  <a href={f.url} target="new">
                    Researching... (Created At {f.createdAt})
                  </a>
                </Col>
              </Row>
            );
          })}
      </ContentWrapper>
    </React.Fragment>
  );
};

export default ResearchQueue;
