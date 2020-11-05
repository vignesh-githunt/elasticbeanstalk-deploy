import gql from "graphql-tag";

export const CREATE_STATIC_ELEMENT = gql`
         mutation CreateStaticElement(
           $plotPointAsDefaultId: String
           $plotPointAsAdditionalId: String
           $customerId: String!
           $weight: Int!
           $text: String!
           $senderId: String
         ) {
           createV3_Customer_StoryComponents_Elements_Static(
             data: {
               plotPointAsDefaultId: $plotPointAsDefaultId
               plotPointAsAdditionalId: $plotPointAsAdditionalId
               weight: $weight
               customerId: $customerId
               text: $text
               senderId: $senderId
             }
           ) {
             id
           }
         }
       `;

export const CREATE_TYPETRIGGERED_ELEMENT = gql`
         mutation CreateTypeTriggeredElement(
           $plotPointAsDefaultId: String
           $plotPointAsAdditionalId: String
           $customerId: String!
           $weight: Int!
           $dataPoints: [V3_Data_DataPointInput]
           $text: String!
           $senderId: String
         ) {
           createV3_Customer_StoryComponents_Elements_TypeTriggered(
             data: {
               plotPointAsDefaultId: $plotPointAsDefaultId
               plotPointAsAdditionalId: $plotPointAsAdditionalId
               weight: $weight
               triggerDataPoints: $dataPoints
               customerId: $customerId
               text: $text
               senderId: $senderId
             }
           ) {
             id
           }
         }
       `;

export const CREATE_VALUETRIGGERED_ELEMENT = gql`
         mutation CreateValueTriggeredElement(
           $plotPointAsDefaultId: String
           $plotPointAsAdditionalId: String
           $customerId: String!
           $weight: Int!
           $dataPoints: [V3_Data_DataPointInput]
           $text: String!
           $senderId: String
         ) {
           createV3_Customer_StoryComponents_Elements_ValueTriggered(
             data: {
               plotPointAsDefaultId: $plotPointAsDefaultId
               plotPointAsAdditionalId: $plotPointAsAdditionalId
               weight: $weight
               triggerDataPoints: $dataPoints
               customerId: $customerId
               text: $text
               senderId: $senderId
             }
           ) {
             id
           }
         }
       `;