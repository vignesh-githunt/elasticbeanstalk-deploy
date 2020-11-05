import React, { useEffect,useRef } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

// Datatables
require('datatables.net-bs')
require('datatables.net-bs4/js/dataTables.bootstrap4.js')
require('datatables.net-bs4/css/dataTables.bootstrap4.css')
require('datatables.net-buttons')
require('datatables.net-buttons-bs')
require('datatables.net-responsive')
require('datatables.net-responsive-bs')
require('datatables.net-responsive-bs/css/responsive.bootstrap.css')
require('datatables.net-buttons/js/buttons.colVis.js') // Column visibility
require('datatables.net-buttons/js/buttons.html5.js') // HTML 5 file export
require('datatables.net-buttons/js/buttons.flash.js') // Flash file export
require('datatables.net-buttons/js/buttons.print.js') // Print view button
require('datatables.net-keytable');
require('datatables.net-keytable-bs/css/keyTable.bootstrap.css')
require('jszip/dist/jszip.js');
require('pdfmake/build/pdfmake.js');
require('pdfmake/build/vfs_fonts.js');

/**
 * Wrapper component for dataTable plugin
 * Only DOM child elements, componets are not supported (e.g. <Table>)
 */

const Datatable = (props) => {
    const tableElement = useRef();
    useEffect(() => {
        const dtInstance = $(tableElement.current).dataTable(props.options);

        if(props.dtInstance)
            props.dtInstance(dtInstance)

            return () => {
                $(tableElement.current).dataTable({destroy: true});
               }
    },[])

    const setRef = node => tableElement.current = node;

    return (
        React.cloneElement(React.Children.only(props.children), {
            ref: setRef
        })
    )
 }
 Datatable.propTypes = {
    /** datatables options object */
    options: PropTypes.object,
    /** only one children allowed */
    children: PropTypes.element.isRequired,
    /** callback that receives the datatable instance as param */
    dtInstance: PropTypes.func
}
Datatable.defaultProps = {
    options: {}
}
export default Datatable;