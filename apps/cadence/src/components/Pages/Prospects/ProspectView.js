/**
 * @author ranbarasan
 * @version V11.0
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { withRouter } from "react-router-dom";
import { Badge, Button, Card, CardBody, CardDeck, CardHeader, CardTitle, Col, Collapse, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Popover, PopoverBody, Row, TabContent, TabPane, Table } from "reactstrap";
import { parseUrl } from "query-string";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { ContentWrapper, FormValidator } from "@nextaction/components";
import classnames from 'classnames';

import { default as ClButton } from "../../Common/Button";
import CloseButton from "../../Common/CloseButton";
import PageHeader from "../../Common/PageHeader";
import UserContext from "../../UserContext";

import ZipWhipModal from "../../Common/ZipwhipTouchModal";
import PendingActivityGrid from "./PendingActivityGrid";
import PendingEmailGrid from "./PendingEmailGrid";
import LogACallAndLogATask from "./LogACallAndLogATask";

import FETCH_PROSPECTS_QUERY, { UPDATE_PROSPECT_QUERY } from '../../queries/ProspectsQuery';
import FETCH_ACTIVITIES_QUERY from '../../queries/ActivitiesQuery';
import FETCH_CL_CRM_FIELD_MAPPING_QUERY from "../../queries/FieldMappingQuery";

const ProspectView = ({ location, match, history }) => {

	var cusTabContent = {
		maxHeight: '383px',
		overflowY: 'auto'
	};

	var cusPhoneAlt = {
		transform: 'rotate(135deg)',
		cursor: 'pointer'		
	};

	const recordType = "lead";
	const [fieldMappingFilter, setFieMappingFilter] = useState(
		`&filter[mappingForTrucadence]=true&filter[recordType]=${recordType}`
	);
	const { user, loading: userLoading } = useContext(UserContext);
	const currentUserId = userLoading ? 0 : user.id;

	const { query: queryParams } = parseUrl(window.location.search);
	const limit = queryParams["page[limit]"] ? parseInt(queryParams["page[limit]"]) : 0;
	const [offset, setOffset] = useState(queryParams["page[offset]"] ? parseInt(queryParams["page[offset]"]) : 0);

	const { cadence, prospect, touch } = location.state ? location.state : {};
	const [prospectId, setProspectId] = useState(match.params.id);
	const [allProspectsData, setAllProspectsData] = useState(location.state ? location.state.allProspectsData : undefined);
	const [renderNextProspect, setRenderNextProspect] = useState(false);
	const [renderPrevProspect, setRenderPrevProspect] = useState(false);
	const [prospectToRender, setProspectToRender] = useState(prospect);
	const [cadenceToRender, setCadenceToRender] = useState(cadence);
	const [touchToRender, setTouchToRender] = useState(touch);
	const prospectFilterParams = Object.entries({ ...queryParams, "filter[user][id]": currentUserId }).filter(([key]) => key.startsWith("filter")).map(([key, val]) => `${key}=${val}`).join("&");

	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const [isEdit, setIsEdit] = useState(false);
	const toggleEdit = () => setIsEdit(!isEdit);
	const [isCallOutcome, setisCallOutcome] = useState(false);
	const toggleCall = () => setisCallOutcome(!isCallOutcome);
	const editFormRef = useRef();
	const [prospectEditForm, setProspectEditForm] = useState({});
	const hasError = (inputName, method) => prospectEditForm && prospectEditForm.errors && prospectEditForm.errors[inputName] && prospectEditForm.errors[inputName][method];

	const [activitiesTab, setActivitiesTab] = useState("all");
	const [callOutcomeTab, setCallOutcomeTab] = useState("followUp");
	const [allActivitiesLimit] = useState(10);
	const [allActivitiesOffset, setAllActivitiesOffset] = useState(0);
	const [groupedActivities, setGroupedActivities] = useState({ CALL: [], EMAIL: [], TEXT: [], OTHER: [] });

	const [popoverOpen, setPopoverOpen] = useState(false);
	const popoverToggle = () => setPopoverOpen(!popoverOpen);
	const [actionsTab, setActionsTab] = useState("action");
	const [toggleAccordion, setToggleAccordion] = useState(false);
	const accordionToggle = () => setToggleAccordion(!toggleAccordion);
	const [showLogTaskModal, setShowLogTaskModal] = useState(false);
	const [showZhipwhiTouchWindow, setShowZhipwhiTouchWindow] = useState(false);
	const [textPhoneNumber, setTextPhoneNumber] = useState(0);
	let zipwhipSessionKey = '894BECDC5D90E1F89137FB73EEF77159BD0070E5A25C57B3E7908F1825B075908B360CC9F747E90FA452153E4BC075F0';
	/* ----- Get current prospect all activities -begin ----- */

	const { loading: allActivitiesLoading, error: allActivitiesError, data: allActivities, fetchMore: fetchMoreAllActivities } = useQuery(FETCH_ACTIVITIES_QUERY, {
		variables: { prospectId, allActivitiesLimit, allActivitiesOffset, filter: "", sort: "&sort[activityDatetime]=desc" },
		onCompleted: (data) => {
			const activities = data.activities.data.reduce((accumulator, activity) => {
				const touchType = activity.touchType;
				if (!accumulator[touchType]) {
					accumulator[touchType] = []
				}
				accumulator[touchType].push(activity);

				return accumulator;
			}, {});

			setGroupedActivities({
				CALL: [...groupedActivities.CALL, ...(activities.CALL ? activities.CALL : [])],
				EMAIL: [...groupedActivities.EMAIL, ...(activities.EMAIL ? activities.EMAIL : [])],
				TEXT: [...groupedActivities.TEXT, ...(activities.TEXT ? activities.TEXT : [])],
				OTHER: [...groupedActivities.OTHER, ...(activities.OTHER ? activities.OTHER : [])]
			});

			if ((allActivitiesOffset + 1) * allActivitiesLimit < data.activities.paging.totalCount) {

				setAllActivitiesOffset(allActivitiesOffset + 1);
			}
		},
		onError: (response) => console.log(response),
		notifyOnNetworkStatusChange: true
	});
	/* ----- Get current prospect all activities -end ----- */

	/* ----- Fetch prospects page by page from server -begin ----- */
	const [fetchProspectsNextPage, { loading: fetchProspectsNextPageLoading }] = useLazyQuery(FETCH_PROSPECTS_QUERY, {
		variables: { includeAssociationsQry: 'includeAssociations[]=cadence&includeAssociations[]=touch', prospectFilter: `&${prospectFilterParams}`, limit },
		notifyOnNetworkStatusChange: true,
		fetchPolicy: "cache-first",
		onCompleted: (data) => {
			setAllProspectsData(data)
		}
	});
	/* ----- Fetch prospects page by page from server -end ----- */

	const { data: fieldMappingData, loading: fieldMappingLoading, error } = useQuery(FETCH_CL_CRM_FIELD_MAPPING_QUERY, {
		variables: {
			limit: 200,
			offset: 0,
			filterMapping: fieldMappingFilter
		},
		notifyOnNetworkStatusChange: true,
		fetchPolicy: "cache-first",
	});

	/* ----- When page is loaded if no prospect is available to render, then fetch prospect page using offset value in URL -begin ----- */
	useEffect(() => {
		if (prospectToRender == undefined) {
			fetchProspectsNextPage({
				variables: { offset }
			});
		}
	}, []);
	/* ----- When page is loaded if no prospect is available to render, then fetch prospect page using offset value in URL -end ----- */
	/* ----- After fetching next/previous pages update prospect view -begin ----- */
	useEffect(() => {
		if (renderNextProspect) {
			handleRenderNextProspect()
		}

		if (renderPrevProspect) {
			handleRenderPrevProspect()
		}

		if (!prospectToRender && allProspectsData) {
			updateProspectView(allProspectsData.prospects.data.find(prospect => prospect.id == prospectId));
		}

	}, [allProspectsData]);
	/* ----- After fetching next/previous pages update prospect view -end ----- */

	/* ----- When user clicks on Edit button, to render prospect data in edit from -begin ----- */
	useEffect(() => {
		if (isEdit && prospectToRender) {
			[...editFormRef.current.elements]
				.filter((ele) => ["INPUT", "SELECT"].includes(ele.nodeName))
				.forEach(ele => {
					if (prospectToRender[ele.name]) {
						ele.value = prospectToRender[ele.name];
					}
				});
		}
	}, [isEdit, prospectToRender]);
	/* ----- When user clicks on Edit button, to render prospect data in edit from -end ----- */
	// To calculate current prospect index
	const currentProspectIndex = () => {
		return (offset * limit) + allProspectsData.prospects.data.findIndex(prospect => prospect.id == prospectId);
	}
	/* ----- When user clicks on next prospect button -begin ----- */
	const handleRenderNextProspect = () => {
		var currentIndex = allProspectsData.prospects.data.findIndex(prospect => prospect.id == prospectId);

		if (currentIndex + 1 === allProspectsData.prospects.data.length) {
			setRenderNextProspect(true);
			updateQueryParam({ "page[offset]": offset + 1 });
			setOffset(offset + 1);

			fetchProspectsNextPage({
				variables: { offset: offset + 1 }
			});

			return;
		}

		setRenderNextProspect(false);
		const nextProspect = allProspectsData.prospects.data[currentIndex + 1];
		updateProspectView(nextProspect);
		setFieMappingFilter(`&filter[mappingForTrucadence]=true&filter[recordType]=${nextProspect.recordType}`)
	}
	/* ----- When user clicks on next prospect button -end ----- */

	/* ----- When user clicks on previous prospect button -begin ----- */
	const handleRenderPrevProspect = () => {

		var currentIndex = allProspectsData.prospects.data.findIndex(prospect => prospect.id == prospectId);
		if (currentIndex === 0 && !renderPrevProspect) {
			setRenderPrevProspect(true);
			updateQueryParam({ "page[offset]": offset - 1 });
			setOffset(offset - 1);

			fetchProspectsNextPage({
				variables: { offset: offset - 1 }
			});

			return;
		}

		setRenderPrevProspect(false);
		const prevProspect = allProspectsData.prospects.data[(currentIndex === -1 ? allProspectsData.prospects.data.length : currentIndex) - 1];
		updateProspectView(prevProspect);
	}
	/* ----- When user clicks on previous prospect button -end ----- */
	/* ----- To find current prospect cadence, touch and to update page state and url -begin ----- */
	const updateProspectView = (prospect) => {

		let cadence;
		if (prospect && allProspectsData && prospect.associations && prospect.associations.cadence && allProspectsData.prospects.includedAssociations) {
			cadence = allProspectsData.prospects.includedAssociations.cadence.find(cadence => cadence.id === prospect.associations.cadence[0].id);
		}

		let touch;
		if (prospect && prospect.associations && prospect.associations.touch && allProspectsData.prospects.includedAssociations) {
			touch = allProspectsData.prospects.includedAssociations.cadence.find(touch => touch.id === prospect.associations.touch[0].id);
		}

		setProspectId(prospect.id);
		setProspectToRender(prospect);
		setCadenceToRender(cadence);
		setTouchToRender(touch);
		window.history.pushState({}, '', `${prospect.id}` + window.location.search);
	}
	/* ----- To find current prospect cadence, touch and to update page state and url -end ----- */

	/* ----- To prospect edit save -begin ----- */
	const handleUpdateProspect = () => {

		const form = editFormRef.current;
		const inputs = [...form.elements].filter((i) =>
			["INPUT", "SELECT"].includes(i.nodeName)
		);

		const { errors, hasError } = FormValidator.bulkValidate(inputs);
		setProspectEditForm({ ...form, errors });

		if (!hasError) {
			var prospectData = [...form.elements].reduce((acc, item) => {

				if (item.type === "checkbox") {
					acc[item.name] = item.checked;
				} else if (item.value.trim() != "") {
					acc[item.name] = item.value;
				}
				return acc;
			}, {});

			updateProspect({
				variables: {
					prospectId: prospectId,
					input: prospectData
				}
			});
		}
	}
	/* ----- To prospect edit save -end ----- */
	// To handle activity tab chagne
	const handleActivityTabChange = (tabVal) => {
		if (tabVal !== activitiesTab) {
			setActivitiesTab(tabVal);
		}
	}
	//To handle call outcome tab
	const handleCallTabChange = (tabValue) => {
		if (tabValue !== callOutcomeTab) {
			setCallOutcomeTab(tabValue);
		}
	}
	// To update browser URL query params
	const updateQueryParam = (param) => {
		const { query } = parseUrl(window.location.search);
		let searchString = Object.entries({ ...query, ...param }).map(([key, val]) => `${key}=${val}`).join("&");
		window.history.replaceState({}, '', "?" + searchString);
	}
	// To handle activity tab chagne
	const handleActionTabChange = (tabVal) => {
		if (tabVal !== activitiesTab) {
			setActionsTab(tabVal);
		}
	}
	// Add prospect to cadence request
	const [updateProspect, { loading: updateProspectLoading }] = useLazyQuery(UPDATE_PROSPECT_QUERY, {
		onCompleted: (response) => handleUpdateProspectRequestCallback(response, true),
		onError: (response) => handleUpdateProspectRequestCallback(response)
	});
	const handleUpdateProspectRequestCallback = (response, requestSuccess) => {
		//TODO handle prospect update
		if (requestSuccess) {
			setIsEdit(false)
		} else {
			setIsEdit(true);
		}
	}
	const pendingEmail = [{
		subject: "TEN",
		due_date: "< 1 day",
		due: "19:06:56",
		touch: "Touch 2 (EMAIL)"
	}];

	const pendingActivity = [{
		subject: "Talk to customer",
		comments: "Meeting with customer",
		follow_up_due_date: "07/25/2020"
	}, {
		subject: "Test follow up",
		comments: "Test follow up",
		follow_up_due_date: "07/24/2020"
	}];
	/* ---- Grid Columns configuration -begin ----- */
	const columns = React.useMemo(
		() => [{
			Header: "Subject",
			accessor: "subject",
			width: "30%"
		}, {
			Header: "Date",
			accessor: "follow_up_due_date",
			width: "30%"
		}, {
			Header: "Notes",
			accessor: "comments",
			width: "40%"
		}],
		[]
	);
	const _columns = React.useMemo(
		() => [{
			Header: "Subject",
			accessor: "subject",
			width: "30%"
		}, {
			Header: "Due",
			accessor: "due_date",
			width: "30%"
		}, {
			Header: "Current Touch",
			accessor: "touch",
			width: "40%"
		}],
		[]
	);
	/* ---- Grid Columns configuration -end ----- */
	if (!prospectToRender || allProspectsData == undefined) {
		return null;
	}

	return (
		<ContentWrapper>
			<PageHeader pageName="Prospect View">
				<Nav>
					{
						allProspectsData && allProspectsData.prospects.paging && !renderNextProspect &&
						<NavItem>
							<small className="pt-3"><i>{currentProspectIndex() + 1} of {allProspectsData.prospects.paging.totalCount} Prospects</i></small>
						</NavItem>
					}
					<NavItem row>
						<NavLink href="#" onClick={handleRenderPrevProspect} disabled={currentProspectIndex() == 0}>
							<i className="fas fa-chevron-left fa-xs"></i>
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#" onClick={handleRenderNextProspect} disabled={allProspectsData && allProspectsData.prospects.paging && allProspectsData.prospects.paging.totalCount == currentProspectIndex() + 1}>
							<i className="fas fa-chevron-right fa-xs"></i>
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							onClick={() => history.push(location.state && location.state.origin ? location.state.origin + location.search : "/prospects")}
						>
							<i className="fas fa-times text-muted fa-xs"></i>
						</NavLink>
					</NavItem>
				</Nav>
			</PageHeader>
			<br />
			<Row>
				<Col>
					<div className="mb-3">
						<div className="float-right">
							<ul className="nav">
								<li className="nav-item pr-3"><i className="svgicon trucadence-icon text-muted mr-2"></i>{cadenceToRender ? cadenceToRender.multiTouchName : "N/A"}</li>
								<li className="nav-item pr-3"><i className="fas fa-hand-pointer text-muted mr-2"></i>#{prospectToRender.currentTouchId}</li>
								<li className="nav-item pr-3"><i className="fas fa-arrow-right text-muted mr-2"></i>{prospectToRender.lastTouchDateTime}</li>
								<li className="nav-item pr-3"><i className="fas fa-angle-double-right text-muted mr-2"></i>N/A</li>
							</ul>
						</div>
						<div> <h4> {prospectToRender.contactName} </h4> </div>
					</div>
				</Col>
			</Row>
			{/* Start Info & Stats */}
			<div className="mb-4">
				<CardDeck>
					<Card className="card-default">
						<CardHeader>
							{isEdit
								? <>
									<CloseButton className="float-right font13" onClick={toggleEdit} btnTxt="Cancel"></CloseButton>
									<ClButton color="primary" outline onClick={handleUpdateProspect} className="float-right font13" icon="fas fa-save" title="Save Changes">Save</ClButton>
								</>
								: <ClButton outline color="primary" onClick={toggleEdit} className="float-right font13" icon="fas fa-pencil-alt" title="Edit Prospect">Edit</ClButton>
							}
							<CardTitle><i className="fas fa-user text-muted mr-2"></i> Info </CardTitle>
						</CardHeader>
						<CardBody>
							{isEdit
								? <Card>
									<Form innerRef={editFormRef}>
										<CardBody>
											<FormGroup>
												<Label for="edit_info_fname" className="font-weight-bold">First Name</Label>
												<Input type="text" id="edit_info_fname" name="firstName" />
											</FormGroup>
											<FormGroup>
												<Label for="edit_info_lname" className="font-weight-bold">Last Name</Label>
												<Input type="text" id="edit_info_lname" name="lastName" data-validate='["required"]'
													invalid={
														hasError("lastName", "required") ||
														hasError("lastName", "text")
													} />
											</FormGroup>
											<FormGroup>
												<Label for="edit_info_title" className="font-weight-bold">Title</Label>
												<Input type="text" id="edit_info_title" name="title" />
											</FormGroup>
											<FormGroup>
												<Label for="edit_info_email" className="font-weight-bold">Email</Label>
												<Input type="text" id="edit_info_email" name="emailId" />
											</FormGroup>
											<FormGroup>
												<Label for="edit_info_phone" className="font-weight-bold">Phone</Label>
												<Input type="datetime" id="edit_info_phone" name="phone" />
											</FormGroup>
											{!fieldMappingLoading &&
												fieldMappingData.fields.data.map((fields) => {
													let fieldControlType = fields.fieldControlType.toLowerCase();
													fieldControlType = (fieldControlType === "numeric") ? 'number' : (fieldControlType === "boolean") ? "checkbox" : fieldControlType;
													if (!fields.isImplicitField) {
														return (
															<FormGroup>
																<Label for={fields.apiFieldName} className="font-weight-bold">{fields.clFieldLabel}</Label>
																{
																	fieldControlType === "select" ?
																		<Input type={fieldControlType} id={fields.apiFieldName} name={fields.apiFieldName} >
																			{
																				fields.dropDownValues.map((keyValue) => {
																					return (
																						<option value={keyValue}>{keyValue}</option>
																					);
																				})
																			}
																		</Input>
																		: fieldControlType === "timestamp" ?
																			<InputGroup>
																				<Input type="date" id={fields.apiFieldName + "_Date"} name={fields.apiFieldName} />
																				<InputGroupAddon addonType="append">
																					<Input type="time" id={fields.apiFieldName + "_Time"} name={fields.apiFieldName} />
																				</InputGroupAddon>
																			</InputGroup>
																			: (fieldControlType === "integer" || fieldControlType == "number") ?
																				<>
																					<Input type={fieldControlType} id={fields.apiFieldName} name={fields.apiFieldName}
																						data-validate={'["' + fieldControlType + '"]'}
																						invalid={
																							hasError(fields.apiFieldName, fieldControlType, fieldControlType)
																						}
																					/>
																					<span className="invalid-feedback">Field must be an {fieldControlType}</span>
																				</>
																				: <>
																					<Input type={fieldControlType} id={fields.apiFieldName} name={fields.apiFieldName} />
																				</>
																}
															</FormGroup>
														)
													}
												})
											}
										</CardBody>
									</Form>
								</Card>
								: <>
									<ListGroup>
										<div>
											<p><span><b>{prospectToRender.contactName}</b></span></p>
											<p className="font13">{prospectToRender.title}</p>
											<p className="font-italic">{prospectToRender.accountName}</p>
											<p>{prospectToRender.city}, {prospectToRender.state}</p>
											<p><span><b>Timezone: </b></span>{prospectToRender.timezone}</p>
											<p><span><b>Record Type: </b></span>{prospectToRender.recordType}</p>
										</div>
										<div className="mb-3 pt-3">
											<div className="media pt-1"><a href="mailto:daymondjohn@cl.com"><i className="fas fa-envelope text-muted mr-2"></i> {prospectToRender.email}</a></div>
											<div className="media pt-1"><a href="#"><i className="fas fa-phone-alt text-muted mr-2 r100"></i> {prospectToRender.phone}</a></div>
											<div className="media pt-1"><a href="#"><i className="fas fa-home text-muted mr-2"></i> (603) 386-0306</a></div>
											<div className="media pt-1"><a href="#"><i className="fas fa-city text-muted mr-2"></i> (603) 386-0306</a> <span className="pl-4">Ext: {prospectToRender.extension}</span></div>
										</div>
									</ListGroup>
									<ListGroup>
										<div className="mb-3">
											<div className="media">
												<div className="align-self-start"><i className="fas fa-clock text-muted mr-2"></i></div>
												<div className="media-body">Prospect Local Time</div>
											</div>
										</div>
										<div className="media pl-3 pr-3 mb-3"><div className="align-self-start mr-2">08:22 AM EDT</div></div>
									</ListGroup>
									<Card className="b mb-2 ml-0">
										<CardHeader onClick={accordionToggle}>
											<CardTitle tag="h5">
												<a className="text-inherit cursor-pointer">Prospect Custom Fields<i className="fa fa-angle-double-down text-primary float-right"></i> </a>
											</CardTitle>
										</CardHeader>
										<Collapse isOpen={toggleAccordion} >
											<CardBody id="collapse01">
												<Row>
													<Col>
														{!fieldMappingLoading &&
															fieldMappingData.fields.data.map((fields) => {

																if (!fields.isImplicitField) {
																	return (
																		<p><span><b>{fields.clFieldLabel}: </b></span>{prospectToRender[fields.clFieldLabel]}</p>
																	)
																}
															})
														}
														{error &&
															<span>No Custom Fields Available</span>
														}
													</Col>
												</Row>
											</CardBody>
										</Collapse>
									</Card>
									<ListGroup>
										<div className="mb-3">
											<div className="media">
												<div className="align-self-start"><i className="fas fa-chart-bar text-muted mr-2"></i></div>
												<div className="media-body"> Stats </div>
											</div>
										</div>
										<div className="media pl-3 pr-3">
											<Row>
												<Col>
													<div className="align-self-start mr-2"> 2 </div>
												</Col>
												<Col>
													<div className="align-self-start mr-2"> 5 </div>
												</Col>
												<Col>
													<div className="align-self-start mr-2"> 5 </div>
												</Col>
												<Col>
													<div className="align-self-start mr-2"> 5 </div>
												</Col>
											</Row>
										</div>
										<div className="media pl-3 pr-3">
											<Row>
												<Col>
													<div>
														<i className="fas fa-phone-alt text-muted"></i>
													</div>
												</Col>
												<Col>
													<div>
														<i className="fas fa-envelope text-muted"></i>
													</div>
												</Col>
												<Col>
													<div>
														<i className="fas fa-share-alt text-muted"></i>
													</div>
												</Col>
												<Col>
													<div>
														<i className="fas fa-linkedin text-muted"></i>
													</div>
												</Col>
											</Row>
										</div>
									</ListGroup>
								</>
							}
						</CardBody>
					</Card>
					{/* End Info & Stats */}
					{/* Start Actions, Custom Fields & Click Dialer */}
					<Card className='card-default'>
						<Nav className="nav-tabs nav-justified">
							<NavItem>
								<NavLink
									className={classnames({ active: actionsTab === "action" })}
									onClick={() => { handleActionTabChange("action"); }}
								>
									<i className="fas fa-bolt text-muted mr-2"></i> Actions
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: actionsTab === "activity" })}
									onClick={() => { handleActionTabChange("activity"); }}
								>
									Pending Activities
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: actionsTab === "email" })}
									onClick={() => { handleActionTabChange("email"); }}
								>
									Pending Email
								</NavLink>
							</NavItem>
						</Nav>
						<TabContent activeTab={actionsTab}>
							<TabPane tabId="action">
								<ListGroup className="pl-3 pr-3 mb-3">
									<ul className="nav">
										<li className="pl-3">
											<span onClick={toggle} className="fa-stack fa-1x" style={{ cursor: 'pointer' }}>
												<i className="fas fa-circle fa-stack-2x text-success"></i>
												<i className="fas fa-phone-alt fa-stack-1x fa-inverse"></i>
											</span>
										</li>
										<li className="pl-3">
											<span className="fa-stack fa-1x">
												<i className="fas fa-circle fa-stack-2x text-primary"></i>
												<i className="fas fa-envelope fa-stack-1x fa-inverse"></i>
											</span>
										</li>
										<li className="pl-3">
											<span className="fa-stack fa-1x" onClick={() => setShowLogTaskModal(true)}>
												<i className="fas fa-circle fa-stack-2x text-warning"></i>
												<i className="fas fa-tasks fa-stack-1x fa-inverse"></i>
											</span>
										</li>
										<li className="pl-3">
											<span className="fa-stack fa-1x" onClick={() => { setShowZhipwhiTouchWindow(true); setTextPhoneNumber(prospectToRender.phone); }}>
												<i className="fas fa-circle fa-stack-2x text-warning"></i>
												<i className="fas fa-plus fa-stack-1x fa-inverse"></i>
											</span>
										</li>
										<li className="pl-3">
											<span className="fa-stack fa-1x">
												<i className="fas fa-circle fa-stack-2x text-danger"></i>
												<i className="fas fa-sign-in-alt fa-stack-1x fa-inverse"></i>
											</span>
										</li>
									</ul>
								</ListGroup>
								{/* Phone icon - Actions - clicked */}
								{isOpen
									? <>
										<ListGroup>
											<div className="media">
												<h4 className="ml-3 float-left"><span className="text-danger">CLICK</span>DIALER</h4>
												<div className="ml-auto mr-2">
													<i className="far fa-circle mr-2"></i>
													<i className="fas fa-circle text-success mr-2"></i>
												</div>
											</div>
										</ListGroup>
										<ListGroup>
											<ListGroupItem className="bg-inverse-light">
												<div className="float-left ml-2">Talk Time:<span className="text-success ml-3">00:00</span></div>
												<div className="mb-1 float-right">
													<i class="fa fa-ban mr-2" ></i>
													<i className="fas fa-cog mr-2"></i>
												</div>
											</ListGroupItem>
											<ListGroupItem className="bg-inverse-light">
												<div className="media mb-2 text-center">
													<div className="media-body">
														<p>(603) 386-0306</p>
														<p>Calling ... 	</p>
														<span onClick={toggle} className="fa-stack fa-1x" style={cusPhoneAlt}>
															<i className="fas fa-circle fa-stack-2x text-danger"></i>
															<i className="fas fa-phone-alt fa-stack-1x fa-inverse"></i>
														</span>
													</div>
												</div>
												<div className="media pt-3 ml-5 pl-4">
													<FormGroup>
														<Input type="select" name="call_result" id="call_result">
															<option>Select VM1</option>
															<option>Select VM2</option>
															<option>Select VM3</option>
														</Input>
													</FormGroup>
													<ClButton color="outline-danger" className="ml-3 bg-inverse-light" icon="fa fa-caret-right">Leave VM</ClButton>
												</div>
												<div className="media mb-1 pt-1 float-right">
													<span onClick={toggle} className="fa-stack fa-1x text-sm" style={{ cursor: 'pointer' }}>
														<i className="fas fa-circle fa-stack-2x"></i>
														<i className="fas fa-minus fa-stack-1x text-dark"></i>
													</span>
												</div>
											</ListGroupItem>
											{/* Call Outcome */}
											<ListGroup className="pt-3">
												<div className="bg-inverse-light">
													<div className="float-left ml-2 pt-2">Talk Time<span className="text-success ml-3">00:00</span></div>
													<div className="my-1 float-right">
														<span onClick={toggle} className="fa-stack fa-1x" style={{ cursor: 'pointer' }}>
															<i className="fas fa-circle fa-stack-2x text-danger"></i>
															<i className="fas fa-phone-alt fa-stack-1x fa-inverse"></i>
														</span>

														<i class="fas fa-minus mr-2"></i>
														<i class="fas fa-ban mr-2" ></i>
														<i className="fas fa-cog mr-2"></i>
													</div>
												</div>
												<div className="pt-2 ml-3">
													<h6><i class="fas fa-file-alt mr-2"></i>Call Outcome</h6>
												</div>
												<div className="ml-3 mr-3 pt-3">
													<Form>
														<FormGroup>
															<Label for="call_result">Call Result</Label>
															<Input type="select" name="call_result" id="call_result">
																<option>Select Call Result</option>
																<option>Qualified Lead</option>
																<option>Followup</option>
																<option>Meeting Scheduled</option>
															</Input>
														</FormGroup>
														<FormGroup>
															<Label for="call_comments" className="font-weight-bold">Call Comments</Label>
															<Input type="textarea" name="call_comments" id="call_comments" />
														</FormGroup>
													</Form>
												</div>
											</ListGroup>
											<Nav className="nav-tabs nav-justified">
												<NavItem>
													<NavLink
														className={classnames({ active: callOutcomeTab === "followup" })}
														onClick={() => { handleCallTabChange("followup"); }}
													>
														Follow up
													</NavLink>
												</NavItem>
												<NavItem>
													<NavLink
														className={classnames({ active: callOutcomeTab === "history" })}
														onClick={() => { handleCallTabChange("history"); }}
													>
														History
													</NavLink>
												</NavItem>
												<NavItem>
													<NavLink
														className={classnames({ active: callOutcomeTab === "referral" })}
														onClick={() => { handleCallTabChange("referral"); }}
													>
														Referral
													</NavLink>
												</NavItem>
											</Nav>
											<ListGroup>
												<TabContent activeTab={callOutcomeTab}>
													<TabPane tabId="followUp">
														<Form>
															<FormGroup check className="mb-3">
																<Label for="is_schedule_follow_up" check>
																	<Input type="checkbox" name="isScheduleFollowUp" id="is_schedule_follow_up" className="form-check-input" />
																	Schedule a follow up
																</Label>
															</FormGroup>
															<FormGroup>
																<Label for="subject">Subject</Label>
																<Input type="text" id="subject" name="subject" />
															</FormGroup>
															<FormGroup>
																<Label for="follow_up_comments">Follow Up Comments</Label>
																<Input type="textarea" name="followUpComments" id="follow_up_comments" />
															</FormGroup>
															<FormGroup>
																<Label for="follow_up_date" className="mr-2">Date</Label>
																<Input type="date" name="followUpDate" id="follow_up_date" />
															</FormGroup>
															<FormGroup>
																<Label for="follow_up_time">Time</Label>
																<Input type="time" name="followUpTime" id="follow_up_time" />
															</FormGroup>
														</Form>
													</TabPane>
													<TabPane tabId="history">
														<Table>
															<thead>
																<tr>
																	<th>Subject</th>
																	<th>Last Modified Date</th>
																	<th>Description</th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	<td>Mark</td>
																	<td>Otto</td>
																	<td>@mdo</td>
																</tr>
															</tbody>
														</Table>
													</TabPane>
													<TabPane tabId="referral">
														<Form>
															<FormGroup check className="mb-3">
																<Label for="is_schedule_referral" check>
																	<Input type="checkbox" name="isScheduleReferral" id="is_schedule_referral" className="form-check-input" />																	
																	Schedule a referral
																</Label>
															</FormGroup>
															<FormGroup>
																<Label for="referral_subject">Subject</Label>
																<Input type="text" name="referralSubject" id="referral_subject" />
															</FormGroup>
															<FormGroup>
																<Label for="referral_comments">Referral Comments</Label>
																<Input type="textarea" name="referralComments" id="referral_comments" />
															</FormGroup>
															<FormGroup>
																<Label for="referral_follow_up_date" className="mr-2">Date</Label>
																<InputGroup>
																	<Input type="date" id="referral_follow_up_date" name="referralFollowUpDate" className="border-right-0" />
																</InputGroup>
																<Label for="time">Time</Label>
																<Input type="time" id="referral_follow_up_time" name="referralFollowUpTime" />
															</FormGroup>
														</Form>
													</TabPane>
												</TabContent>
												<div className="mx-auto">
													<Row className="mb-2 mt-2">
														<ClButton color="primary" className="w-100" icon="fa fa-check" title="Save Changes">Save</ClButton>
													</Row>
													<Row className="mb-2">
														<ClButton color="primary" className="w-100" icon="fa fa-check" title="Dial Next Numbe">Dial Next Number</ClButton>
													</Row>
													<Row >
														<ClButton color="primary" className="w-100" icon="fa fa-check" title="Dial Next Contact">Dial Next Contact</ClButton>
													</Row>
												</div>
											</ListGroup>
											{/* Call Outcome */}
										</ListGroup>
									</>
									: <>
										<ListGroup>
											<div className="media">
												<h4 className="ml-3 float-left"><span className="text-danger">CLICK</span>DIALER</h4>
												<div className="ml-auto mr-2">
													<i className="fas fa-circle text-danger mr-2"></i>
													<i className="far fa-circle mr-2"></i>
												</div>
											</div>
										</ListGroup>
										<ListGroup>
											<div className="bg-inverse-light">
												<div className="mb-1 float-right pt-2 mr-2" id="dialer_settings" onClick={popoverToggle}>
													<i className="fas fa-cog mr-2"></i>
												</div>
											</div>
											<div className="bg-inverse-light">
												<div className="media mb-2 mr-2 ml-3">
													<div className="align-self-start mr-2"> Dial: </div>
													<div className="media-body mr-2"> 804-409-4090
													<i className="fas fa-phone-alt text-success pl-4"></i>
													</div>
												</div>
												<div className="media pt-1 mr-2 ml-3 mb-3">
													<div className="align-self-start mr-2"> Access: </div>
													<div className="media-body mr-2"> 159-800-820</div>
												</div>
											</div>
										</ListGroup>
									</>
								}
								<div>
									<Popover className="px-5" placement="bottom" isOpen={popoverOpen} target="dialer_settings" toggle={popoverToggle} size="lg">
										<PopoverBody>
											<div>
												<Badge href="#" color="secondary" className="float-right">X</Badge>
											</div>
											<Form>
												<FormGroup check>
													<Label check>
														<Input type="checkbox" name="isInternationDialing" id="is_internation_dialing" />
														Enable International dialing
													</Label>
												</FormGroup>
												<FormGroup check>
													<Label check>
														<Input type="checkbox" name="openDetailedView" id="open_detailed_view" />
														Open Detailed View
													</Label>
												</FormGroup>
												<FormGroup className="mt-3">
													<InputGroup>
														<Input type="select" name="voiceMessage" id="voice_message">
															<option>Select VM</option>
															<option>VM 2</option>
															<option>VM 3</option>
															<option>VM 4</option>
															<option>VM 5</option>
														</Input>
														<InputGroupAddon addonType="append">
															<ClButton className="text-danger" title="Delete VM" >X</ClButton>
															<Button title="Record VM" onClick={() => setIsOpen(!isOpen)}><i className="fa fa-microphone"></i></Button>
															<Button className="text-success" title="Listen VM"><i className="fa fa-play"></i></Button>
														</InputGroupAddon>
													</InputGroup>
												</FormGroup>
												<hr></hr>
												<FormGroup className="mt-3">
													<Label for="caller_mode">Caller Id</Label>
													<Input type="select" name="callerMode" id="caller_mode">
														<option value="ABCID">Area Based</option>
														<option value="CUSTOM">CUSTOM</option>
													</Input>
												</FormGroup>
												<div class="text-center">
													<ClButton color="primary" icon="fa fa-check" title="Save Changes">Save</ClButton>
												</div>
											</Form>
										</PopoverBody>
									</Popover>
								</div>
							</TabPane>
							<TabPane tabId="pending_activity">
								<PendingActivityGrid
									columns={columns}
									data={pendingActivity}
								/>
							</TabPane>
							<TabPane tabId="pending_email">
								<PendingEmailGrid
									columns={_columns}
									data={pendingEmail}
								/>
							</TabPane>
						</TabContent>
					</Card>
					{/* End Actions, Custom Fields & Click Dialer */}
					{/* Start All-Calls-Emails Tabs */}
					<Card className="card-default">
						<Nav className="nav-tabs nav-justified">
							<NavItem>
								<NavLink
									className={classnames({ active: activitiesTab === "all" })}
									onClick={() => { handleActivityTabChange("all"); }}
								>
									All
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: activitiesTab === "call" })}
									onClick={() => { handleActivityTabChange("call"); }}
								>
									Calls
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: activitiesTab === "email" })}
									onClick={() => { handleActivityTabChange("email"); }}
								>
									Emails
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: activitiesTab === "text" })}
									onClick={() => { handleActivityTabChange("text"); }}
								>
									Texts
							</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: activitiesTab === "other" })}
									onClick={() => { handleActivityTabChange("other"); }}
								>
									Other
								</NavLink>
							</NavItem>
						</Nav>
						<TabContent style={cusTabContent} activeTab={activitiesTab}>
							<TabPane tabId="all">
								<Row>
									{
										!allActivitiesLoading && !allActivitiesError && allActivities.activities &&
										allActivities.activities.data.map((activity, i) => {
											return {
												"CALL": <CallActivity activity={activity} key={i} />,
												"EMAIL": <EmailActivity activity={activity} key={i} />,
												"TEXT": <TextActivity activity={activity} key={i} />,
											}[activity.touchType]
										})
									}
								</Row>
							</TabPane>
							<TabPane tabId="call">
								<Row>
									{
										!allActivitiesLoading && !allActivitiesError && groupedActivities.CALL &&
										groupedActivities.CALL.map((activity, i) => {
											return <CallActivity activity={activity} key={i} />
										})
									}
								</Row>
							</TabPane>
							<TabPane tabId="email">
								<Row>
									{
										!allActivitiesLoading && !allActivitiesError && groupedActivities.EMAIL &&
										groupedActivities.EMAIL.map((activity, i) => {
											return <EmailActivity activity={activity} key={i} />
										})
									}
								</Row>
							</TabPane>
							<TabPane tabId="text">
								<Row>
									{
										!allActivitiesLoading && !allActivitiesError && groupedActivities.TEXT &&
										groupedActivities.TEXT.map((activity, i) => {
											return <TextActivity activity={activity} key={i} />
										})
									}
								</Row>
							</TabPane>
							<TabPane tabId="other">
								<Row>
									{
										!allActivitiesLoading && !allActivitiesError && groupedActivities.OTHER &&
										groupedActivities.OTHER.map((activity, i) => {
											return <TextActivity activity={activity} key={i} />
										})
									}
								</Row>
							</TabPane>
						</TabContent>
					</Card>
					{/* End All-Calls-Emails Tabs */}
				</CardDeck>
			</div>
			<LogACallAndLogATask
				showModal={showLogTaskModal}
				hideModal={() => { setShowLogTaskModal(false) }}
			>
			</LogACallAndLogATask>
			<ZipWhipModal
				showZhipwhiTouchWindow={showZhipwhiTouchWindow}
				phoneNumber={textPhoneNumber}
				zipwhipSessionKey={zipwhipSessionKey}
				handleClose={() => setShowZhipwhiTouchWindow(false)}
				lastActivityData={prospectToRender}
			/>
		</ContentWrapper >
	);
}

const CallActivity = ({ activity }) => {
	return (
		<ListGroup className="mb-2 scroll">
			<div className="media">
				<div className="align-self-start mr-2 pt-2"><small className="text-muted ml-1 p-2">19 hrs</small></div>
				<span className="pt-1">
					<span class="fa-stack" >
						<i class="far fa-circle fa-stack-2x text-muted"></i>
						<i class="fas fa-phone-alt text-info fa-stack-1x"></i>
					</span>
				</span>
				<div className="ml-auto media-body text-truncate pl-3">
					<p className="mb-1 mr-2">
						<b>Phone Call</b> to {activity.personName}
					</p>
					<p className="m-0 text-warning"><b>Meeting Scheduled</b></p>
					<small>05/06/2019   10:48 AM</small>
				</div>
			</div>
		</ListGroup>
	);
}

const EmailActivity = ({ activity }) => {
	return (
		<ListGroup className="mb-2">
			<div className="media">
				<div className="align-self-start mr-2 pt-2"><small className="text-muted ml-1 p-2">19 hrs</small></div>
				<span className="pt-1">
					<span class="fa-stack" >
						<i class="far fa-circle fa-stack-2x text-muted"></i>
						<i class="fas fa-envelope-open text-info fa-stack-1x"></i>
					</span>
				</span>
				<div className="ml-auto media-body text-truncate pl-3">
					<p className="mb-1 mr-2">
						<b>Phone Call</b> to {activity.personName}
					</p>
					<p className="m-0 text-warning"><b>Meeting Scheduled</b></p>
					<small>05/06/2019   10:48 AM</small>
				</div>
			</div>
		</ListGroup>
	);
}

const TextActivity = ({ activity }) => {
	return (
		<ListGroup className="mb-2">
			<div className="media">
				<div className="align-self-start mr-2 pt-2"><small className="text-muted ml-1 p-2">19 hrs</small></div>
				<span className="pt-1">
					<span class="fa-stack" >
						<i class="far fa-circle fa-stack-2x text-muted"></i>
						<i class="fas fa-paper-plane text-info fa-stack-1x"></i>
					</span>
				</span>
				<div className="ml-auto media-body text-truncate pl-3">
					<p className="mb-1 mr-2">
						<b>Phone Call</b> to {activity.personName}
					</p>
					<p className="m-0 text-warning"><b>Meeting Scheduled</b></p>
					<small>05/06/2019   10:48 AM</small>
				</div>
			</div>
		</ListGroup>
	);
}
export default withRouter(ProspectView);