/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React, { useContext, useEffect, useState } from "react";
import base64 from "react-native-base64";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Progress } from "reactstrap";
import { ErrorMessage } from "@hookform/error-message";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";
import {
  CREATE_EMAIL_ACCOUNT_QUERY,
  CREATE_EMAIL_SIGNATURE_QUERY,
  FETCH_EMAIL_ACCOUNT_QUERY,
  FETCH_EMAIL_SIGNATURE_QUERY,
  UPDATE_EMAIL_ACCOUNT_QUERY,
} from "../../queries/SettingsQuery"
import Button from "../../Common/Button";
import UserContext from "../../UserContext";

const EmailSetting = () => {

  const [passwordType, setPasswordType] = useState(false);
  const { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const [userFilter, setUserFilter] = useState(`filter[user][id]=${currentUserId}`);
  const [signatureFilter, setsignatureFilter] = useState(`filter[user][id]=${currentUserId}`);
  const [toastPosition, setToastPosition] = useState("top-right");
  const [serverType, setServerType] = useState("");

  let verified = false;
  let accountId = 0;
  let emailSignature = "";
  let signatureId = 0;
  let emailAccount = {};
  let emailReset = {};

  const { data: emailAccountData, loading: accountLoading, error: accountError, refetch: refetchEmailAccountData } = useQuery(FETCH_EMAIL_ACCOUNT_QUERY, { variables: { emailFilter: userFilter } });
  const { data: emailSignatureData, loading: signatureLoading, refetch: refetchEmailSignatureData } = useQuery(FETCH_EMAIL_SIGNATURE_QUERY, { variables: { signatureFilter: signatureFilter } });

  if (emailAccountData && emailAccountData.Email && emailAccountData.Email.data[0]) {
    verified = emailAccountData.Email.data[0].verified;
    accountId = emailAccountData.Email.data[0].id;
  }

  const { handleSubmit, register, getValues, errors, reset } = useForm();

  useEffect(() => {
    if(emailAccountData && emailAccountData.Email && emailAccountData.Email.data[0]){
    emailAccount = {
        "serverType": emailAccountData.Email.data[0].serverType,
        "displayName": emailAccountData.Email.data[0].displayName,
        "userName": emailAccountData.Email.data[0].userName,
        "email": emailAccountData.Email.data[0].email,
        "mailPassword": emailAccountData.Email.data[0].mailPassword,
        "mailServerUrl": emailAccountData.Email.data[0].mailServerUrl,
      };
    reset(emailAccount)
  }
}, [emailAccountData]);

  if(emailAccountData && emailAccountData.Email && emailAccountData.Email.data[0]) {
    emailReset = {
      "serverType": emailAccountData.Email.data[0].serverType,
      "displayName": emailAccountData.Email.data[0].displayName,
      "userName": emailAccountData.Email.data[0].userName,
  };
}

  useEffect(() => setServerType(emailAccount.serverType), [emailAccountData])

  const onSubmit = () => {
    let data = getValues();
    if (accountId === 0) {
      if (serverType === "Gmail") {
        let input = {
          serverType: data.serverType,
          email: data.email,
          displayName: data.displayName,
        }
        addEmailAccount({
          variables: {
            input,
          },
        });
      } else if (serverType === "Office365") {
        let input = {
          serverType: data.serverType,
          email: data.email,
          userName: data.email,
          mailPassword: data.mailPassword,
        }
        addEmailAccount({
          variables: {
            input,
          },
        });
      }
      else if (serverType === "Exchange 2007" || serverType === "Exchange 2010" || serverType === "Exchange 2013" || serverType === "Exchange 2016") {
        let input = {
          serverType: data.serverType,
          email: data.email,
          userName: data.email,
          mailPassword: data.mailPassword,
          mailServerUrl: data.mailServerUrl,
        }
        addEmailAccount({
          variables: {
            input,
          },
        });
      }
    } else {
      if (serverType === "Gmail") {
        let input = {
          serverType: data.serverType,
          email: data.email,
          displayName: data.displayName,
        }
        editEmailAccount({
          variables: {
            input,
          },
        });
      } else if (serverType === "Office365") {
        let input = {
          serverType: data.serverType,
          email: data.email,
          userName: data.email,
          mailPassword: data.mailPassword,
        }
        editEmailAccount({
          variables: {
            input,
          },
        });
      } else if (serverType === "Exchange 2007" || serverType === "Exchange 2010" || serverType === "Exchange 2013" || serverType === "Exchange 2016") {
        let input = {
          serverType: data.serverType,
          email: data.email,
          userName: data.email,
          mailPassword: data.mailPassword,
          mailServerUrl: data.mailServerUrl,
        }
        editEmailAccount({
          variables: {
            input,
          },
        });
      }
    }
  }

  if (emailSignatureData !== undefined && emailSignatureData.Email.data.length > 0) {
    signatureId = emailSignatureData.Email.data[0].id
    emailSignature = emailSignatureData.Email.data[0].content
  }

  const [addEmailAccount, { loading: addAccountLoading }] = useLazyQuery(CREATE_EMAIL_ACCOUNT_QUERY, {
    onCompleted: (response) => addEmailCallBack(response, true),
    onError: (response) => addEmailCallBack(response)
  });

  const [editEmailAccount, { loading: editAccountLoading }] = useLazyQuery(UPDATE_EMAIL_ACCOUNT_QUERY, {
    variables: { id: accountId },
    onCompleted: (response) => addEmailCallBack(response, true),
    onError: (response) => addEmailCallBack(response)
  });

  const [addEmailSignature, { loading: addSignatureLoading }] = useLazyQuery(CREATE_EMAIL_SIGNATURE_QUERY, {
    onCompleted: (response) => addEmailSignatureCallBack(response, true),
    onError: (response) => addEmailSignatureCallBack(response)
  });

  const toastStyles = {
    position: toastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  const successNotify = () => toast.success("Saved Successfully!", toastStyles)
  const errorNotify = (message) =>toast.error(message, toastStyles)

  const addEmailCallBack = (response, status) => {
    if (status) {
      successNotify();
      refetchEmailAccountData();
    } else {
      errorNotify(response.graphQLErrors[0].message);
    }
  }
  const addEmailSignatureCallBack = (response, status) => {
    if (status) {
      successNotify();
      refetchEmailSignatureData();
    } else {
      errorNotify();
    }
  }

  const saveEmailSignature = (signatureContent) => {
    const content = base64.encode(signatureContent);
    addEmailSignature({
      variables: {
        content: content
      }
    });
  }

  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }
    upload() {
      return this.loader.file
        .then(file => new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        }));
    }

    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }

    _initRequest() {
      const xhr = this.xhr = new XMLHttpRequest();
      xhr.open("POST", "https://dev.clclient.com/cl-trucadence-service/api/v2/emailSignatures/uploadImage/" + signatureId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
      xhr.responseType = "json";
    }
    _initListeners(resolve, reject, file) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${file.name}.`;

      xhr.addEventListener("error", () => reject(genericErrorText));
      xhr.addEventListener("abort", () => reject());
      xhr.addEventListener("load", () => {

        const response = xhr.response;
        if (!response || response.error) {
          return reject(response && response.error ? response.error.message : genericErrorText);
        }

        resolve({
          default: response.url,
        });
      });

      if (xhr.upload) {
        xhr.upload.addEventListener("progress", evt => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }

    _sendRequest(file) {
      const data = new FormData();
      data.append("file", file);
      this.xhr.send(data);
    }
  }

  return (
    <>
      <Card className="b">
        <CardHeader className="bg-gray-lighter text-bold">Email Settings</CardHeader>
        <CardBody className="bt">
          <p><strong>Email Account</strong></p>
          <Form onSubmit={handleSubmit(onSubmit)} name="emailAccountForm">
            <FormGroup>
              <Label for="server_type">Server Type</Label>
              <Input
                type="select"
                name="serverType"
                id="server_type"
                invalid={errors.serverType}
                innerRef={register({ required: "Please select Server Type" })}
                onChange={(e) => {
                  var serverType = e.target.value;
                  setServerType(serverType);
                  reset(emailReset);
                }}
                value={serverType}
                >
                <option></option>
                <option value="Gmail">Gmail</option>
                <option value="Office365">Office365</option>
                <option value="Exchange 2007">Exchange 2007</option>
                <option value="Exchange 2010">Exchange 2010</option>
                <option value="Exchange 2013">Exchagne 2013</option>
                <option value="Exchange 2016">Exchagne 2016</option>
              </Input>
              <ErrorMessage errors={errors} name="serverType" className="invalid-feedback" as="p" />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" invalid={errors.email} innerRef={register({ required: "Please enter email" })} />
              <ErrorMessage errors={errors} name="email" className="invalid-feedback" as="p" />
            </FormGroup>
            <FormGroup style={{ display: (serverType == "Gmail") ? "" : "none" }}>
              <Label for="display_name">Displayname</Label>
              <Input type="text" name="displayName" id="display_name" invalid={errors.DisplayName} innerRef={register({ required: "Please enter display name" })} />
              <ErrorMessage errors={errors} name="DisplayName" className="invalid-feedback" as="p" />
            </FormGroup>
            <FormGroup style={{ display: (serverType == "Gmail") ? "none" : "" }}>
              <Label for="user_name">Username</Label>
              <Input type="text" name="userName" id="user_name" invalid={errors.UserName} innerRef={register({ required: "Please enter user name" })} />
              <ErrorMessage errors={errors} name="userName" className="invalid-feedback" as="p" />
            </FormGroup>
            <FormGroup style={{ display: (serverType == "Gmail") ? "none" : "" }}>
              <Label for="mail_password">Password</Label>
              <Input type={passwordType ? "text" : "password"} name="mailPassword" id="mail_password" innerRef={register({ required: "Please enter password" })} />
            </FormGroup>
            <FormGroup style={{ display: (serverType === "Exchange 2007" || serverType === "Exchange 2010" || serverType === "Exchange 2013" || serverType === "Exchange 2016") ? "" : "none" }}>
              <Label for="mail_server_url">Email Server URL</Label>
              <Input type="text" name="mailServerUrl" id="mail_server_url" invalid={errors.emailServerURL} innerRef={register({ required: "Please enter mail server url" })} />
              <ErrorMessage errors={errors} name="mailServerURL" className="invalid-feedback" as="p" />
            </FormGroup>
            <FormGroup check style={{ display: (serverType == "Gmail") ? "none" : "" }}>
              <Input type="checkbox" id="show_email_password" name="showEmailPassword" onClick={() => { setPasswordType(!passwordType) }} />
              <Label for="show_email_password">Show Password</Label>
            </FormGroup>
            {/* TODO Disable email account API is not available, Once it is done we need work on this */}
            <FormGroup check>
              <Input type="checkbox" id="disable_email_account" name="disableEmailAccount" />
              <Label for="disable_email_account">Disable Email Account</Label>
            </FormGroup>
            {/* TODO Disable email account API is not available, Once it is done we need work on this */}
            <Button type="submit" color="primary" disabled={editAccountLoading || addAccountLoading} icon={addAccountLoading || editAccountLoading ? "fas fa-spinner fa-spin" : "fas fa-check"} onClick={onSubmit}>{addAccountLoading || editAccountLoading ? "Wait" : "Save"}</Button>
            <p className="mt-2"><i className={"fa-2x mr-2 " + (verified ? "fas fa-check-circle text-success" : "fa fa-exclamation-circle text-danger")}></i>{verified ? "Your email is verified" : "Your email is not verified"}</p>
          </Form>
        </CardBody>
        <CardBody className="bt">
          <p><strong>Email Signature</strong></p>
          {signatureLoading &&
            <Col sm={6} className="my-auto">
              <Progress animated value="100" />
            </Col>
          }
          {
            !signatureLoading &&
            <Form>
              <FormGroup>
                <CKEditor editor={ClassicEditor}
                  data={emailSignature}
                  onInit={editor => {
                    editor.plugins.get("FileRepository").createUploadAdapter = function (loader) {
                      return new MyUploadAdapter(loader);
                    };
                  }}
                  onChange={(event, editor) => {
                    emailSignature = editor.getData();
                  }}
                />
              </FormGroup>
              <Button color="primary" disabled={addSignatureLoading} icon={addSignatureLoading ? "fas fa-spinner fa-spin" : "fas fa-check"} onClick={() => { saveEmailSignature(emailSignature) }}>{addSignatureLoading ? "Wait" : "Save"}</Button>
            </Form>
          }
        </CardBody>
        <ToastContainer toastStyles />
      </Card>
    </>
  );
}
export default EmailSetting;