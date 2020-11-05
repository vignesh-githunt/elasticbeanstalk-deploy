import React from 'react';
import ElementEditor from './ElementEditor';
import { useQuery } from '@apollo/react-hooks';
import { ELEMENT_QUERY } from '../queries/ElementsQueries';
import { PLOTPOINT_QUERY } from '../queries/PlotPointQuery';

const RoutedElementEditor = ({
  onModified,
  customerId,
  user,
  userLoading,
  story,
  match,
  history,
}) => {
  const { elementId, plotPointId } = match.params;
  const { data, loading, error } = useQuery(ELEMENT_QUERY, {
    variables: { id: elementId },
    skip: userLoading,
  });

  const {
    data: plotPointData,
    loading: plotPointLoading,
    error: plotPointError,
  } = useQuery(PLOTPOINT_QUERY, {
    variables: { id: plotPointId },
    skip: userLoading,
  });

  if (userLoading || loading || plotPointLoading)
    return <i className="fa fa-spin fa-spinner"></i>;

  if (error || plotPointError)
    return <i className="fa fa-exclamation-triangle text-danger"></i>;

  const element = data.v3_Customer_StoryComponents_Element || {};
  const plotPoint = plotPointData.v3_Customer_StoryComponents_PlotPoint || {};

  return (
    <ElementEditor
      onModified={onModified}
      customerId={customerId}
      user={user}
      userLoading={userLoading}
      story={story}
      plotPoint={plotPoint}
      element={element}
      isDefault={element.plotPointAsDefaultId === plotPointId}
      defaultOpen={true}
      history={history}
    />
  );
};

export default RoutedElementEditor;
