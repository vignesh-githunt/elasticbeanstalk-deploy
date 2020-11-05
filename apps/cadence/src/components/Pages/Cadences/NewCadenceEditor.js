import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  CardHeader,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import {
  CREATE_CADENCE,
  UPDATE_CADENCE,
} from "../../queries/CadenceQuery";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useLazyQuery } from "@apollo/react-hooks";
import CloseButton from "../../Common/CloseButton";
import "react-toastify/dist/ReactToastify.css";
import ClButton from "../../Common/Button";
import { ToastContainer, toast } from "react-toastify";
toast.configure()

const NewCadenceEditor = ({ cadenceData, cadenceID, history,currentURL }) => {
  
  cadenceData =
    cadenceData == undefined
      ? {}
      : {
          name: cadenceData.cadence.data[0].name,
          description: cadenceData.cadence.data[0].description,
          sharedType: cadenceData.cadence.data[0].sharedType,
        };
    
  
  const { handleSubmit, register, setValue, reset, errors } = useForm({
    defaultValues: {
      name: cadenceData.name,
      description: cadenceData.description,
      sharedType: cadenceData.sharedType,
    },
  });

  const [createCadence, { loading: createLoading }] = useLazyQuery(
    CREATE_CADENCE,
    {
      onCompleted: (response) =>
        handleAddCadenceRequestCallback(response, true),
      onError: (response) => handleAddCadenceRequestCallback(response),
    }
  );
  const [updateCadence, { loading: updateLoading }] = useLazyQuery(
    UPDATE_CADENCE,
    {
      onCompleted: (response) =>
        handleUpdateCadenceRequestCallback(response, true),
      onError: (response) => handleUpdateCadenceRequestCallback(response),
    }
  );

  const handleAddCadenceRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      notify("Cadence Created Successfully", "success");
      currentURL? window.location=currentURL:history.push("/cadences")
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  };

  const handleUpdateCadenceRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      notify("Cadence Updated Successfully");
      history.push("/cadences");
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  };

  const notify = (message, ToasterType) => {
    toast(message, {
      type: ToasterType,
      position: "bottom-right",
    });
  };

  const onSubmit = (data, e) => {
    const { name, description, sharedType } = data;
    if (cadenceID != undefined) {
      updateCadence({
        variables: {
          id: cadenceID,
          name: name,
          description: description,
          sharedType: sharedType,
        },
      });
      e.target.reset();
    } else {
      createCadence({
        variables: {
          name: name,
          description: description,
          sharedType: sharedType,
        },
      });
      e.target.reset();
    }
  };

  return (
    <>
      <Card className="card-default">
        <Form name="formCadence" onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>General Info</CardTitle>
          </CardHeader>
          <CardBody>
            <Container className="container-md">
              <ToastContainer />
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  invalid={errors.name}
                  placeholder="Enter Cadence Name"
                  innerRef={register({ required: "Name is required" })}
                />
                <ErrorMessage
                  errors={errors}
                  name="name"
                  className="invalid-feedback"
                  as="p"
                ></ErrorMessage>
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  invalid={errors.description}
                  placeholder="Enter Cadence Description"
                  innerRef={register({ required: "Description is required" })}
                />
                <ErrorMessage
                  errors={errors}
                  name="description"
                  className="invalid-feedback"
                  as="p"
                ></ErrorMessage>
              </FormGroup>

              <FormGroup>
                <Label className="col-md-2 col-form-label">Share with</Label>
                <div className="col-md-10">
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="sharedType"
                        defaultValue="none"
                        defaultChecked
                        innerRef={register({ required: true })}
                      />{" "}
                      Private
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="sharedType"
                        defaultValue="allUsers"
                        innerRef={register({ required: true })}
                      />
                      Public
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="sharedType"
                        defaultValue="specificgroup"
                        innerRef={register({ required: true })}
                      />
                      Specific Group of Users
                    </Label>
                  </FormGroup>
                </div>
              </FormGroup>
            </Container>
          </CardBody>
          <CardFooter>
            <div className="d-flex align-items-center">
              <div className="ml-auto ">
                <CloseButton
                  btnTxt="Cancel"
                  className="mr-2"
                  onClick={() =>currentURL? window.location=currentURL:history.push("/cadences")}
                />
                <ClButton
                  type="submit"
                  color="primary"
                  icon="fa fa-check mr-2"
                  loading={createLoading || updateLoading}
                >
                  {cadenceID ? <span>Update</span> : <span>Save</span>}
                </ClButton>
              </div>
            </div>
          </CardFooter>
        </Form>
      </Card>
    </>
  );
};

export default NewCadenceEditor;