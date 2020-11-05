import gql from "graphql-tag";

export const UPDATE_STATIC_ELEMENT = gql`
         mutation UpdateStaticElement(
           $id: ID!
           $plotPointAsDefaultId: String
           $plotPointAsAdditionalId: String
           $weight: Int!
           $text: String!
           $senderId: String
         ) {
           updateV3_Customer_StoryComponents_Elements_Static(
             id: $id
             data: {
               plotPointAsDefaultId: $plotPointAsDefaultId
               plotPointAsAdditionalId: $plotPointAsAdditionalId
               weight: $weight
               text: $text
               senderId: $senderId
             }
           ) {
             id
           }
         }
       `;

export const UPDATE_TYPETRIGGERED_ELEMENT = gql`
         mutation UpdateTypeTriggeredElement(
           $id: ID!
           $plotPointAsDefaultId: String
           $plotPointAsAdditionalId: String
           $weight: Int!
           $dataPoints: [V3_Data_DataPointInput]
           $text: String!
           $senderId: String
         ) {
           updateV3_Customer_StoryComponents_Elements_TypeTriggered(
             id: $id
             data: {
               plotPointAsDefaultId: $plotPointAsDefaultId
               plotPointAsAdditionalId: $plotPointAsAdditionalId
               weight: $weight
               triggerDataPoints: $dataPoints
               text: $text
               senderId: $senderId
             }
           ) {
             id
           }
         }
       `;

export const UPDATE_VALUETRIGGERED_ELEMENT = gql`
  mutation UpdateValueTriggeredElement(
    $id: ID!
    $plotPointAsDefaultId: String
    $plotPointAsAdditionalId: String
    $weight: Int!
    $dataPoints: [V3_Data_DataPointInput]
    $text: String!
    $senderId: String
  ) {
    updateV3_Customer_StoryComponents_Elements_ValueTriggered(
      id: $id
      data: {
        plotPointAsDefaultId: $plotPointAsDefaultId
        plotPointAsAdditionalId: $plotPointAsAdditionalId
        weight: $weight
        triggerDataPoints: $dataPoints
        text: $text
        senderId: $senderId
      }
    ) {
      id
    }
  }
`;
