import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Badge, Button, ButtonGroup, Card, CardBody, CardDeck, CardHeader, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { parseUrl } from "query-string";
import classnames from "classnames";
import { ContentWrapper, Scrollable } from "@nextaction/components";
import PageHeader from "../../Common/PageHeader";
import FETCH_ACCOUNTS_QUERY, { FETCH_ACCOUNT_CADENCES_QUERY, FETCH_ACCOUNT_TASKS_QUERY } from "../../queries/AccountsQuery";
import { FETCH_PROSPECT_QUERY_IDS } from "../../queries/ProspectsQuery";
import UserContext from "../../UserContext";
import AccountProspectsGrid from "./AccountProspectsGrid";
import AccountCadencesGrid from "./AccountCadencesGrid";
import AccountTasksGrid from "./AccountTasksGrid";
import AccountStatsGrid from "./AccountStatsGrid";
import AccountActivityGrid from './AccountActivityGrid';

const AccountView = ({ location, match, history }) => {

    const { query: searchParams } = parseUrl(window.location.search);
    const { query: queryParams } = parseUrl(window.location.search);
    const [pageCount, setPageCount] = useState(0);
    const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
    const limit = queryParams["page[limit]"] ? parseInt(queryParams["page[limit]"]) : 10;
    const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
    const { user, loading: userLoading } = useContext(UserContext);
    const currentUserId = userLoading ? 0 : user.id;
    const { account, prospects } = location.state ? location.state : {};
    const [accountId, setAccountId] = useState(match.params.id);
    const [allAccountsData, setAllAccountsData] = useState(location.state ? location.state.allAccountsData : undefined);
    const [renderNextAccount, setRenderNextAccount] = useState(false);
    const [renderPrevAccount, setRenderPrevAccount] = useState(false);
    const [accountToRender, setAccountToRender] = useState(account);
    const [prospectToRender, setProspectToRender] = useState(prospects);
    const [userToRender, setUserToRender] = useState(user);
    const [activitiesTab, setActivitiesTab] = useState("overview");
    const accountFilterParams = Object.entries({ ...queryParams, "filter[user][id]": currentUserId }).filter(([key]) => key.startsWith("filter")).map(([key, val]) => `${key}=${val}`).join("&");
    const [userFilter, setUserFilter] = useState(`filter[user][id]=` + encodeURIComponent(":[" + `${currentUserId}` + "]"));
    const [accountTasksFilter, setAccountTasksFilter] = useState("total");
    const accountSortParams = "sort[name]=asc";

    const [fetchAccountsNextPage, { loading: fetchAccountsNextPageLoading }] = useLazyQuery(FETCH_ACCOUNTS_QUERY, {
        variables: { includeAssociationsQry: "includeAssociations[]=user", accountFilter: `&${accountFilterParams}&${accountSortParams}`, limit },
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            setAllAccountsData(data)
        }
    });

    let prospectId = [];
    let accountid = '';
    let accountName = '';
    let accountDomainName = '';
    let accountTag = '';
    if (accountToRender) {
        prospectId = accountToRender.associations.prospect.map(prospect => prospect.id);
        accountid = accountToRender.id;
        accountName = accountToRender.name;
        accountDomainName = accountToRender.domainName;
        accountTag = accountToRender.tag;
    }

    let tagName = [];
    if (Array.isArray(accountTag)) {
        tagName = accountTag.map((tag) => tag.tagName)
    }

    const { data: prospectsData, loading, error } = useQuery(FETCH_PROSPECT_QUERY_IDS, {
        variables: { includeAssociationsQry: 'includeAssociations[]=cadence&includeAssociations[]=touch', limit, offset, ids: encodeURIComponent(":[" + prospectId + "]") },
        notifyOnNetworkStatusChange: true,
    });

    const accountsProspectGridData = useMemo(() => prospectsData && prospectsData.prospect ? prospectsData.prospect.data : [], [prospectsData]);

    const { data: cadencesData } = useQuery(FETCH_ACCOUNT_CADENCES_QUERY, {
        variables: { includeAssociationsQry: 'includeAssociations[]=touch&includeAssociations[]=user', id: accountId, accountCadencesFilter: `&${userFilter}` },
        notifyOnNetworkStatusChange: true,
    });

    const accountsCadenceGridData = useMemo(() => cadencesData && cadencesData.accounts ? cadencesData.accounts.data : [], [cadencesData]);

    const { data: taskData } = useQuery(FETCH_ACCOUNT_TASKS_QUERY, {
        variables: { includeAssociationsQry: 'includeAssociations[]=cadence', id: accountId, accountTasksFilter: accountTasksFilter, userFilter: userFilter },
        notifyOnNetworkStatusChange: true,
    });

    const accountsTaskGridData = useMemo(() => taskData && taskData.accounts ? taskData.accounts.data : [], [taskData]);

    let emailtouch = [];
    let calltouch = [];
    let cadence = [];
    let touchid = [];
    let touchIndex;
    if (cadencesData && cadencesData.accounts && cadencesData.accounts.data) {
        cadence = cadencesData.accounts.data;
        touchid = cadencesData.accounts.data.map(data => data.associations.touch.map(data => data.id)).join().split(',');
        if (cadencesData && cadencesData.accounts && cadencesData.accounts.includedAssociations && cadencesData.accounts.includedAssociations.touch) {
            touchIndex = cadencesData.accounts.includedAssociations.touch.filter(data => touchid.indexOf(data.id + '') !== -1);
            touchIndex.forEach(function (touchData) {
                if (touchData.touchType == "EMAIL") {
                    emailtouch.push(touchData);
                }
                else if (touchData.touchType == "CALL") {
                    calltouch.push(touchData);
                }
            });
        }
    }

    let currentAccountIndex;
    if (allAccountsData && allAccountsData.accounts && allAccountsData.accounts.data) {
        currentAccountIndex = allAccountsData.accounts.data.findIndex(account => account.id == accountId);
    }

    let share = 0;
    let open = 0;
    let click = 0;
    let reply = 0;
    let bounce = 0;
    {
        emailtouch.map((touch) => {
            open += touch.noOfEmailsOpened;
            click += touch.noOfEmailsLinksClicked;
            reply += touch.noOfEmailsReplied;
            share += touch.noOfEmailsSent;
            bounce += touch.noOfEmailsBounced;
        })
    }
    let positiveoutcomes = 0;
    let baddata = 0;
    let others = 0;
    {
        calltouch.map((touch) => {
            positiveoutcomes += touch.noOfPositiveConversations;
            baddata += touch.noOfBadData;
            others += touch.otherConversations;
        })
    }

    let paused = 0;
    let completed = 0;
    let unassigned = 0;
    let assigned = 0;
    {
        prospectsData && prospectsData.prospect && prospectsData.prospect.data &&
            prospectsData.prospect.data.map((prospect) => {
                switch (true) {
                    case (prospect.memberStatus == "SUSPEND"):
                        paused = paused + 1;
                        break;
                    case (prospect.memberStatus == "COMPLETED"):
                        completed = completed + 1;
                        break;
                    case (prospect.memberStatus == "NEW"):
                        unassigned = unassigned + 1;
                        break;
                    case (prospect.memberStatus == "INPROGRESS"):
                        assigned = assigned + 1;
                        break;
                }
            })
    }

    let active = 0;
    let inactive = 0;
    let cadencePaused = 0;
    let pendingCalls = 0;
    let pendingEmails = 0;
    {
        cadencesData && cadencesData.accounts && cadencesData.accounts.data &&
            cadencesData.accounts.data.map((cadence, i) => {
                pendingCalls += cadence.callTouchDueCount;
                pendingEmails += cadence.emailTouchDueCount;
                if (cadence.status == "ACTIVE") {
                    active = active + 1;
                }
                else if (cadence.status == "INACTIVE") {
                    inactive = inactive + 1;
                }
                else if (cadence.status == "SUSPEND") {
                    cadencePaused = cadencePaused + 1;
                }
            })
    }

    const handleRenderPrevAccount = () => {
        if (allAccountsData && allAccountsData.accounts && allAccountsData.accounts.data) {
            var currentIndex = allAccountsData.accounts.data.findIndex(account => account.id == accountId);
            if (currentIndex === 0 && !renderPrevAccount) {
                setRenderPrevAccount(true);
                updateQueryParam({ "page[offset]": offset - 1 });
                setOffset(offset - 1);
                fetchAccountsNextPage({
                    variables: { offset: offset - 1 }
                });
                return;
            }
            setRenderPrevAccount(false);
            const prevAccount = allAccountsData.accounts.data[(currentIndex === -1 ? allAccountsData.accounts.data.length : currentIndex) - 1];
            updateAccountView(prevAccount);
        }
    }

    const handleRenderNextAccount = () => {
        if (allAccountsData && allAccountsData.accounts && allAccountsData.accounts.data) {
            var currentIndex = allAccountsData.accounts.data.findIndex(account => account.id == accountId);
            if (currentIndex + 1 === allAccountsData.accounts.data.length) {
                setRenderNextAccount(true);
                updateQueryParam({ "page[offset]": offset + 1 });
                setOffset(offset + 1);
                fetchAccountsNextPage({
                    variables: { offset: offset + 1 }
                });
                return;
            }
            setRenderNextAccount(false);
            const nextAccount = allAccountsData.accounts.data[currentIndex + 1];
            updateAccountView(nextAccount);
        }
    }

    useEffect(() => {
        if (accountToRender == undefined) { fetchAccountsNextPage({ variables: { offset } }); }
    }, []);

    useEffect(() => {
        if (renderNextAccount) {
            handleRenderNextAccount()
        }
        if (renderPrevAccount) {
            handleRenderPrevAccount()
        }
        if (!accountToRender && allAccountsData) {
            updateAccountView(allAccountsData.accounts.data.find(account => account.id == accountId));
        }
    }, [allAccountsData]);

    const updateQueryParam = (param) => {
        const { query } = parseUrl(window.location.search);
        let searchString = Object.entries({ ...query, ...param }).map(([key, val]) => `${key}=${val}`).join("&");
        window.history.replaceState({}, '', "?" + searchString);
    }

    const updateAccountView = (account) => {
        if (account && account.associations && account.associations.prospect) {
            let prospects = account.associations.prospect;
            setAccountId(account.id);
            setAccountToRender(account);
            setProspectToRender(prospects);
            window.history.pushState({}, '', `${account.id}` + window.location.search);
        }
    }

    const handleTabChange = (tabVal) => {
        if (tabVal !== activitiesTab) {
            setActivitiesTab(tabVal);
        }
    }

    return (
        <ContentWrapper>
            <PageHeader pageName="Accounts">
                <Nav>
                    {
                        allAccountsData && allAccountsData.accounts.paging && !renderNextAccount &&
                        <NavItem>
                            <small className="pt-2">
                                {currentAccountIndex + 1} of {allAccountsData.accounts.paging.totalCount} Accounts
                            </small>
                        </NavItem>
                    }
                    <NavItem>
                        <Button color="link" className="btn-sm" onClick={handleRenderPrevAccount} disabled={currentAccountIndex <= 0}>
                            <i className="fas fa-chevron-left"></i>
                        </Button>
                        <Button color="link" className="btn-sm" onClick={handleRenderNextAccount} disabled={allAccountsData && allAccountsData.accounts.paging && allAccountsData.accounts.paging.totalCount == currentAccountIndex + 1}>
                            <i className="fas fa-chevron-right"></i>
                        </Button>
                    </NavItem>
                    <NavItem>
                        <Button
                            color="link"
                            className="btn-sm"
                            onClick={() => history.push(location.state && location.state.origin ? location.state.origin + location.search : "/accounts")}
                        >
                            <i className="fas fa-times text-muted"></i>
                        </Button>
                    </NavItem>
                </Nav>
            </PageHeader>
            {!loading && !error && accountToRender && (
                <Card className="card-default">
                    <CardBody>
                        <ButtonGroup>
                            <Button
                                className={classnames({ active: activitiesTab === 'overview' })}
                                onClick={() => { handleTabChange('overview'); }}
                            >
                                Overview
                            </Button>
                            <Button
                                className={classnames({ active: activitiesTab === 'prospects' })}
                                onClick={() => { handleTabChange('prospects'); }}
                            >
                                Prospects
                            </Button>
                            <Button
                                className={classnames({ active: activitiesTab === 'cadences' })}
                                onClick={() => { handleTabChange('cadences'); }}
                            >
                                Cadences
                            </Button>
                            <Button
                                className={classnames({ active: activitiesTab === 'tasks' })}
                                onClick={() => { handleTabChange('tasks'); }}
                            >
                                Tasks
                            </Button>
                            <Button
                                className={classnames({ active: activitiesTab === 'stats' })}
                                onClick={() => { handleTabChange('stats'); }}
                            >
                                Stats
                            </Button>
                            <Button
                                className={classnames({ active: activitiesTab === 'activity' })}
                                onClick={() => { handleTabChange('activity'); }}
                            >
                                Activity
                            </Button>
                            <Button
                                className={classnames({ active: activitiesTab === 'details' })}
                                onClick={() => { handleTabChange('details'); }}
                            >
                                Details
                            </Button>
                        </ButtonGroup>
                    </CardBody>



                    <TabContent activeTab={activitiesTab}>
                        <TabPane tabId="overview">
                            <Row>
                                <Col><h4>{accountName}</h4></Col>
                                <Col>
                                    <Link to={{ pathname: "/" + accountDomainName }} target="_blank" className="mx-4 px-4">{accountDomainName}</Link>
                                    <Badge className="rounded-circle p-1 px-2 mx-2 text-primary border border-dark" color="light">{userToRender.displayName.charAt(0).toUpperCase()}</Badge>
                                </Col>
                                <Col>
                                    <Nav className="float-right">
                                        <NavItem className="pr-2"><i className="svg trucadence-icon text-muted text-bold mr-2"></i>{cadence.length}</NavItem>
                                        <NavItem className="pr-2"><i className="fas fa-envelope text-muted mr-2"></i>{emailtouch.length}</NavItem>
                                        <NavItem className="pr-2"><i className="fas fa-user-friends text-muted mr-2"></i>{prospectId.length}</NavItem>
                                        <NavItem className="pr-2"><i className="fas fa-phone-alt text-muted mr-2"></i>{calltouch.length}</NavItem>
                                    </Nav>
                                </Col>
                            </Row>
                            <br></br>
                            <Row>
                                <Col>
                                    <CardDeck>
                                        <Card className="card-default">
                                            <CardHeader>
                                                <i className="svg trucadence-icon text-muted text-bold mr-2"></i>Cadences
                                                <i className="fas fa-search-plus text-muted pl-5 ml-5"></i>
                                                <div className="card-tool float-right">
                                                    <i className="fas fa-circle text-success mr-2"></i>{active}
                                                    <i className="far fa-circle ml-2 mr-2"></i>{inactive}
                                                </div>
                                            </CardHeader>
                                            <Scrollable height="160">
                                                <ListGroup>
                                                    {cadencesData && cadencesData.accounts && cadencesData.accounts.data &&
                                                        cadencesData.accounts.data.map((cadence) => {
                                                            let associationTouch = cadence.associations.touch.map((touch) => touch.id);
                                                            let includetouch = cadencesData.accounts.includedAssociations.touch.filter((touch) =>
                                                                associationTouch.indexOf(touch.id) !== -1
                                                            );
                                                            return (<ListGroupItem>
                                                                <ListGroupItemText>{cadence.name}{
                                                                    includetouch.map((touch) => {
                                                                        if (touch.touchType == "EMAIL") {
                                                                            return (<div className="float-right mx-5 px-5"><i className="fas fa-envelope text-muted mr-2 ml-5"></i>Touch #{cadence.touchcount}</div>)
                                                                        }
                                                                        else if (touch.touchType == "CALL") {
                                                                            return (<div className="float-right mx-5 px-5"><i className="fas fa-phone-alt text-muted mr-2 ml-5"></i>Touch #{cadence.touchcount}</div>)
                                                                        }
                                                                        else if (touch.touchType == "OTHERS") {
                                                                            return (<div className="float-right mx-5 px-5"><i className="fas fa-share-alt text-muted mr-2 ml-5"></i>Touch #{cadence.touchcount}</div>)
                                                                        }
                                                                        else if (touch.touchType == "LINKEDIN") {
                                                                            return (<div className="float-right mx-5 px-5"><i className="fab fa-linkedin-in text-muted mr-2 ml-5"></i>Touch #{cadence.touchcount}</div>)
                                                                        }
                                                                        else return (<></>)
                                                                    })
                                                                }
                                                                </ListGroupItemText>
                                                            </ListGroupItem>);
                                                        })
                                                    }
                                                </ListGroup>
                                            </Scrollable>
                                        </Card>
                                        <Card className="card-default">
                                            <CardHeader>
                                                <i className="fas fa-envelope text-muted mr-2"></i>Emails
                                                <i className="fas fa-search-plus text-muted pl-5 ml-5"></i>
                                                <div className="card-tool float-right">
                                                    <i className="fas fa-share mr-2"></i>{share}
                                                    <i className="fas fa-envelope-open ml-2 mr-2"></i>{open}
                                                    <i className="fas fa-hand-pointer ml-2 mr-2"></i>{click}
                                                    <i className="fas fa-reply ml-2 mr-2"></i>{reply}
                                                    <i className="fas fa-tachometer-alt ml-2 mr-2"></i>{pendingEmails}
                                                    <i className="fas fa-sign-in-alt ml-2 mr-2"></i>{bounce}
                                                </div>
                                            </CardHeader>
                                            <Scrollable height="160">
                                                <ListGroup>
                                                    <ListGroupItem>
                                                        <ListGroupItemHeading>
                                                            <strong>Template 1 description of a template name</strong>
                                                        </ListGroupItemHeading>
                                                        <ListGroupItemText>
                                                            Quick follow up - Hello, This is an introduction of how....
                                                        </ListGroupItemText>
                                                    </ListGroupItem>
                                                    <ListGroupItem>
                                                        <ListGroupItemHeading>
                                                            <strong>Template 2 description of a template name</strong>
                                                        </ListGroupItemHeading>
                                                        <ListGroupItemText>
                                                            Quick follow up - Hello, This is an introduction of how....
                                                        </ListGroupItemText>
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </Scrollable>
                                        </Card>
                                    </CardDeck>
                                </Col>
                            </Row>
                            <br></br>
                            <Row>
                                <Col>
                                    <CardDeck>
                                        <Card className="card-default">
                                            <CardHeader>
                                                <i className="fas fa-user-friends text-muted mr-2"></i>Prospects
                                                <i className="fas fa-search-plus text-muted pl-5 ml-5"></i>
                                                <div className="card-tool float-right">
                                                    <i className="fas fa-user-friends mr-2"></i>{prospectId.length}
                                                    <i className="fas fa-question-circle ml-2 mr-2"></i>{unassigned}
                                                    <i className="fas fa-pause ml-2 mr-2"></i>{paused}
                                                    <i className="fas fa-check-double ml-2 mr-2"></i>{completed}
                                                    <i className="fas fa-tachometer-alt ml-2 mr-2"></i>{assigned}
                                                </div>
                                            </CardHeader>
                                            <Scrollable height="160">
                                                <ListGroup>
                                                    {prospectsData && prospectsData.prospect && prospectsData.prospect.data &&
                                                        prospectsData.prospect.data.map((prospect, i) => {
                                                            return <ListGroupItem key={i}>
                                                                <ListGroupItemText>{prospect.firstName} {prospect.lastName}</ListGroupItemText>
                                                                <ListGroupItemText>{prospect.title}</ListGroupItemText>
                                                            </ListGroupItem>
                                                        })
                                                    }
                                                </ListGroup>
                                            </Scrollable>
                                        </Card>
                                        <Card className="card-default">
                                            <CardHeader>
                                                <i className="fas fa-phone-alt text-muted mr-2"></i>Calls
                                                <i className="fas fa-search-plus text-muted pl-5 ml-5"></i>
                                                <div className="card-tool float-right">
                                                    <i className="fas fa-check-double text-success mr-2"></i>{positiveoutcomes}
                                                    <i className="fas fa-circle text-danger ml-2 mr-2"></i>{baddata}
                                                    <i className="far fa-circle ml-2 mr-2"></i>{others}
                                                    <i className="fas fa-tachometer-alt ml-2 mr-2"></i>{pendingCalls}
                                                </div>
                                            </CardHeader>
                                            <Scrollable height="160">
                                                <ListGroup>
                                                    <ListGroupItem className="justify-content-between">
                                                        <small className="text-muted pt-2 float-left">19 hrs</small>
                                                        <Badge pill className="float-left bg-white rounded-circle border border-dark p-2 mr-2 ml-2">
                                                            <i className="fa-1x fas fa-phone-alt text-info"></i>
                                                        </Badge>
                                                        <div className="float-left ml-2">
                                                            <ListGroupItemText><strong>Phone Call</strong> to Daymond John</ListGroupItemText>
                                                            <ListGroupItemText><strong className="text-warning">Meeting Scheduled</strong></ListGroupItemText>
                                                            <ListGroupItemText><small>05/06/2019 10:48 AM</small></ListGroupItemText>
                                                        </div>
                                                    </ListGroupItem>
                                                    <ListGroupItem className="justify-content-between">
                                                        <small className="text-muted pt-2 float-left">1 Day</small>
                                                        <Badge pill className="float-left bg-white rounded-circle border border-dark p-2 mr-2 ml-2">
                                                            <i className="fa-1x fas fa-phone-alt text-info"></i>
                                                        </Badge>
                                                        <div className="float-left ml-2">
                                                            <ListGroupItemText><strong>Phone Call</strong> to Daymond John</ListGroupItemText>
                                                            <ListGroupItemText><strong className="text-warning">Got Referral</strong></ListGroupItemText>
                                                            <ListGroupItemText><small>05/06/2019 2:49 PM</small></ListGroupItemText>
                                                        </div>
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </Scrollable>
                                        </Card>
                                    </CardDeck>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="prospects">
                            <Row>
                                <Col>
                                    <Card>
                                        <CardBody>
                                            <AccountProspectsGrid
                                                data={accountsProspectGridData}
                                                prospectsData={prospectsData}
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="cadences">
                            <AccountCadencesGrid
                                data={accountsCadenceGridData}
                                cadencesData={cadencesData}
                            />
                        </TabPane>
                        <TabPane tabId="tasks">
                            <AccountTasksGrid
                                data={accountsTaskGridData}
                                taskData={taskData}
                            />
                        </TabPane>
                        <TabPane tabId="stats">
                            <AccountStatsGrid
                                cadenceGridData={accountsCadenceGridData}
                                cadencesData={cadencesData}
                                prospectGridData={accountsProspectGridData}
                                prospectsData={prospectsData}
                            />
                        </TabPane>
                        <TabPane tabId="activity">
                            <AccountActivityGrid />
                        </TabPane>
                        <TabPane tabId="details">
                            <Card>
                                <CardBody>
                                    <ListGroup>
                                        <ListGroupItem>
                                            <ListGroupItemText>Accounts Name
                                                        <span className="float-right mx-5 px-5">{accountName}</span>
                                            </ListGroupItemText>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <ListGroupItemText>Owner
                                                        <span className="float-right mx-5 px-5">{userToRender.displayName}</span>
                                            </ListGroupItemText>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <ListGroupItemText>Domain Name
                                                        <span className="float-right mx-5 px-5">{accountDomainName}</span>
                                            </ListGroupItemText>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <ListGroupItemText>Tag
                                                    <span className="float-right mx-5 px-5">{tagName}</span>
                                            </ListGroupItemText>
                                        </ListGroupItem>
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </TabPane>
                    </TabContent>
                </Card>)}
            { !accountToRender &&
                (
                    <Card className="card-default">
                        <Alert color="danger" className="mb-0 text-center">
                            <h4>
                                <i className="fas fa-exclamation-circle fa-lg mr-2"></i>No acccount available
                            </h4>
                        </Alert>
                    </Card>
                )}
        </ContentWrapper>
    );
};

export default AccountView;
