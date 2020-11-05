import gql from "graphql-tag";

const DELETE_PLOTPOINT = gql`
  mutation DeletePlotPoint($id: ID!) {
    deleteV3_Customer_StoryComponents_PlotPoint(id: $id) {
      id
    }
  }
`;

export default DELETE_PLOTPOINT;