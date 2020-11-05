/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { getAllTags } from "../../store/actions/actions";
import UserContext from "../UserContext";
import DropDown from "./DropDown";

const TagList = ({ getAllTags, tags, value, multiselect, onChange, placeHolder, handleAdd, handleFilter }) => {

    const { user, loading: userLoading } = useContext(UserContext);
    const currentUserId = userLoading ? 0 : user.id;
    const dropDownRef = React.useRef();
    useEffect(() => {
        if (!tags)
            getAllTags(currentUserId);
    }, []);

    let data = tags.data &&
        tags.data.map((tag) => {
            return (
                { 'text': tag.name, 'value': tag.id, 'active': value && multiselect && value.indexOf(tag.id) !== -1 ? true : value === tag.id ? true : false }
            );
        });

    const handleRefresh = () => {
        getAllTags(currentUserId);
    }

    if (handleFilter && data.length > 0) {
        data = data.filter(cadence => handleFilter(cadence));
    }

    return (
        <DropDown
            data={data}
            ref={dropDownRef}
            value={value}
            onChange={onChange}
            placeHolder={tags.error ? "Failed to fetch" : placeHolder}
            multiselect={multiselect}
            handleAdd={handleAdd}
            handleRefresh={handleRefresh}
            loading={tags.loading}
            error={tags.error}
        />
    )

}
const mapStateToProps = (state) => ({
    tags: state.tags
});

TagList.defaultProps = {
    placeHolder: "Select Tag" // this prop is used act as a default placeholder if we are not passing from parent component
}
TagList.propTypes = {
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
export default connect(mapStateToProps, { getAllTags })(TagList);