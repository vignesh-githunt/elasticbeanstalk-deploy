/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { parseUrl } from "query-string";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardHeader } from 'reactstrap';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import FETCH_TAG_QUERY, {
  CREATE_TAG_QUERY,
  DELETE_TAG_QUERY,
  UPDATE_TAG_QUERY
} from '../../queries/SettingsQuery';
import UserContext from "../../UserContext";
import ConfirmModal from "../../Common/ConfirmModal";
import AddTagModal from './AddTagModal';
import TagGrid from './TagGrid';

const Tags = ({ match }) => {

  const { query: searchParams } = parseUrl(window.location.search);
  const [modalTitle, setModalTitle] = useState();
  const [pageCount, setPageCount] = useState(0);
  const { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const [tagFilter, setTagFilter] = useState(`&filter[user][id]=${currentUserId}`);
  const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
  const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
  const { data: tagData, loading, error, refetch: refetchTagData } = useQuery(FETCH_TAG_QUERY, { 
    variables: { tagFilter, limit, offset },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first"
  });
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [tag, setTag] = useState();


  const toastStyles = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  const successNotify = () => toast.success("Saved Successfully!", toastStyles)
  const errorNotify = () => toast.error("Failed to save.Try after sometime else contact ConnectLeader support", toastStyles)

  const deleteNotify = () => toast.success("Deleted Successfully!", toastStyles)
  const errorDeleteNotify = () => toast.error("Failed to delete.Try after sometime else contact ConnectLeader support", toastStyles)

  const [tagDelete, { loading: deleteLoading }] = useLazyQuery(DELETE_TAG_QUERY, {
    onCompleted: (response) => handleDeleteTagRequestCallback(response, true),
    onError: (response) => handleDeleteTagRequestCallback(response),
  });

  const [addTag, { loading: addTagLoading }] = useLazyQuery(CREATE_TAG_QUERY, {
    onCompleted: (response) => handleTagRequestCallback(response, true),
    onError: (response) => handleTagRequestCallback(response)
  });

  const [updateTagValue, { loading: updateTagLoading }] = useLazyQuery(UPDATE_TAG_QUERY, {
    onCompleted: (response) => handleTagRequestCallback(response, true),
    onError: (response) => handleTagRequestCallback(response)
  });

  const deleteTag = (tag) => {
    setTag(tag);
    setShowDeleteConfirmModal(true);
  }
  const updateTag = (tag) => {
    setTag(tag);
    setModalTitle('Update Tag');
    setShowAddTagModal(true);
  }

  const handleDeleteTagRequestCallback = (response, requestSuccess) => {

    if (requestSuccess) {
      deleteNotify();
      setShowDeleteConfirmModal(false);
      refetchTagData();
    } else {
      setShowDeleteConfirmModal(false);
      errorDeleteNotify();
    }
  }
  const handleTagRequestCallback = (response, requestSuccess) => {

    if (requestSuccess) {
      successNotify();
      setShowAddTagModal(false);
      refetchTagData();
    } else {
      setShowAddTagModal(false);
      errorNotify();
    }
  }

  const columns = [
    {
      Header: "Tag",
      accessor: "name",
      width: "60%"
    },
    {
      Header: "Count",
      accessor: "tagAssignCount",
      width: "20%"
    }
  ];

  const tagGridData = useMemo(() => (tagData && tagData.allTags ? tagData.allTags.data : []), [tagData]);
  useEffect(() => setPageCount(!loading && tagData.allTags.paging ? Math.ceil(tagData.allTags.paging.totalCount / limit) : 0), [tagData]);

  return (
    <Card className="b">
      <ToastContainer
        position="top-right" />
      <CardHeader className="text-bold border-bottom">
        List of Tags
          <div className="card-tool float-right" onClick={() => {
          setModalTitle('Add Tag')
          setShowAddTagModal(true)
          setTag(undefined)
        }}
        >
          <i className="fas fa-plus text-primary pointer" title="Add Tag"></i>
        </div>
      </CardHeader>
      <TagGrid
        columns={columns}
        data={tagGridData}
        tagData={tagData}
        fetchData={({ pageIndex, pageSize }) => {
          setOffset(pageIndex);
          setCurrentPageIndex(pageIndex);
          setLimit(pageSize);
          if (!currentUrlStatePushed) {
            window.history.replaceState({}, '', window.location.href);
            setCurrentUrlStatePushed(true);
          }
          if (match.params.tab === 'tag') {
            const { query } = parseUrl(window.location.search);
            query["page[limit]"] = pageSize;
            query["page[offset]"] = pageIndex;
            let searchString = Object.entries(query).map(([key, val]) => `${key}=${val}`).join("&");
            window.history.replaceState({}, '', "?" + searchString);
          }
        }}
        loading={loading}
        error={error}
        pageSize={limit}
        pageCount={pageCount}
        currentPageIndex={currentPageIndex}
        deleteTag={deleteTag}
        updateTag={updateTag}
        handleRefresh={refetchTagData}
      />
      <AddTagModal
        hideModal={() => { setShowAddTagModal(false) }}
        showModal={showAddTagModal}
        title={modalTitle}
        data={tag}
        showActionBtnSpinner={addTagLoading || updateTagLoading}
        handleAction={(tagName, id) => {
          const input = { names: [tagName] }
          if (id === 0) {
            addTag({
              variables: { input }
            })
          } else {
            updateTagValue({
              variables: {
                id: id,
                name: tagName
              }
            })
          }
        }}
      />
      <ConfirmModal
        confirmBtnIcon="fas fa-trash"
        confirmBtnText="Delete"
        handleCancel={() => setShowDeleteConfirmModal(false)}
        showConfirmModal={showDeleteConfirmModal}
        handleConfirm={() => tagDelete({ variables: { tagId: tag.original.id } })}
        showConfirmBtnSpinner={deleteLoading}
      >
        <span>Are you sure you want to delete Tag</span>
      </ConfirmModal>
      < ToastContainer toastStyles />
    </Card>
  );
}
export default Tags;