/**
 * @author @rajesh-thiyagarajan
 * @createdOn 14.08.2020
 * @description By using this component we can achive the All, None, Single Select, MultiSelect ,Search, Fiter, Add Option,loading icon, refresh icon to the dropdown
 * @version V11.0
 */
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input } from 'reactstrap';
import PropTypes from 'prop-types';

const DropwDown = React.forwardRef((props, ref) => {
    const multiselect = props.multiselect;
    const [selected, setSelected] = useState(props.value ? props.value : multiselect ? [] : '');
    const [hidden, setHidden] = useState("none");
    const hideDropDownItem = { "display": hidden };
    const [options, setOptions] = useState(props.data);
    const [dropdownOpen, setOpen] = useState(false);
    let dataType = 'string';
    const toggle = () => {
        setOpen(!dropdownOpen);
        props.data && props.data.forEach((option) => {
            if (!multiselect && selected !== option.value) option.active = false;
        });
        setOptions(props.data);
        setHidden('none');
    }
    const dropDownModifier = {
        setMaxHeight: {
            enabled: true,
            fn: (data) => {
                return {
                    ...data,
                    styles: {
                        ...data.styles,
                        overflow: 'auto',
                        maxHeight: '250px',
                    },
                };
            },
        },
    }

    const getInitialPlaceHolder = (value) => {
        if( (multiselect && value.length > 0 ) || ( value && options && !props.error ) )
            return options.filter(function (option) {
                if (multiselect && value.indexOf(option.value) !== -1 || value === option.value)
                    return value
            }).map(data => data.text).join(' ,');
        else
            return props.placeHolder;
    }

    //-----Handle Block Start-----//

    const handleSelected = (e) => {

        let target = e.target;
        let tempOptionsArr = props.data;
        let isOptionDeSelected = target.classList.value.includes("active");
        let optionText = target.textContent;
        let optionValue = dataType === 'number' ? parseInt(target.value) : target.value;
        let selectedOption;

        tempOptionsArr.forEach((option) => {
            if (!multiselect) option.active = false;
            if (option.value === optionValue) option.active = !option.active;
        });

        if (multiselect) {
            let label = placeHolder;
            selectedOption = selected;
            let index = selectedOption.indexOf(optionValue);
            if (index !== -1) {
                selectedOption.splice(index, 1);
                label = label.split(',').map(s => s.trim());
                label = label.filter(data => { return data !== optionText }).join(', ');
            } else {
                selectedOption.push(optionValue);
                label = label !== props.placeHolder ? label + ', ' + optionText : optionText;
            }
            setPlaceHolder(label !== "" ? label : props.placeHolder);
        } else {
            setPlaceHolder(optionText);
            selectedOption = optionValue;
        }

        setOptions(tempOptionsArr);
        setSelected(selectedOption);
        target.classList = isOptionDeSelected ? target.classList.value.replace("active", "") : target.classList.value + " active";
        // Call the Parent onChange function to get the selected option value
        if (props.onChange)
            props.onChange(selectedOption);
    }

    const handleFilterSearch = (e) => {
        let value = e.target.value.trim();
        let tempOptionsArr = props.data;
        if (value) {
            tempOptionsArr = tempOptionsArr.filter(function (option) {
                return option.text.toLowerCase().includes(value.toLowerCase())
            });
            handleUpdateOptions();
            setOptions(tempOptionsArr);
            if (tempOptionsArr.length > 0) {
                setFilterText("");
                setHidden("none");
            } else {
                setFilterText(value);
                setHidden("block");
            }
        } else {
            handleUpdateOptions();
            setOptions(props.data);
            setFilterText("");
            setHidden("none");
        }
    }

    const handleUpdateOptions = () => {
        if (multiselect) {
            props.data.forEach(function (option) {
                if (selected.indexOf(option.value) !== -1)
                    option.active = true;
            });
        } else {
            props.data.forEach(function (option) {
                if (selected === option.value)
                    option.active = true;
            });
        }
    }

    const handleRefresh = () => {
        if (dropdownOpen)
            setOpen(!dropdownOpen);
        setSelected(props.value ? props.value : multiselect ? [] : '');
        setPlaceHolder(getInitialPlaceHolder(props.value))
        props.handleRefresh();
    }

    const handleAllAndNone = (value) => {
        if (value === "All") {
            let selectedOption = selected;
            let label = placeHolder;
            options.forEach(function (option) {
                option.active = true;
                selectedOption.push(option.value);
                label = label !== props.placeHolder ? label + ', ' + option.text : option.text;

            });
            setSelected(selectedOption);
            props.onChange(selectedOption);
            setPlaceHolder(label !== "" ? label : props.placeHolder);
        } else {
            props.data.forEach(function (option) {
                option.active = false;
            });
            setOptions(props.data)
            setSelected([]);
            setPlaceHolder(props.placeHolder)
        }
    }
    //-----Handle Block End-----//

    const [filterText, setFilterText] = useState("");
    const [placeHolder, setPlaceHolder] = useState(getInitialPlaceHolder(props.value));

    useEffect(() => {
        if (ref && ref.current) {
            ref.current.value = selected;
        }
    }, [])

    return (
        <>
            <Dropdown isOpen={!props.loading && !props.error && dropdownOpen} toggle={toggle} ref={ref} disabled={props.loading || props.error}>
                <ButtonGroup className="w-100">
                    <DropdownToggle caret block className={props.error ? "overflow-hidden border border-danger" : "overflow-hidden"} title={placeHolder} disabled={props.loading || props.error}>
                        <div className="react-select-box-label mb-n1">{placeHolder}</div>
                    </DropdownToggle>
                    {props.loading &&
                        <Button>
                            <i className="fa fa-spinner fa-spin"></i>
                        </Button>
                    }
                    {!props.loading && props.handleRefresh &&
                        <Button onClick={handleRefresh}>
                            <i className="fas fa-sync-alt"></i>
                        </Button>
                    }
                </ButtonGroup>
                {props.data && props.data.length > 0 &&
                    <DropdownMenu modifiers={dropDownModifier}>

                        <DropdownItem header>
                            <Input onChange={props.handleSearch ? props.handleSearch : handleFilterSearch} />
                        </DropdownItem>

                        {multiselect &&
                            <>
                                <DropdownItem onClick={(e) => { handleAllAndNone(e.target.value) }} value={"All"} toggle={false}>All</DropdownItem>
                                <DropdownItem onClick={(e) => { handleAllAndNone(e.target.value) }} value={"None"} toggle={false}>None</DropdownItem>
                            </>
                        }
                        {
                            options && options.map(function (option, i) {
                                dataType = typeof option.value;
                                return (
                                    <DropdownItem value={option.value} key={i} onClick={(e) => { handleSelected(e) }} toggle={!multiselect} className={multiselect && selected.indexOf(option.value) !== -1 ? "active" : selected === option.value ? "active" : option.active ? "active" : ""}  >
                                        {option.text}
                                    </DropdownItem>
                                )

                            })
                        }
                        {props.handleSearch ?
                            <DropdownItem toggle={false}>{`Searching...`}</DropdownItem>
                            :
                            <DropdownItem style={hideDropDownItem} toggle={false}>{`No Results Matched "${filterText}"`}</DropdownItem>
                        }
                        {props.handleAdd &&
                            <>
                                <DropdownItem style={hideDropDownItem} toggle={false} divider></DropdownItem>
                                <DropdownItem style={hideDropDownItem} toggle={false} value={filterText} onClick={props.handleAdd}>{`Add ${filterText}`}</DropdownItem>
                            </>
                        }
                    </DropdownMenu>
                }
            </Dropdown>
        </>
    )
});
DropwDown.defaultProps = {
    multiselect: false,
    disabled: false,
    value: '',
}

DropwDown.propTypes = {
    disabled: PropTypes.bool, //If false dropdown is enabled else true dropwdown is disabled
    multiselect: PropTypes.bool, //Prop used to dropdown with multiselection , default single select (default false else true)
    onChange: PropTypes.func, // onchange function is used to get the selected dropdown value
    data: PropTypes.array, // data prop is used to load the options in the dropdown component
    handleSearch: PropTypes.func, //handle search function is used to search the dropdown value in server side
    handleAdd: PropTypes.func, // handle add function is used to add a new option from the frontend
    loading: PropTypes.bool, // If true request loading else false
    handleRefresh: PropTypes.func, // handle refresh function is used to refetch the dropdown value
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array
    ]),//value prop is used to default selection for the doropwdown
}

export default DropwDown;