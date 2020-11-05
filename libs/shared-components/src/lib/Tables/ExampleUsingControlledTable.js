import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
import USER_STORY_CONTACTS_QUERY from "./queries/UserStoryContactsQuery";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ControlledTable from "./Tables/ControlledTable";
import { useLazyQuery } from "@apollo/react-hooks";
//import EmailMessages from "./EmailMessages";
import { BadgeStatus } from "./Common/constants";
import moment from "moment";

const MessageQueue = ({ customerId, user }) => {
  const columns = React.useMemo(() => [
    {
      // Make an expander cell
      Header: () => null, // No header
      id: "expander", // It needs an ID
      disableSortBy: true,
      Cell: ({ row }) => (
        <span>
          {row.isExpanded ? (
            <i className={"fa fa-angle-down"}></i>
          ) : (
            <i className={"fa fa-angle-right"}></i>
          )}
        </span>
      ),
    },
    {
      Header: "Priority",
      accessor: "priority",
      disableSortBy: false,
      Cell: ({ cell: { value } }) => (
        <div className="badge bg-gray-lighter">{value}</div>
      ),
    },
    {
      Header: "Touches",
      accessor: "emailContent",
      disableSortBy: false,
      Cell: ({ cell: { value } }) => {
        const touches = Object.keys(value).map((key) => {
          if (key !== "__typename")
            return <i key={key} className="circle circle-md"></i>;
        });
        return touches;
      },
    },
    {
      Header: "Story",
      accessor: "story",
      disableSortBy: true,
      Cell: ({ cell: { value } }) => {
        return <Link to={`/stories/${value.id}`}>{value.name}</Link>;
      },
    },
    {
      Header: "Account",
      accessor: "account.nameValue",
      disableSortBy: true,
    },
    {
      Header: "Title",
      accessor: "contact.position.title",
      disableSortBy: true,
    },
    {
      Header: "Contact",
      accessor: "contact",
      disableSortBy: true,
      Cell: ({ cell: { value } }) => (
        <Link to={"/contacts/" + value.id}>
          {value.givenNameValue} {value.familyNameValue}
        </Link>
      ),
    },
    {
      Header: "Last Modified",
      accessor: "updatedAt",
      disableSortBy: false,
      Cell: ({ cell: { value } }) => <span>{moment(value).fromNow()}</span>,
    },
    {
      Header: "Personalization",
      accessor: "personalizationScore",
      disableSortBy: false,
      Cell: ({ cell: { value } }) => {
        const progressbarClass =
          value > 50 ? "bg-success" : value > 30 ? "bg-warning" : "bg-danger";
        return (
          <div className="progress progress-xs">
            <div
              className={`progress-bar progress-bar-striped ${progressbarClass}`}
              role="progressbar"
              style={{ width: value + "%" }}
            >
              <span className="sr-only">{value}% Complete</span>
            </div>
          </div>
        );
      },
    },
    {
      Header: "Status",
      accessor: "statusValue",
      disableSortBy: false,
      Cell: ({ cell: { value } }) => {
        const statusClass = BadgeStatus[value];
        return (
          <div className={`inline wd-xs badge ${statusClass}`}>{value}</div>
        );
      },
    },
  ]);

  const initialOrder = {
    priority: "ASC",
    personalizationScore: "DESC",
  };
  const [variables, setVariables] = useState({
    limit: 10,
    skip: 0,
    order: initialOrder,
    filter:
      user.rolesMask === 1
        ? {
            customerId: customerId || user.companyId,
          }
        : {
            customerId: user.companyId,
            senderId: user.id,
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
        let mappedOrder = "";
        switch (sort.id) {
          case "priorityBadge":
            mappedOrder = "priority";
            break;
          case "personalization":
            mappedOrder = "personalizationScore";
            break;
          default:
            mappedOrder = sort.id;
            break;
        }
        newOrder[mappedOrder] = sort.desc ? "DESC" : "ASC";
      });
    return Object.keys(newOrder).length ? newOrder : variables.order;
  };

  const [runQuery, { loading, data, refetch, fetchMore }] = useLazyQuery(
    USER_STORY_CONTACTS_QUERY,
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
        console.log("fetch more");
        fetchMore({
          ...variables,
          skip: pageIndex * pageSize,
          limit: pageSize,
          order: convertedSortBy,
          updateQuery: (prev, { fetchMoreResult }) => {
            console.log("prev", prev);
            if (!fetchMoreResult) return prev;
            console.log("prev", prev);
            return Object.assign({}, prev, {
              v3_Customer_StoryContacts: [
                ...prev.v3_Customer_StoryContacts,
                ...fetchMoreResult.v3_Customer_StoryContacts,
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
        console.log("callback fired");
        const myData = props && props.v3_Customer_StoryContacts;
        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current && myData) {
          setLoadedData(myData);

          //setPageCount(Math.ceil(myData.length / pageSize));
          setPageCount(10);

          setDataLoading(false);
        }
      },
    };
  }, []);

  const renderRowSubComponent = React.useCallback(({ row }) => {
    return <div row={row} />; // implement something with the expanded row here
  }, []);

  const initialState = {
    pageIndex: 0,
    pageSize: 10,
    sortBy: [
      { id: "priority", desc: false },
      { id: "personalizationScore", desc: true },
    ],
  };
  return (
    <ControlledTable
      initialState={initialState}
      tableId={"DataTables_Table_1"}
      columns={columns}
      data={loadedData}
      fetchData={fetchData}
      loading={dataLoading}
      pageCount={pageCount}
      renderRowSubComponent={renderRowSubComponent}
    />
  );
};

const mapStateToProps = (state) => ({
  customerId: state.customer.id,
  user: state.auth.user,
});

export default connect(mapStateToProps)(MessageQueue);
