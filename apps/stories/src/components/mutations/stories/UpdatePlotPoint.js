import gql from "graphql-tag";

const UPDATE_PLOTPOINT = gql`
  mutation UpdatePlotPoint($id: ID!, $name: String!, $position: Int!) {
    updateV3_Customer_StoryComponents_PlotPoint(
      id: $id
      data: { 
        name: $name
        position: $position
        
      }
    ) {
      id
    }
  }
`;

export default UPDATE_PLOTPOINT;