import React,{useState} from 'react';
import {ContentWrapper} from '../Layout/ContentWrapper';
import { Card, CardBody } from 'reactstrap';
// Calendar
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import {Calendar,momentLocalizer} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import events from './Calendar.events'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

// Setup the localizer by providing the moment
Calendar.momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(Calendar)

const localizer = Calendar.momentLocalizer(moment)

const BigCalendar = (props) => {
    const [events,setEvents] = useState(events);

    const moveEvent=({ event, start, end })=> {
        const { events } = props

        const idx = events.indexOf(event)
        const updatedEvent = { ...event, start, end }

        const nextEvents = [...events]
        nextEvents.splice(idx, 1, updatedEvent)
       
        setEvents(nextEvents)
       
        console.log(`${event.title} was dropped onto ${event.start}`)
    }

    const selectEvent = event => {
        if(event.url)
            alert(`Event can redirect to: ${event.url}`)
    };

    const parseStyleProp = ({style}) => style ? { style } : {}

    const resizeEvent = (resizeType, { event, start, end }) => {
        const { events } = props

        const nextEvents = events.map(existingEvent => {
          return existingEvent.id === event.id
            ? { ...existingEvent, start, end }
            : existingEvent
        })
        
        setEvents(nextEvents)
        
        console.log(`${event.title} was resized to ${start}-${end}`)
    }

    return (
        <ContentWrapper>
            <div className="content-heading">
               <div>Big Calendar
                  <small>React gcal/outlook like calendar component</small>
               </div>
            </div>
            { /* START row */ }
            <div className="calendar-app">
                { /* START panel */ }
                <Card className="card-default">
                    <CardBody>
                        { /* START calendar */ }
                        <DragAndDropCalendar
                                localizer={localizer}
                                style={{minHeight: 500}}
                                selectable
                                events={events}
                                onEventDrop={moveEvent}
                                resizable
                                onEventResize={resizeEvent}
                                onSelectEvent={selectEvent}
                                defaultView="month"
                                defaultDate={new Date()}
                                eventPropGetter={parseStyleProp}
                              />
                        { /* END calendar */ }
                    </CardBody>
                </Card>
                { /* END panel */ }
            </div>
        </ContentWrapper>
        );
}

export default  DragDropContext(HTML5Backend)(BigCalendar);