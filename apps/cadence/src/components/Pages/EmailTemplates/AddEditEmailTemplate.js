/**
 * @author @Sk_khaja_moulali-gembrill
 * @version V11.0
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Navbar,
  Row,
} from "reactstrap";
import { parseUrl } from "query-string";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { CkEditor } from "./CkEditor";
import { ContentWrapper, FormValidator } from "@nextaction/components";
import BackButton from "../../Common/Button";
import {
  FETCH_CATEGORIES_LIST_QUERY,
  FETCH_GROUP_USERS_LIST_QUERY,
  CREATE_EMAIL_TEMPLATE_QUERY,
} from "../../queries/EmailTemplatesQuery";

function AddOrEditEmailTemplate({ tags }) {
  const { query: searchParams } = parseUrl(window.location.search);

  const [limit, setLimit] = useState(
    searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10
  );
  const [offset, setOffset] = useState(
    searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0
  );

  const [hovered, setHovered] = useState(false);
  const [description, setDescription] = useState("");

  const formRef = React.useRef();
  const tagRef = React.useRef();

  const [form, setForm] = useState({});

  // Fetch Categories data from api-server
  let {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery(FETCH_CATEGORIES_LIST_QUERY, {
    variables: { limit, offset },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });

  // Fetch group of users data from api-server
  let { data: usersData, loading: usersLoading, error: usersError } = useQuery(
    FETCH_GROUP_USERS_LIST_QUERY,
    {
      variables: { limit, offset },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-first",
    }
  );

  // Add prospect to cadence request
  const [addTemplate, { loading: addTemplateLoading }] = useLazyQuery(
    CREATE_EMAIL_TEMPLATE_QUERY,
    {
      onCompleted: (response) =>
        handleAddTemplateRequestCallback(response, true),
      onError: (response) => handleAddTemplateRequestCallback(response),
    }
  );

  const onMouseEnter = (e) => {
    setHovered(true);
  };

  const onMouseLeave = (e) => {
    setHovered(false);
  };

  const editorHandleChange = (event, editor) => {
    const description = event.editor.getData();
    setDescription(description);
    console.log({ event, editor, description });
  };

  const handleAddTemplateRequestCallback = (response, requestSuccess) => {
    setForm({});
    if (requestSuccess) {
      return <Alert color="success">Template Data Added Successfully !</Alert>;
    } else {
      // to handle error resonse here
    }
  };

  const handleAction = (input) => {
    addTemplate({
      variables: {
        input,
      },
    });
  };

  const hasError = (inputName, method) => {
    return (
      form &&
      form.errors &&
      form.errors[inputName] &&
      form.errors[inputName][method]
    );
  };

  const handleSaveTemplate = (e) => {
    const form = formRef.current;
    const formName = form.name;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT", "SELECT"].includes(i.nodeName)
    );

    const { errors, hasError } = FormValidator.bulkValidate(inputs);

    setForm({ ...form, formName, errors });

    if (!hasError) {
      var templateData = [...form.elements].reduce((acc, item) => {
        if (item.value.trim() != "") {
          acc[item.name] = item.value;
        }

        return acc;
      }, {});

      templateData = { ...templateData, description };
      handleAction(templateData);
    }
  };

  return (
    <ContentWrapper>
      <Row>
        <Col>
          <div className="content-heading">
            <div>
              <i className="fas fa-envelope fa-sm mr-2"></i> Edit/New
            </div>
            <div className="ml-auto">
              <BackButton color="primary" icon="fa fa-check">
                Save
              </BackButton>
              <BackButton color="success" icon="fa fa-paper-plane">
                Send Test Email
              </BackButton>
              <BackButton color="primary" icon="fas fa-envelope" />
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <CardBody>
            <div className="card-tool">
              <ButtonGroup>
                <Button value="Email Template">Email Templates</Button>
                <Button value="Snippets">Snippets</Button>
              </ButtonGroup>
            </div>
            <br />
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbItem>
                  <Link
                    to="/templates"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                  >
                    Email Templates
                  </Link>
                </BreadcrumbItem>
              </BreadcrumbItem>
              <BreadcrumbItem active tag="span">
                Add a Template
              </BreadcrumbItem>
            </Breadcrumb>
            <Form name="addEmailTemplate" innerRef={formRef}>
              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label for="add_email_template_name">
                      Name<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      id="add_email_template_name"
                      data-validate='["required"]'
                      invalid={
                        hasError("name", "required") || hasError("name", "text")
                      }
                    />
                    <div className="invalid-feedback">
                      Last Name is required
                    </div>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="add_email_template_tag">Tag(s)</Label>
                    <Input
                      type="select"
                      name="tag"
                      id="add_email_template_tag"
                      innerRef={tagRef}
                    >
                      <option></option>
                      {tags.data &&
                        tags.data.map((tag, i) => {
                          return (
                            tag.tagValue && (
                              <option key={tag.id}>{tag.tagValue}</option>
                            )
                          );
                        })}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="add_email_template_sharedType">
                      Share With
                    </Label>
                    <Input
                      type="select"
                      name="sharedType"
                      id="add_email_template_sharedType"
                    >
                      <option></option>
                      <option value={"public"}>Public</option>
                      <option value={"private"}>Private</option>
                      <option value={"specific group"}>
                        Only Specific Groups
                      </option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label for="add_email_template_subject">Subject</Label>
                    <Input
                      type="text"
                      name="subject"
                      id="add_email_template_subject"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="add_email_template_categoryId">Category</Label>
                    <Input
                      type="select"
                      name="categoryId"
                      id="add_email_template_categoryId"
                    >
                      <option></option>
                      {categoriesData &&
                        categoriesData.categories &&
                        categoriesData.categories.data.map((category, i) => {
                          return (
                            category.lookupValue && (
                              <option key={category.id}>
                                {category.lookupValue}
                              </option>
                            )
                          );
                        })}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="add_email_template_sharedGroups">Groups</Label>
                    <Input type="select" name="sharedGroups" id="shared_groups">
                      <option></option>
                      {usersData &&
                        usersData.users &&
                        usersData.users.data.map((user, i) => {
                          return (
                            user.displayName && (
                              <option key={user.id}>{user.displayName}</option>
                            )
                          );
                        })}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <CkEditor
                    name="description"
                    id="description"
                    data={description}
                    onChange={editorHandleChange}
                  />
                </Col>
              </Row>
            </Form>
            <br />
            <Navbar color="light" light expand="md">
              <div className="ml-auto">
                <BackButton
                  color="secondary"
                  icon="fa fa-envelope-open"
                  className="mr-2"
                >
                  Insert Snippet
                </BackButton>
                <Button
                  color="primary"
                  onClick={handleSaveTemplate}
                  disabled={addTemplateLoading}
                >
                  <i
                    className={
                      (addTemplateLoading
                        ? "fas fa-spinner fa-spin"
                        : "fa fa-plus") + " mr-2"
                    }
                  ></i>
                  {addTemplateLoading ? "Wait..." : "Save"}
                </Button>
              </div>
            </Navbar>
          </CardBody>
        </Col>
      </Row>
    </ContentWrapper>
  );
}
// This is required for redux
const mapStateToProps = (state) => ({
  tags: state.tags,
});

// This is required for redux
export default connect(mapStateToProps)(AddOrEditEmailTemplate);
