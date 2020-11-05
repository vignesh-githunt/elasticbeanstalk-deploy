import gql from "graphql-tag";

const CREATE_PLOTPOINT = gql`
  mutation CreatePlotPoint(
    $storyId: String!
    $messageId: String!
    $name: String!
    $position: Int
  ) {
    createV3_Customer_StoryComponents_PlotPoint(
      data: {
        name: $name
        storyId: $storyId
        messageId: $messageId
        position: $position
      }
    ) {
      id
    }
  }
`;

export default CREATE_PLOTPOINT;