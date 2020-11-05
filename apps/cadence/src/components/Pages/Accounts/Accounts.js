import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Input, InputGroup, InputGroupAddon, Row } from "reactstrap";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { parseUrl } from "query-string";
import classnames from "classnames";
import { ContentWrapper } from "@nextaction/components";
import PageHeader from "../../Common/PageHeader";
import FETCH_ACCOUNTS_QUERY, { DELETE_ACCOUNTS_TAG_QUERY } from "../../queries/AccountsQuery";
import UserContext from "../../UserContext";
import AccountsGrid from "./AccountsGrid";

const Accounts = () => {
  const { query: searchParams } = parseUrl(window.location.search);
  const [pageCount, setPageCount] = useState(0);
  const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
  const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const searchInputRef = React.useRef();

  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");

  const [accountsFilter, setAccountsFilter] = useState(`&filter[user][id]=${currentUserId}&sort[${sortBy}]=${orderBy}`);
  const [showTagAccountModal, setShowTagAccountModal] = useState(false);
  const sortByRef = useRef({});

  const sortingParams = {
    "name": "sort[name]",
    "createdDate": "sort[createdDate]",
    "user": "sort[user][displayName]"
  }

  const { data: accountsData, loading, error, refetch: refreshAccountsGrid } = useQuery(FETCH_ACCOUNTS_QUERY, {
    variables: { includeAssociationsQry: "includeAssociations[]=user", limit, offset, accountFilter: accountsFilter },
    notifyOnNetworkStatusChange: true,
  });
  const accountsGridData = useMemo(() => accountsData && accountsData.accounts ? accountsData.accounts.data : [], [accountsData]);

  useEffect(() => setPageCount(!loading && accountsData.accounts.paging ? Math.ceil(accountsData.accounts.paging.totalCount / limit) : 0), [accountsGridData]);

  const [tagAccount] = useLazyQuery(DELETE_ACCOUNTS_TAG_QUERY, {
    onCompleted: (response) => handleTagAccountRequestCallback(response, true),
    onError: (response) => handleTagAccountRequestCallback(response)
  });

  const columns = [
    {
      Header: "Name",
      accessor: "name",
      width: "20%",
      Cell: function (props) {
        let rowData = props.row.original;
        let prospects = rowData.associations.prospect;
        return (
          <span>
            <Link to={{
              pathname: "/accounts/" + rowData.id, search: window.location.search,
              state: {
                allAccountsData: props.accountsData,
                account: rowData,
                prospects
              }
            }}
              className="text-dark"
            >
              <strong>{props.value}</strong>
            </Link>
            <br></br>
            <small>
              <a href={props.row.original.domainName} target="_blank" className="text-dark">{props.row.original.domainName}</a>
            </small>
          </span>
        );
      }
    },
    {
      Header: "Tags",
      accessor: "tag",
      width: "15%",
      disableSortBy: true,
      Cell: function (props) {
        let rowData = props.row.original;
        let tag = rowData.tag;
        if (Array.isArray(tag)) {
          return (
            <span>
              {tag && tag.map((tag, i) => {
                return <Badge color="light" className={badgeClass} key={i} pill>{tag.tagName}
                  <i className="fa fa-times ml-2 text-muted"
                    onMouseEnter={(e) => e.target.className = "fa fa-times ml-2 text-dark"}
                    onMouseLeave={(e) => e.target.className = "fa fa-times ml-2 text-muted"}
                    onClick={() => handleRemoveTag(tag.id, rowData.id)}
                  >
                  </i>
                </Badge>
              })
              }
            </span>
          );
        } else
          return <span></span>;
      }
    },
    {
      Header: "Prospects",
      accessor: "prospect",
      width: "20%",
      disableSortBy: true,
      Cell: function (props) {
        let rowData = props.row.original;
        return (
          <span className="ml-4">{rowData.associations.prospect.length}</span>
        );
      }
    },
    {
      Header: "Date Created",
      accessor: "createdDate",
      width: "15%",
      Cell: function (props) {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date();
        let date1 = new Date(props.value);
        if (date1.getFullYear() == date.getFullYear()) {
          return months[date1.getMonth()] + ' ' + date1.getDate();
        }
        else {
          return new Date(props.value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).replace(',', '');
        }
      }
    },
    {
      Header: "Owner",
      accessor: "user",
      width: "15%",
      Cell: function (props) {
        let rowData = props.row.original;
        let user = props.accountsData.accounts.includedAssociations.user.find(
          (user) => user.id === rowData.associations.user[0].id
        );
        return (
          <Badge className="rounded-circle p-1 px-2 mx-2 text-primary border border-dark" color="light">{user.displayName.charAt(0).toUpperCase()}</Badge>
        );
      }
    }
  ]

  const badgeClass = classnames("ml-2", "border", "border-dark");

  const handleRemoveTag = (tagId, accountId) => {
    tagAccount({
      variables: {
        id: accountId, tagids: tagId
      },
    });
  }

  const handleTagAccountRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      refreshAccountsGrid();
    }
  }

  const handleAccountsSearch = () => {

    const { query } = parseUrl(window.location.search);
    query["filter[user][id]"] = currentUserId;

    let name = searchInputRef.current.value.trim();

    if (name) {
      query["filter[name]"] = name;
    }
    else
      delete query["filter[name]"];

    query[sortingParams[sortBy]] = orderBy

    let filterQry = Object.entries({ ...query })
      .filter(([key]) => key.startsWith("filter") || key.startsWith("sort"))
      .map(([key, val]) => `${key}=${val}`).join("&");

    setAccountsFilter(filterQry === "" ? "" : "&" + filterQry);
  }

  useEffect(() => handleAccountsSearch(), [sortBy, orderBy])

  if (!sortByRef.current) {
    sortByRef.current.value = {}
  }

  return (
    <ContentWrapper>
      <PageHeader icon="far fa-building" pageName="Accounts">
        <InputGroup>
          <Input
            placeholder="Search"
            innerRef={searchInputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAccountsSearch()
              }
            }}
          />
          <InputGroupAddon addonType="append">
            <Button outline onClick={handleAccountsSearch}>
              <i className="fa fa-search"></i>
            </Button>
            <Button
              outline
              onClick={() => {
                searchInputRef.current.focus()
                searchInputRef.current.value = '';
                handleAccountsSearch();
              }}>
              <i className="fa fa-times"></i>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </PageHeader>
      <Row>
        <Col>
          <Card className="card-default">
            <Row>
              <Col>
                <AccountsGrid
                  columns={columns}
                  data={accountsGridData}
                  accountsData={accountsData}
                  sortBy={sortBy}
                  orderBy={orderBy}
                  fetchData={({ pageIndex, pageSize }) => {

                    setOffset(pageIndex);
                    setCurrentPageIndex(pageIndex);
                    setLimit(pageSize);
                    if (!currentUrlStatePushed) {
                      window.history.replaceState({}, "", window.location.href);
                      setCurrentUrlStatePushed(true);
                    }

                    const { query } = parseUrl(window.location.search);
                    query["page[limit]"] = pageSize;
                    query["page[offset]"] = pageIndex;

                    let searchString = Object.entries(query)
                      .map(([key, val]) => `${key}=${val}`)
                      .join("&");

                    window.history.replaceState({}, "", "?" + searchString);
                  }}

                  loading={loading}
                  pageSize={limit}
                  pageCount={pageCount}
                  error={error}
                  currentPageIndex={currentPageIndex}
                  handleSort={(sortBy, orderBy) => {

                    setSortBy(sortBy);
                    setOrderBy(orderBy ? "desc" : "asc");
                  }}
                  handleRefresh={refreshAccountsGrid}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </ContentWrapper>
  )
}

export default Accounts;
