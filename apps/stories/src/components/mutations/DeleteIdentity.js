import gql from "graphql-tag";

const DELETE_IDENTITY_MUTATION = gql`
  mutation removeIdentity($identityId: ID!) {
    removeIdentity(identityId: $identityId)
  }
`;

export default DELETE_IDENTITY_MUTATION;