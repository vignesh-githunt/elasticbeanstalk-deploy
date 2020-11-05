import React, {useState} from 'react';
import {ContentWrapper} from '../Layout/ContentWrapper';
import { Container, Progress } from 'reactstrap';
import ReactDataGrid from 'react-data-grid';

// Custom Formatter component
const PercentCompleteFormatter = props => (
    <Progress color={props.value < 30 ? 'danger' : props.value < 60 ? 'warning' : 'success'}
        value={props.value}> {props.value}%
    </Progress>
)

const AssignedImageFormatter = props => (
    <div className="text-center py-2">
        <img src={props.value} className="img-fluid thumb32" alt="avatar"/>
    </div>
)

const DataGrid = (props)=>{
    const _columns = [
        {
            key: 'id',
            name: 'ID',
            width: 80
        },
        {
            key: 'task',
            name: 'Title',
            sortable: true
        },
        {
            key: 'assigned',
            name: 'Assigned',
            width: 70,
            formatter: AssignedImageFormatter
        },
        {
            key: 'priority',
            name: 'Priority',
            sortable: true
        },
        {
            key: 'issueType',
            name: 'Issue Type',
            sortable: true
        },
        {
            key: 'complete',
            name: '% Complete',
            formatter: PercentCompleteFormatter,
            sortable: true
        },
        {
            key: 'startDate',
            name: 'Start Date',
            sortable: true
        },
        {
            key: 'completeDate',
            name: 'Expected Complete',
            sortable: true
        }
    ];
    const getRandomDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
    };

    const createRows = () => {
        let rows = [];
        for (let i = 1; i < 100; i++) {
            rows.push({
                id: i,
                task: 'Task ' + i,
                assigned: `img/user/0${(Math.floor(Math.random()*8) + 1)}.jpg`,
                complete: Math.min(100, Math.round(Math.random() * 110)),
                priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
                issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
                startDate: getRandomDate(new Date(2018, 3, 1), new Date()),
                completeDate: getRandomDate(new Date(), new Date(2021, 0, 1))
            });
        }

        return rows;
    };
    const INITIAL_STATE = {originalRows : createRows(1000),rows : originalRows.slice(0)};
    const [myState, setMyState] = useState(INITIAL_STATE)
    const { originalRows, rows } = myState;

  

   const rowGetter = (i) => props.rows[i]

   const handleGridSort = (sortColumn, sortDirection) => {
        const comparer = (a, b) => {
          if (sortDirection === 'ASC') {
            return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
          } else if (sortDirection === 'DESC') {
            return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
          }
        };

        const rows = sortDirection === 'NONE' ? props.originalRows.slice(0) : props.rows.sort(comparer);
        
        setMyState({rows})
    };
    return  (
        <ContentWrapper>
            <div className="content-heading">
                <div>React Data Grid
                    <small>Excel-like grid component built with React</small>
                </div>
            </div>
            <Container fluid>
                <ReactDataGrid
                    onGridSort={handleGridSort}
                    columns={_columns}
                    rowGetter={rowGetter}
                    rowsCount={props.rows.length}
                    minHeight={700} />
            </Container>
        </ContentWrapper>
    )
}

export default DataGrid;