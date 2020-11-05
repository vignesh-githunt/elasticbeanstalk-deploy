import React, { useContext, useState } from "react";
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { ButtonDropdown,ButtonGroup, DropdownMenu, DropdownItem,DropdownToggle  } from "reactstrap";
import { parseUrl } from "query-string";
import {
  FETCH_PROSPECTS_COUNT_QUERY,
} from '../../queries/ProspectsQuery';
import FilterButton from "../../Common/FilterButton";
import UserContext from "../../UserContext";

const CadenceReportGrid = ({ pinnedFilterButton,filterButtons,cadenceID}) => {

  const { query: searchParams } = parseUrl(window.location.search);
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);
  const { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const userFilter = '&filter[user][id]=' + currentUserId;
  const [prospectsFilter, setProspectsFilter] = useState(`&filter[user][id]=${currentUserId}&filter[cadence][id]=${cadenceID}`);
  const showFilter=filterButtons.slice(0,4)
  const dropdownFilter=filterButtons.slice(4)
  const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
  const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [activeTab, setActiveTab] = useState(filterButtons.indexOf(searchParams["filter[memberStatus]"]) > -1 ? searchParams["filter[memberStatus]"] : (filterButtons.indexOf(pinnedFilterButton) > -1 ? pinnedFilterButton : filterButtons[0]));
  
  const { data: prospectsCount, loading: prospectsCountLoading, error: prospectsCountError, refetch: refetchProspectsCount } = useQuery(FETCH_PROSPECTS_COUNT_QUERY, {
    variables: { userFilter,prospectFilter: prospectsFilter, },
    notifyOnNetworkStatusChange: true
  });

  const handleProspectTabChange = (e) => {
    e.preventDefault();

    const tabValue = e.currentTarget.getAttribute('data-tab-value');

    setActiveTab(tabValue);
    setOffset(0);
    setCurrentPageIndex(0);

    if (!currentUrlStatePushed) {
      window.history.pushState({}, '', window.location.href);

      setCurrentUrlStatePushed(true);
    }

    const { query } = parseUrl(window.location.search);
    query["filter[memberStatus]"] = tabValue;

    let filterQry = Object.entries({ ...query, "filter[user][id]": currentUserId }).filter(([key]) => key.startsWith("filter")).map(([key, val]) => `${key}=${val}`).join("&")
    setProspectsFilter(filterQry === "" ? "" : "&" + filterQry);

    let searchString = Object.entries(query).map(([key, val]) => `${key}=${val}`).join("&");

    window.history.replaceState({}, '', "?" + searchString);
  }

  return (
    <div>
      <ButtonGroup>
        {
          showFilter.map((filter,index)=>{
            return(
            <FilterButton key={index}
              active={activeTab === filter}
              count={prospectsCount ? prospectsCount.all.paging.totalCount : 0}
              countError={prospectsCountError}
              countLoading={prospectsCountLoading}
              data-tab-value={filter}
              handleClick={handleProspectTabChange}
              >
              {filter}
            </FilterButton>
            )
          })
        }
    
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} title="More filters" >
        <DropdownToggle>
          <i className="fas fa-angle-double-right"></i>
        </DropdownToggle>
        <DropdownMenu>
          {
            dropdownFilter.map((filter,index)=>{
              return(
              <DropdownItem tag="span" className="px-0" >
                <FilterButton style={{border:'none'}}
                  key={index}
                  active={activeTab === filter}
                  count={prospectsCount ? prospectsCount.all.paging.totalCount : 0}
                  countError={prospectsCountError}
                  countLoading={prospectsCountLoading}
                  data-tab-value={filter}
                  handleClick={handleProspectTabChange}
                >
                  {filter}
                </FilterButton>
              </DropdownItem>
              )
            })
          }
        </DropdownMenu>
      </ButtonDropdown>
    </ButtonGroup>
    </div>
  );
};

export default CadenceReportGrid;