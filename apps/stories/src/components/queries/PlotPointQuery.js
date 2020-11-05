import gql from 'graphql-tag';
export const PLOTPOINT_QUERY = gql`
  query v3_Customer_StoryComponents_PlotPoint($id: ID!) {
    v3_Customer_StoryComponents_PlotPoint(where: { id: $id }) {
      id
      name
      position
    }
  }
`;
