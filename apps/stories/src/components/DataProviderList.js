import React from 'react';
import CSV_DATA_PROVIDERS_QUERY from './queries/CsvDataProvidersQuery';
import ControlledTable from './Tables/ControlledTable';
import { BadgeStatus } from '@koncert/shared-components';
import { useLazyQuery } from '@apollo/react-hooks';

const initialState = {
  pageIndex: 0,
  pageSize: 10,
  sortBy: [{ id: 'id', desc: true }],
};

const variables = {
  limit: 10,
  skip: 0,
  order: {
    id: 'DESC',
  },
  filter: {},
};

const DataProviderList = ({ customerId }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Filename',
        accessor: 'cloudFile.name',
        disableSortBy: false,
        disableExpanded: true,
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        disableSortBy: true,
        disableExpanded: true,
      },
      {
        Header: 'Size',
        accessor: 'size',
        disableSortBy: false,
        disableExpanded: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableSortBy: false,
        disableExpanded: true,
        Cell: ({ cell: { value } }) => {
          const statusClass = BadgeStatus[value];
          return (
            <div className={`inline wd-sm badge ${statusClass}`}>{value}</div>
          );
        },
      },
    ],
    []
  );

  // We'll start our table without any data
  const [loadedData, setLoadedData] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const callbacks = React.useRef({});
  const initialData = React.useRef([]);

  const [runQuery, { data, refetch, fetchMore }] = useLazyQuery(
    CSV_DATA_PROVIDERS_QUERY,
    {
      onCompleted: (props) => callbacks.current.onDataLoaded(props),
    }
  );

  React.useEffect(() => {
    const updateTable = () => {
      if (data && loadedData) {
        if (loadedData === initialData.current) {
          if (data.v3_Import_CsvDataProviders !== initialData.current) {
            setLoadedData(data.v3_Import_CsvDataProviders);
          } else {
            // console.log("Data has not changed");
          }
        } else {
          // console.log("loadedData", loadedData)
          // console.log("initialData.current", initialData.current);
        }
      }
    };
    updateTable();
  }, [data, loadedData]);

  const fetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      // This will get called when the table needs new data
      // You could fetch your data from literally anywhere,
      // even a server. But for this example, we'll just fake it.

      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // Set the loading state
      setDataLoading(true);
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
            return true;
          });
        return Object.keys(newOrder).length ? newOrder : variables.order;
      };

      const convertedSortBy = convertSortBy({ sortBy });

      //fix this using a ref for loaded data instead
      if (loadedData.length > 0) {
        if (pageIndex === 0) {
          refetch({
            ...variables,
            skip: pageIndex * pageSize,
            limit: pageSize,
            order: convertedSortBy,
          });
        } else {
          fetchMore({
            ...variables,
            skip: pageIndex * pageSize,
            limit: pageSize,
            order: convertedSortBy,
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                v3_Import_CsvDataProvider: [
                  ...prev.v3_Import_CsvDataProviders,
                  ...fetchMoreResult.v3_Import_CsvDataProviders,
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

      callbacks.current = {
        onDataLoaded: (props) => {
          const myData = props && (props.v3_Import_CsvDataProviders || []);
          // Only update the data if this is the latest fetch
          if (fetchId === fetchIdRef.current && myData) {
            setLoadedData(myData);
            initialData.current = myData;

            //setPageCount(Math.ceil(myData.length / pageSize));
            setPageCount(1);

            setDataLoading(false);
          }
        },
      };
    },
    [fetchMore, loadedData.length, refetch, runQuery]
  );

  return (
    <ControlledTable
      initialState={initialState}
      tableId={'Stories'}
      columns={columns}
      data={loadedData}
      fetchData={fetchData}
      loading={dataLoading}
      pageCount={pageCount}
    />
  );
};

export default DataProviderList;
