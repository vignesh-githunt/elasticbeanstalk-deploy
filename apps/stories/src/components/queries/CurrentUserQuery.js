import gql from "graphql-tag";

export const CURRENT_USER_QUERY = gql`
         query me {
           me {
             id
             firstName
             lastName
             email
             title
             rolesMask
             roles
             workflowRoles
             companyId
             company {
               id
               name
               senderDailySendingLimit
             }
             dailySendingLimit
             onlineTime
             imageUrl
             sfdcIdentity
             outreachIdentity
             salesloftIdentity
             connectleaderIdentity
             mixmaxIdentity
           }
         }
       `;
