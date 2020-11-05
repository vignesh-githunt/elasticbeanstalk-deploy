import React from 'react';
import { Button } from '@koncert/shared-components';
import EmailMessages from './EmailMessages';
import { useQuery } from '@apollo/react-hooks';
import { USER_STORY_CONTACT_MESSAGES_QUERY } from './queries/UserStoryContactsQuery';

export const ExpandedRow = ({ row, refreshStoryContact, refreshLoading }) => {
  const { data, loading, error } = useQuery(USER_STORY_CONTACT_MESSAGES_QUERY, {
    variables: { id: row.original.id },
    skip: refreshLoading,
  });

  if (loading || refreshLoading)
    return <i className="fa fa-spin fa-spinner"></i>;

  if (error) return <i className="fa fa-exclamation-triangle text-danger"></i>;

  const storyContact = data.v3_Customer_StoryContact || {};

  return (
    <>
      {refreshLoading && <i className="fa fa-spin fa-spinner"></i>}
      {!refreshLoading && (
        <Button
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            refreshStoryContact(row.original.id);
            return false;
          }}
        >
          <i className="fa fa-refresh"></i> Refresh Contact
        </Button>
      )}
      <EmailMessages row={row} elements={storyContact.elements} />
    </>
  );
};
