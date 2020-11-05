import gql from "graphql-tag";

const SENDERS_QUERY = gql`
  query senders($customerId: ID!, $limit: Int = 100, $skip: Int = 0) {
    users(
      where: { companyId: $customerId, rolesMask_lte: 4 }
      limit: $limit
      skip: $skip
    ) {
      id
      firstName
      lastName
      fullName
      userType
      rolesMask
      roles
      email
      companyId
      confirmedAt
      sfdcIdentity
      outreachIdentity
      salesloftIdentity
      connectleaderIdentity
      mixmaxIdentity
      liFetchQuota
      dailySendingLimit
    }
  }
`;

export const SENDERS_LIST_QUERY = gql`
         query sendersList($customerId: ID!, $limit: Int = 100, $skip: Int = 0) {
           users(
             where: { companyId: $customerId, rolesMask_lte: 4, userType: 1 }
             limit: $limit
             skip: $skip
           ) {
             id
             firstName
             lastName
             fullName
             userType
           }
         }
       `;

export default SENDERS_QUERY;
