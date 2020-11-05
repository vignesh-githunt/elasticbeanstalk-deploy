/**
 * @author @Sk_khaja_moulali-gembrill
 * @version V11.0
 */

import React, { useMemo, useState } from "react";
import { Badge } from "reactstrap";
import { parseUrl } from "query-string";
import { useQuery } from "@apollo/react-hooks";
import FETCH_EMAIL_TEMPLATES_QUERY from "../../queries/EmailTemplatesQuery";
import SnippetsGrid from "./SnippetsGrid";

const Snippets = (props) => {
  
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
  let { data: snippetsData, loading, error } = useQuery(
    FETCH_EMAIL_TEMPLATES_QUERY,
    {
      variables: { limit, offset },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-first",
    }
  );

  const gridData = useMemo(
    () =>
      snippetsData && snippetsData.snippets ? snippetsData.snippets.data : [],
    [snippetsData]
  );

  /* ---- Grid Columns configuration -begin ----- */
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        width: "25%",
      },
      {
        Header: "Tags",
        accessor: "tagContent",
        width: "25%",
        Cell: function (props) {
          return (
            <Badge color="secondary" pill>
              {props.value}
            </Badge>
          );
        },
      },
      {
        Header: "Owner",
        accessor: "id",
        width: "25%",
      },

      {
        Header: "Last Activity",
        accessor: "updatedDate",
        width: "25%",
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
    <SnippetsGrid
      columns={columns}
      data={gridData}
      snippetsData={snippetsData}
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
    />
  );
};

export default Snippets;
