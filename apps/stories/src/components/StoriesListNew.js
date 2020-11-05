import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react';
import STORIES_QUERY from './queries/StoriesQueryNew';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Collapse,
  Card,
  CardDeck,
  CardBody,
  CardHeader,
  CardFooter,
  CardTitle,
  CardText,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import UserContext from './UserContext';
import ControlledTable from './Tables/ControlledTable';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import TOGGLE_STORY_PAUSED_MUTATION from './mutations/stories/ToggleStoryPausedMutation';

const StoriesList = ({ customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const [togglePaused] = useMutation(TOGGLE_STORY_PAUSED_MUTATION, {
    update(cache, { data: { updateV3_Customer_Story } }) {
      cache.writeFragment({
        id: 'V3_Customer_Story:' + updateV3_Customer_Story.id,
        fragment: gql`
          fragment toggledStory on V3_Customer_Story {
            __typename
            pausedAt
          }
        `,
        data: {
          __typename: 'V3_Customer_Story',
          pausedAt: updateV3_Customer_Story.pausedAt,
        },
      });

      const { v3_Customer_Stories } = cache.readQuery({
        query: STORIES_QUERY,
        variables,
      });

      setLoadedData(v3_Customer_Stories);
    },
  });
  const toggleStoryStatus = (id, status) => {
    if (status == 'play') {
      togglePaused({ variables: { id: id, pausedAt: null } });
    } else {
      togglePaused({ variables: { id: id, pausedAt: new Date() } });
    }
  };

  const columns = React.useMemo(() => [
    {
      // Make an expander cell
      Header: () => null, // No header
      disableSortBy: true,
      accessor: 'id',
      Cell: ({ row }) => (
        <span>
          {row.isExpanded ? (
            <i className={'fa fa-angle-down'}></i>
          ) : (
            <i className={'fa fa-angle-right'}></i>
          )}
        </span>
      ),
    },
    {
      Header: 'Priority',
      accessor: 'priority',
      disableSortBy: false,
      Cell: ({ cell: { value } }) => (
        <div className="badge bg-gray-lighter">{value}</div>
      ),
    },
    {
      Header: 'Touches',
      accessor: 'messages',
      disableSortBy: true,
      Cell: ({ cell: { value } }) => {
        const touches = (value || []).map((key) => (
          <i key={key.id} className="circle circle-md"></i>
        ));
        return touches;
      },
    },
    {
      Header: 'Story',
      accessor: 'name',
      disableSortBy: true,
      disableExpanded: true,
      Cell: ({ row: { values } }) => {
        return <Link to={`/stories/${values.id}`}>{values.name}</Link>;
      },
    },
    {
      Header: 'Matching Accounts',
      accessor: 'matchingAccountsCount',
      disableSortBy: false,
    },
    {
      Header: 'Matching Contacts',
      accessor: 'matchingContactsCount',
      disableSortBy: false,
    },
    {
      Header: '',
      accessor: 'pausedAt',
      disableSortBy: true,
      disableExpanded: true,
      Cell: ({ row, cell: { value } }) => {
        if (value) {
          return (
            <button
              className="btn btn-secondary"
              onClick={() => toggleStoryStatus(row.values.id, 'play')}
            >
              <i className={'fa fa-play text-muted'}></i>
            </button>
          );
        } else {
          return (
            <button
              className="btn btn-secondary"
              onClick={() => toggleStoryStatus(row.values.id, 'pause')}
            >
              <i className={'fa fa-pause text-primary'}></i>
            </button>
          );
        }
      },
    },
  ]);

  const initialOrder = {
    priority: 'ASC',
  };
  const [variables, setVariables] = useState({
    limit: 10,
    skip: 0,
    order: initialOrder,
    filter: {
      customerId: user.rolesMask === 1 ? customerId : user.companyId,
    },
  });

  // We'll start our table without any data
  const [loadedData, setLoadedData] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const callbacks = React.useRef({});

  const convertSortBy = ({ sortBy }) => {
    let newOrder = {};
    sortBy &&
      sortBy.map((sort) => {
        let mappedOrder = '';
        switch (sort.id) {
          case 'priorityBadge':
            mappedOrder = 'priority';
            break;
          default:
            mappedOrder = sort.id;
            break;
        }
        newOrder[mappedOrder] = sort.desc ? 'DESC' : 'ASC';
      });
    return Object.keys(newOrder).length ? newOrder : variables.order;
  };

  const [runQuery, { loading, data, refetch, fetchMore }] = useLazyQuery(
    STORIES_QUERY,
    {
      onCompleted: (props) => callbacks.current.onDataLoaded(props),
    }
  );
  const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy }) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current;

    // Set the loading state
    setDataLoading(true);

    const convertedSortBy = convertSortBy({ sortBy });

    //fix this using a ref for loaded data instead
    if (loadedData.length > 0) {
      if (pageIndex == 0) {
        refetch({
          ...variables,
          skip: pageIndex * pageSize,
          limit: pageSize,
          order: convertedSortBy,
        });
      } else {
        console.log('fetch more');
        fetchMore({
          ...variables,
          skip: pageIndex * pageSize,
          limit: pageSize,
          order: convertedSortBy,
          updateQuery: (prev, { fetchMoreResult }) => {
            console.log('prev', prev);
            if (!fetchMoreResult) return prev;
            console.log('prev', prev);
            return Object.assign({}, prev, {
              v3_Customer_Stories: [
                ...prev.v3_Customer_Stories,
                ...fetchMoreResult.v3_Customer_Stories,
              ],
            });
          },
        });
      }
    } else {
      runQuery({
        ...variables,
        skip: pageIndex * pageSize,
        limit: pageSize,
        order: convertedSortBy,
      });
    }

    //runQuery(variables)

    // We'll even set a delay to simulate a server here
    callbacks.current = {
      onDataLoaded: (props) => {
        console.log('callback fired');
        const myData = props && props.v3_Customer_Stories;
        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current && myData) {
          setLoadedData(myData);

          //setPageCount(Math.ceil(myData.length / pageSize));
          setPageCount(1);

          setDataLoading(false);
        }
      },
    };
  }, []);

  const renderSubComponent = React.useCallback(({ row }) => {
    return <p>test</p>;
  }, []);

  const initialState = {
    pageIndex: 0,
    pageSize: 10,
    sortBy: [{ id: 'priority', desc: false }],
  };

  return (
    <ControlledTable
      initialState={initialState}
      tableId={'Stories'}
      columns={columns}
      data={loadedData}
      fetchData={fetchData}
      loading={dataLoading}
      pageCount={pageCount}
      renderRowSubComponent={renderSubComponent}
    />
  );
};

const mapStateToProps = (state) => ({ customerId: state.customer.id });

export default connect(mapStateToProps)(StoriesList);
