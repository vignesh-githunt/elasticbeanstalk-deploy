/**
 * @author @Sk_khaja_moulali-gembrill
 * @version V11.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "reactstrap";
import { parseUrl } from "query-string";
import { useQuery } from "@apollo/react-hooks";
import EmailTemplatesGrid from "./EmailTemplatesGrid";
import FETCH_EMAIL_TEMPLATES_QUERY from "../../queries/EmailTemplatesQuery";

const EmailTemplates = (props) => {
  const { query: searchParams } = parseUrl(window.location.search);
  const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(
    searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0
  );
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(
    searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10
  );
  const [offset, setOffset] = useState(
    searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0
  );

  // Fetch Email Templates data from api-server
  let { data: templatesData, loading, error, refetch: refetchEmailTemplates } = useQuery(
    FETCH_EMAIL_TEMPLATES_QUERY,
    {
      variables: { limit, offset },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-first",
    }
  );

  const gridData = useMemo(
    () =>
      templatesData && templatesData.templates
        ? templatesData.templates.data
        : [],
    [templatesData]
  );

  useEffect(
    () =>
      setPageCount(
        !loading && templatesData.templates.paging
          ? Math.ceil(templatesData.templates.paging.totalCount / limit)
          : 0
      ),
    [gridData]
  );

  //this function is used to display the status icons and the data
  const StatusDataReport = ({ name, icon }) => {
    return (
      <>
        <div className="col-2">
          <p className="m-0">{name && name}</p>
          <p className="m-0">
            <i className={`fa fa-${icon} text-muted`}></i>
          </p>
        </div>
      </>
    );
  };
  /* ---- Grid Columns configuration -begin ----- */
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        width: "15%",
        Cell: function (props) {
          return (
             <strong>{props.value}</strong>
          );
        },
      },
      {
        Header: "Subject",
        accessor: "subject",
        width: "15%",
        Cell: function (props) {
          return (
             <strong>{props.value}</strong>
          );
        },
      },
      {
        Header: "Tags",
        accessor: "tag",
        width: "10%",
        Cell: function (props) {
          return (
            <Badge color="light" className="border border-dark" pill>
              {props.value}
            </Badge>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        width: "40%",
        Cell: function (props) {
          let rowData = props.row.original;

          if (rowData.status) {
            return (
              <span>
                <div className="row">
                  <StatusDataReport name={rowData.sent} icon="share" />
                  <StatusDataReport name={rowData.opened} icon="envelope" />
                  <StatusDataReport name={rowData.replied} icon="reply" />
                  <StatusDataReport name={rowData.noOfBounced} icon="rocket" />
                  <StatusDataReport icon="users" />
                </div>
              </span>
            );
          }
        },
      },

      {
        Header: "Last Activity",
        accessor: "updatedDate",
        width: "20%",
        Cell: function (props) {
          return new Date(props.value)
            .toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(",", "");
        },
      },
    ],
    []
  );
  /* ---- Grid Columns configuration -end ----- */

  return (
    <div>
      <EmailTemplatesGrid
        columns={columns}
        data={gridData}
        templatesData={templatesData}
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
        handleRefresh={refetchEmailTemplates}
      />
    </div>
  );
};

export default EmailTemplates;
