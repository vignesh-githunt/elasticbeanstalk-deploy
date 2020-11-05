/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React, { useEffect, useState } from 'react';
import { parseUrl } from "query-string";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardHeader } from 'reactstrap';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { FETCH_ALL_OUTCOMES_QUERY, FETCH_CALL_OUTCOMES_QUERY, UPDATE_TOUCH_OUTCOME_QUERY } from '../../queries/SettingsQuery';
import TouchOutcomeGrid from './TouchOutcomeGrid';
import { default as OutcomeModal } from './EditOutcomeModal';


const OutcomeColumns = ({ match }) => {
  let outcomesData = [];
  let count = 0;
  const { query: searchParams } = parseUrl(window.location.search);
  const [pageCount, setPageCount] = useState(0);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [outcomeValue, setOutcomeValue] = useState();
  const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
  const { data: multiTouchOutcomes, refetch: refetchTouchOutcome } = useQuery(FETCH_ALL_OUTCOMES_QUERY, { variables: { limit, offset } });
  const { data: callOutcomes, loading, error, refetch: refetchCallTouchOutcome } = useQuery(FETCH_CALL_OUTCOMES_QUERY, {
    variables: { limit, offset },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first"
  });

  if (callOutcomes !== undefined && multiTouchOutcomes !== undefined) {
    count = callOutcomes.call.paging.totalCount + multiTouchOutcomes.allOutcomes.paging.totalCount;
    const callOutcomesData = callOutcomes.call.data.map(data => {
      let products = '';
      if (data.clickDialer && data.personalDialer & data.teamDialer) {
        products = 'CD,PD,TD'
      } else if (data.clickDialer && data.personalDialer) {
        products = 'CD,PD'
      } else if (data.clickDialer && data.teamDialer) {
        products = 'CD,TD'
      } else if (data.personalDialer && data.teamDialer) {
        products = 'PD,TD'
      } else if (data.personalDialer) {
        products = 'PD'
      } else if (data.teamDialer) {
        products = 'TD'
      } else if (data.clickDialer) {
        products = 'CD'
      }

      return ({
        id: data.id,
        defaultAction: data.defaultAction,
        outcomeGroup: data.memberStage,
        outComes: data.name,
        productType: products,
        touchType: "Call",
        displayMetrics: data.enableForReport
      });
    })
    const otherOutcomesData = multiTouchOutcomes.allOutcomes.data.map(data => {
      return ({
        id: data.id,
        defaultAction: data.defaultAction,
        outcomeGroup: data.memberStage,
        outComes: data.name,
        productType: data.productType,
        touchType: data.touchType,
        displayMetrics: data.showOnMetrics
      });
    })
    for (let i = 0; i < otherOutcomesData.length; i++) {
      outcomesData.push(otherOutcomesData[i]);
    }
    for (let i = 0; i < callOutcomesData.length; i++) {
      outcomesData.push(callOutcomesData[i]);
    }
  }
  const columns = [
    {
      Header: "Touch Type",
      accessor: "touchType",
      width: "20%"
    },
    {
      Header: "Outcome",
      accessor: "outComes",
      width: "25%",
    },
    {
      Header: "Outcome Group",
      accessor: "outcomeGroup",
      width: "20%"
    },
    {
      Header: "Default Action",
      accessor: "defaultAction",
      width: "20%"
    },
    {
      Header: "Product Type",
      accessor: "productType",
      width: "15%"
    },
  ];
  useEffect(() => setPageCount(outcomesData ? Math.ceil(count / limit) : 0), [outcomesData]);

  const updateOutcome = (outcomes) => {
    setOutcomeValue(outcomes)
    setShowOutcomeModal(true)
  }

  const [editOutcome, { loading: editTouchOutcomeLoading }] = useLazyQuery(UPDATE_TOUCH_OUTCOME_QUERY, {
    onCompleted: (response) => editOutcomeCallBack(response, true),
    onError: (response) => editOutcomeCallBack(response)
  });

  const editTouchOutcome = (outComeId, input) => {
    editOutcome({
      variables: {
        id: outComeId,
        input: input
      }
    })
  }

  const toastStyles = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  const successNotify = () => toast.success("Saved Successfully!", toastStyles)
  const errorNotify = () => toast.error("Failed to save.Try after sometime else contact ConnectLeader support", toastStyles)


  const editOutcomeCallBack = (response, status) => {
    if (status) {
      successNotify();
      setShowOutcomeModal(false)
      refetchTouchOutcome();
      refetchCallTouchOutcome();
    } else {
      errorNotify();
    }
  }
  return (
    <Card className="b">
      <CardHeader className="bg-gray-lighter text-bold border-bottom">
        <i className="fas fa-user mr-2"></i>Touch Outcomes
      </CardHeader>
      <TouchOutcomeGrid
        columns={columns}
        data={outcomesData}
        loading={loading}
        error={error}
        pageSize={limit}
        pageCount={pageCount}
        currentPageIndex={currentPageIndex}
        handleRefresh={() => {
          refetchTouchOutcome();
          refetchCallTouchOutcome();
        }}
        updateOutcome={updateOutcome}
      />
      <OutcomeModal
        hideModal={() => { setShowOutcomeModal(false) }}
        showModal={showOutcomeModal}
        data={outcomeValue}
        editTouchOutcomeLoading={editTouchOutcomeLoading}
        editTouchOutcome={editTouchOutcome}
      />
      <ToastContainer toastStyles />
    </Card>
  );
}
export default OutcomeColumns;