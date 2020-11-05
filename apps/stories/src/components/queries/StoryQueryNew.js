import gql from 'graphql-tag'

export const STORYQUERYSTRING = gql`
         query($storyId: ID!) {
           v3_Customer_Story(id: $storyId) {
             id
             name
             priority
             customerId
             rulesOfEngagementId
             accountSelectorId
             contactSelectorId
             requiredDataPoints
             optionalDataPoints
             sendingWindowDayStart
             sendingWindowDayEnd
             sendingWindowHourStart
             sendingWindowHourEnd
             messages {
               id
               name
               position
               plotPoints {
                 id
                 name
                 position
                 defaultElement {
                   id
                   weight
                   text
                   triggerType
                   senderId
                   triggerDataPoints {
                     id
                     value
                     dataPointType
                   }
                 }
                 additionalElements {
                   id
                   weight
                   text
                   triggerType
                   senderId
                   triggerDataPoints {
                     id
                     value
                     dataPointType
                   }
                 }
               }
               _plotPointsMeta {
                 count
               }
             }
             matchingAccountsCount
             eligibleAccountsCount
             matchingContactsCount
             _storyContactsMeta {
               count
             }
           }
         }
       `;
