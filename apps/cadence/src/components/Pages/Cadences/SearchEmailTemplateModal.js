import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
  Spinner,
} from "reactstrap";
import { useQuery } from "@apollo/react-hooks";
import { parseUrl } from "query-string";
import { useForm } from "react-hook-form";
import CloseButton from "../../Common/CloseButton";
import ClButton from "../../Common/Button";
import FETCH_EMAIL_TEMPLATES_QUERY from "../../queries/EmailTemplatesQuery";

import {
  FETCH_TAG_LIST_QUERY,
  FETCH_TAG_QUERY,
  FETCH_CATEGORIES_LIST_QUERY,
  FETCH_EMAIL_TEMPLATES_LIST_QUERY,
} from "../../queries/TagQuery";
import SearchEmailTemplateGrid from "./SearchEmailTemplateGrid";
const SearchEmailTemplateModal = ({
  showModal,
  hideModal,
  handleAction,
  currentUserId,
  Loading,
}) => {
  const { handleSubmit, register } = useForm();
  const { query: queryParams } = parseUrl("?page[limit]=10&page[offset]=0");
  const [emailTemplateFilter, seTemailTemplateFilter] = useState(
    `?page[limit]=10&page[offset]=0`
  );

  const [selectedRows, setSelectedRows] = useState([]);

  const [shouldExecute, executeQuery] = useState(false);
  const [limit, setLimit] = useState(
    queryParams["page[limit]"] ? parseInt(queryParams["page[limit]"]) : 10
  );
  const [offset, setOffset] = useState(
    queryParams["page[offset]"] ? parseInt(queryParams["page[offset]"]) : 0
  );

  const dropdownFilterParams = Object.entries({
    ...queryParams,
    "filter[user][id]": currentUserId,
  })
    .filter(([key]) => key.startsWith("filter"))
    .map(([key, val]) => `${key}=${val}`)
    .join("&");

  const [currentPageIndex, setCurrentPageIndex] = useState(
    queryParams["page[offset]"] ? parseInt(queryParams["page[offset]"]) : 0
  );
  const [pageCount, setPageCount] = useState(0);
  const [selectedId, setSelectedId] = useState(0);
  const [form, setForm] = useState({});
  const [filterQuery, setFilterQuery] = useState({
    query: FETCH_TAG_LIST_QUERY,
    filterBy: "Tag",
  });

  const { filterBy } = filterQuery;
  const onSubmit = () => {
    handleAction(selectedRows);
  };

  const handleModalClose = () => {
    setForm();
  };

  const setQuery = (filterType, id) => {
    switch (filterType) {
      case "Tag":
        setFilterQuery({ query: FETCH_TAG_LIST_QUERY, filterBy: "Tag" });
        return;
      case "Category":
        setFilterQuery({
          query: FETCH_CATEGORIES_LIST_QUERY,
          filterBy: "Category",
        });
        return;
      case "TemplateName":
        setFilterQuery({
          query: FETCH_EMAIL_TEMPLATES_QUERY,
          filterBy: "TemplateName",
        });
        return;
    }
  };

  const {
    data: searchByData,
    loading,
    error,
    refetch: refreshOutcomesGrid,
  } = useQuery(filterQuery.query, {
    variables: {
      includeAssociationsQry:
        filterBy == "Tag"
          ? "includeAssociationsQry[]=emailTemplate"
          : "includeAssociationsQry[]=user",
      filter: `&${dropdownFilterParams}`,
      limit,
      offset,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });

  const handlesearchByChange = (e) => {
    const filterType = e.currentTarget.value;
    setQuery(filterType);
  };

  const handleOnChange = (e) => {
    const select = e.currentTarget;
    const value = select.value;
    const desc = select.selectedOptions[0].text;
    setSelectedId(value);
    if (filterBy == "Tag") {
      const tag = searchByData.allTags.data.filter((tag) => tag.id == value);
      const ids = tag[0].associations.emailTemplate.map(
        (template) => template.id
      );
      updateTemplateGrid(ids);
    }
    if (filterBy == "TemplateName") {
      updateTemplateGrid(value);
    }
    if (filterBy == "Category") {
      updateTemplateGrid(value);
    }
    setQuery(filterBy, value);
  };

  const updateTemplateGrid = (ids) => {
    if (filterBy != "Category") {
      queryParams["filter[id]"] = encodeURIComponent(":[" + ids + "]");
    } else {
      queryParams["filter[category]"] = encodeURIComponent(":[" + ids + "]");
    }
    let filterQry = Object.entries({
      ...queryParams,
    })
      .filter(([key]) => key.startsWith("filter"))
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    seTemailTemplateFilter(filterQry === "" ? "" : "&" + filterQry);
    executeQuery(true);
  };

  const {
    data: templateData,
    loading: templateLoading,
    error: templateError,
    refetch: refresTemplateGrid,
  } = useQuery(FETCH_EMAIL_TEMPLATES_LIST_QUERY, {
    variables: {
      limit,
      offset,
      filter: emailTemplateFilter,
    },
    skip: !shouldExecute,
  });

  const gridData = useMemo(
    () =>
      templateData && templateData.templates ? templateData.templates.data : [],
    [templateData]
  );
  useEffect(
    () =>
      setPageCount(
        !loading && templateData && templateData.templates && templateData.templates.paging
          ? Math.ceil(templateData.templates.paging.totalCount / limit)
          : 0
      ),
    [gridData]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Template Name",
        accessor: "name",
        width: "28%",
        Cell: function (props) {
          return (
            <Row className="float-left">
              <Col className="text-center">{props.value}</Col>
            </Row>
          );
        },
      },
      {
        Header: "Tag",
        accessor: "tag",
        width: "28%",
        Cell: function (props) {
          return (
            <Row className="float-left">
              <Col className="text-center">{props.value}</Col>
            </Row>
          );
        },
      },
      {
        Header: "Category",
        accessor: "category",
        width: "28%",
        Cell: function (props) {
          return (
            <Row className="float-left">
              <Col className="text-center">{props.value}</Col>
            </Row>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <Modal size="lg" isOpen={showModal} onClosed={handleModalClose} centered>
        <Form name="addTextTouch" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Search Email Templates</ModalHeader>
          <ModalBody>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>Search By </Label>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input
                    type="select"
                    name="searchby"
                    id="list_searchby"
                    data-tab-value="searchby"
                    innerRef={register(true)}
                    onChange={handlesearchByChange}
                  >
                    <option value="Tag">Tag</option>
                    <option value="Category">Category</option>
                    <option value="TemplateName">Template Name</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                {!loading && (
                  <FormGroup>
                    <Input
                      type="select"
                      name="filterdBy"
                      innerRef={register(true)}
                      id="list_filterdby"
                      defaultValue={selectedId}
                      onChange={handleOnChange}
                    >
                      {filterBy == "Tag" &&
                        searchByData.allTags.data.map((item, i) => {
                          return (
                            <option value={item.id} key={i}>
                              {filterBy == "Tag" ? item.name : item.name}
                            </option>
                          );
                        })}
                      {filterBy == "TemplateName" &&
                        searchByData.templates.data.map((item, i) => {
                          return (
                            <option value={item.id} key={i}>
                              {item.name}
                            </option>
                          );
                        })}
                      {filterBy == "Category" &&
                        searchByData.categories.data.map((item, i) => {
                          return (
                            <option value={item.id} key={i}>
                              {item.lookupValue}
                            </option>
                          );
                        })}
                    </Input>
                  </FormGroup>
                )}
                {loading && (
                  <Button>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </Button>
                )}
              </Col>
            </Row>

            <Row form>
              <Col md={12}>
                <Card>
                  <SearchEmailTemplateGrid
                    columns={columns}
                    data={gridData}
                    templateData={templateData}
                    fetchData={({ pageIndex, pageSize }) => {
                      setOffset(pageIndex);
                      setCurrentPageIndex(pageIndex);
                      setLimit(pageSize);
                      const { query } = parseUrl(
                        "?page[limit]=10&page[offset]=0"
                      );
                      query["page[limit]"] = pageSize;
                      query["page[offset]"] = pageIndex;
                      let searchString = Object.entries(query)
                        .map(([key, val]) => `${key}=${val}`)
                        .join("&");
                      window.history.replaceState({}, "", "?" + searchString);
                    }}
                    loading={templateLoading}
                    pageSize={limit}
                    pageCount={pageCount}
                    error={error}
                    register={register}
                    currentPageIndex={currentPageIndex}
                    setSelectedRows={setSelectedRows}
                  />
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <ClButton
              type="submit"
              color="primary"
              icon="fa fa-check mr-2"
              loading={Loading}
            >
              Select
            </ClButton>
            <CloseButton onClick={hideModal} />
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};
export default SearchEmailTemplateModal;