import React, {
  useState,
  useMemo,
  useContext,
} from "react";
import { Sparkline } from "../Common/Sparklines";
import STORYJOURNALAGGREGATION from "../queries/StoryJournalAggregationQuery";
import { useQuery } from "@apollo/react-hooks";
import UserContext from "../UserContext";

const StoryJournalGraph = ({
  title,
  color,
  bgColorClass,
  event,
  format,
  startDate,
  endDate,
  storyId,
  groupByStoryId,
  senderId,
  groupBySender,
}) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const [fixedData, setFixedData] = useState("10,10,10,10,10,10");
  const [totalData, setTotalData] = useState(0);

  const { loading, data } = useQuery(STORYJOURNALAGGREGATION, {
    variables: {
      customerId: user.companyId,
      format: format,
      event: event,
      startDate: startDate,
      endDate: endDate,
      storyId: storyId,
      groupByStoryId: groupByStoryId,
      senderId: user.id,
      groupBySender: groupBySender,
    },
    skip: userLoading,
  });

  useMemo(() => {
    if (data && data.storyJournalAggregation) {
      setFixedData(
        data.storyJournalAggregation.data.map((x) => x.count).join(",")
      );
      setTotalData(data.storyJournalAggregation.totalCount);
    }
  }, [data]);

  return (
    <div className={"card " + bgColorClass + " pt-2 b0"}>
      <div className="px-2">
        <div className="h2 mt0">{totalData}</div>
        <div className="text-uppercase">{title}</div>
      </div>
      {loading && (
        <Sparkline
          options={{
            type: "line",
            width: "100%",
            height: "75px",
            lineColor: color,
            chartRangeMin: "0",
            fillColor: color,
            spotColor: color,
            minSpotColor: color,
            maxSpotColor: color,
            highlightSpotColor: color,
            highlightLineColor: color,
            resize: true,
          }}
          values="0,0,0,0,0,0"
          style={{ marginBottom: "-2px" }}
        />
      )}
      {!loading && (
        <Sparkline
          options={{
            type: "line",
            width: "100%",
            height: "75px",
            lineColor: color,
            chartRangeMin: "0",
            fillColor: color,
            spotColor: color,
            minSpotColor: color,
            maxSpotColor: color,
            highlightSpotColor: color,
            highlightLineColor: color,
            resize: true,
          }}
          values={fixedData}
          style={{ marginBottom: "-2px" }}
        />
      )}
    </div>
  );
};


export default StoryJournalGraph;
