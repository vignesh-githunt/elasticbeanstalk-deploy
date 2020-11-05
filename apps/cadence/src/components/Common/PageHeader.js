import React from 'react';
import PropTypes from 'prop-types'

const PageHeader = ({icon, pageName, ...props}) => {

    return(
        <div className="content-heading">
            <div>
                {  icon && <i className={`${icon} mr-2`}></i>}
                { pageName }
            </div>
            {props.children && <div className="ml-auto">{props.children}</div>}
        </div>
    );
}

PageHeader.propTypes = {
    pageName:PropTypes.string.isRequired,
    icon: PropTypes.string,
    children: PropTypes.element
};

export default PageHeader;