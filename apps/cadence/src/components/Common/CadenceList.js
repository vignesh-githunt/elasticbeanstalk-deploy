/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { getAllCadences } from "../../store/actions/actions";
import UserContext from "../UserContext";
import DropDown from "../Common/DropDown";

const CadenceList = ({ getAllCadences, cadences, ref, value, multiselect, onChange, placeHolder, handleAdd }) => {
    const { user, loading: userLoading } = useContext(UserContext);
    const currentUserId = userLoading ? 0 : user.id;
    const dropDownRef = React.useRef();

    useEffect(() => {
        if (!cadences)
            getAllCadences(currentUserId);
    }, []);

    const handleRefresh = () => {
        getAllCadences(currentUserId);
    }

    let data = cadences.data &&
        cadences.data.map((cadence) => {
            return (
                { 'text': cadence.name, 'value': cadence.id, 'active': false }
            );
        });

    return (
        <DropDown
            data={data}
            ref={dropDownRef}
            value={value}
            onChange={onChange}
            placeHolder={cadences.error ? "Failed to fetch" : placeHolder}
            multiselect={multiselect}
            handleAdd={handleAdd}
            handleRefresh={handleRefresh}
            loading={cadences.loading}
            error={cadences.error}
        />
    )
}

const mapStateToProps = (state) => ({
    cadences: state.cadences,
});

CadenceList.defaultProps = {
    placeHolder: "Select Cadence" // this prop is used act as a default placeholder if we are not passing from parent component
}

CadenceList.propTypes = {
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
export default connect(mapStateToProps, { getAllCadences })(CadenceList);