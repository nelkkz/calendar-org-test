/*
 * @Author: richard.wilson 
 * @Date: 2020-05-09 07:38:02 
 * @Last Modified by: richard.wilson
 * @Last Modified time: 2021-03-05 18:00:21
 */

import * as React from 'react';
import { useState } from 'react';
import {IInputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import { Calendar, momentLocalizer, Event, View, ViewsProps, Culture  } from 'react-big-calendar-ex'
import GetMessages from './Translations'
import * as moment from 'moment'
import * as lcid from 'lcid';
import * as Color from 'color'
import {MobileToolbar, ToolbarColor} from './MobileToolbar'
import { inherits } from 'util';
import { FaHeart, FaSmile  } from "react-icons/fa";
import ReactTooltip from 'react-tooltip';
import PureModal from 'react-pure-modal';

var CustomWorkWeek = require('./MyWorkWeek');
var isHexColor = require('is-hexcolor');

export interface IProps {
    pcfContext: ComponentFramework.Context<IInputs>,
    onClickSelectedRecord: (recordId: string) => void,
    onClickSlot: (start: Date, end: Date, resourceId: string) => void,
    onCalendarChange: (date: Date, rangeStart: Date, rangeEnd: Date, view: View) => void,
}

//extend the event interface to include additional properties we wil use.
interface IEvent extends Event{
    id?: string,
    color?: string,
    filterType? : string, 
    icon?: string,
}

const allViews  = ['month' , 'week' , 'agenda'] as string[];

export const CalendarControl: React.FC<IProps> = (props) => {      
const eventDefaultBackgroundColor = Color(isHexColor(props.pcfContext.parameters.eventDefaultColor?.raw || '') ? props.pcfContext.parameters.eventDefaultColor.raw as string : '#3174ad');
const calendarTodayBackgroundColor = Color(isHexColor(props.pcfContext.parameters.calendarTodayBackgroundColor?.raw || '') ? props.pcfContext.parameters.calendarTodayBackgroundColor.raw as string : '#eaf6ff');
const calendarTextColor = Color(isHexColor(props.pcfContext.parameters.calendarTextColor?.raw || '') ? props.pcfContext.parameters.calendarTextColor.raw as string : '#666666');
const calendarBorderColor = Color(isHexColor(props.pcfContext.parameters.calendarBorderColor?.raw || '') ? props.pcfContext.parameters.calendarBorderColor.raw as string : '#dddddd');
const calendarTimeBarBackgroundColor = Color(isHexColor(props.pcfContext.parameters.calendarTimeBarBackgroundColor?.raw || '') ? props.pcfContext.parameters.calendarTimeBarBackgroundColor.raw as string : '#ffffff');
const calendarViews = getCalendarViews(props.pcfContext);
const weekStartDay = props.pcfContext.parameters.calendarWeekStart?.raw || null;
const calendarCulture = getISOLanguage(props.pcfContext);

ToolbarColor.textColor = calendarTextColor;
ToolbarColor.borderColor = calendarBorderColor;

//set our moment to the current calendar culture for use of it outside the calendar.
const localizer = momentLocalizer(moment);
//customize the momentLocalizer to utilize our week start day property.
localizer.startOfWeek = (culture: Culture) => {
      if (weekStartDay && weekStartDay > 0) return weekStartDay - 1;
      var data = culture ? moment.localeData(culture) : moment.localeData();
      return data ? data.firstDayOfWeek() : 0;
}

const calendarMessages = GetMessages(calendarCulture);
const calendarRtl = props.pcfContext.userSettings.isRTL;
const calendarScrollTo = moment().set({"hour": props.pcfContext.parameters.calendarScrollToTime?.raw || 0, "minute": 0, "seconds" : 0}).toDate();

const [calendarView, setCalendarView] = React.useState(getCalendarView(calendarViews, props.pcfContext.parameters.calendarView?.raw || ""));
const [calendarData, setCalendarData] = React.useState<{resources: any[] | undefined, events: IEvent[], keys: any}>({resources: [], events: [], keys: undefined});
const [calendarDataSave, setCalendarDataSave] = React.useState<{resources: any[] | undefined, events: IEvent[], keys: any}>({resources: [], events: [], keys: undefined});

const [calendarDate, setCalendarDate] = React.useState(props.pcfContext.parameters.calendarDate?.raw?.getTime() === 0 ? moment().toDate() : (props.pcfContext.parameters.calendarDate?.raw || moment().toDate()));
const calendarRef = React.useRef(null);

const [modal, setModal] = useState(false);
const [modalEvents, setModalEvents] = React.useState<IEvent[]>([]);

type AppProps = {
    modal: boolean;
    modalEvents: IEvent[];
}

const ModalWithEvents = ({modal, modalEvents}: AppProps) => {
    return (<PureModal
    header="Event List"
    isOpen={modal}
    closeButton="close"
    closeButtonPosition="header"
    onClose={() => {
      setModal(false);
      return true;
    }}
  >
  <ul className='event-list'>
        {modalEvents.map((data) => (
            <li>
                <a data-tip data-for={data.title}>{data.title}</a>
                <ReactTooltip id={data.title as string} place="top" type="dark" effect="float">
                    <div>
                        {data.title}
                    </div>
                    <div>
                    {data.icon === 'icon1'?  <FaHeart style={{color: 'red', fontSize: '18px'}}/> : <FaSmile style={{color: 'yellow', fontSize: '18px'}}/>}
                    </div>
                    </ReactTooltip>
            </li>
        ))}
      </ul>
  </PureModal>)

}

const dummyData = [
    {
        start: moment().toDate(),
        end: moment().add(1, "hours").toDate(),
        title: "Event 1",
        icon: "icon1",
        filterType: "frontdesk" ,
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "hours").toDate(),
        title: "Event 2",
        icon: "icon1",
        filterType: "frontdesk" ,
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "hours").toDate(),
        title: "Event 3",
        icon: "icon1",
        filterType: "frontdesk" ,
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "hours").toDate(),
        title: "Event 4",
        icon: "icon1",
        filterType: "frontdesk" ,
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "hours").toDate(),
        title: "Event 5",
        icon: "icon1",
        filterType: "frontdesk" ,
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "hours").toDate(),
        title: "Event 6",
        icon: "icon1",
        filterType: "frontdesk" ,
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "hours").toDate(),
        title: "Event 7",
        icon: "icon1",
        filterType: "frontdesk" ,
    },
    {
        start: moment().add(3, "days").toDate(),
        end:  moment().add(1, "days").add(1, "hours").toDate(),
        title: "Event AA",
        icon: "icon2",
        filterType: "coach"
    },
    {
        start: moment().add(1, "days").toDate(),
        end:  moment().add(1, "days").add(1, "hours").toDate(),
        title: "Event A",
        icon: "icon2",
        filterType: "coach"
    },
    {
        start: moment().add(1, "days").toDate(),
        end:  moment().add(1, "days").add(1, "hours").toDate(),
        title: "Event B",
        icon: "icon2",
        filterType: "coach"
    },
    {
        start: moment().add(1, "days").toDate(),
        end:  moment().add(1, "days").add(1, "hours").toDate(),
        title: "Event C",
        icon: "icon2",
        filterType: "coach"
    },
    {
        start: moment().add(1, "days").toDate(),
        end:  moment().add(1, "days").add(1, "hours").toDate(),
        title: "Event D",
        icon: "icon2",
        filterType: "coach"
    },
    {
        start: moment().add(1, "days").toDate(),
        end:  moment().add(1, "days").add(1, "hours").toDate(),
        title: "Event E",
        icon: "icon2",
        filterType: "coach"
    },
    {
        start: moment().add(1, "days").toDate(),
        end:  moment().add(1, "days").add(1, "hours").toDate(),
        title: "Event F",
        icon: "icon2",
        filterType: "coach"
    },
    {
        start: moment().add(1, "days").toDate(),
        end:  moment().add(1, "days").add(1, "hours").toDate(),
        title: "Event G",
        icon: "icon2",
        filterType: "coach"
    },
    {
        start: moment().add(1, "days").toDate(),
        end:  moment().add(1, "days").add(1, "hours").toDate(),
        title: "Event H",
        icon: "icon2",
        filterType: "coach"
    },
];

//sets the keys and calendar data when the control is loaded or the calendarDataSet changes.
React.useEffect(()=>{
    async function asyncCalendarData(){
        var keys = calendarData.keys;
        if (!keys)
        {
            keys = await getKeys(props.pcfContext);
        }

        var dataSet = props.pcfContext.parameters.calendarDataSet;
        //console.log(`asyncCalendarData: dataSet.sortedRecordIds.length: ${dataSet.sortedRecordIds.length}`)
        if (dataSet.loading === false)
        {
            setCalendarData(await getCalendarData(props.pcfContext, keys));            
        }
    }        
    //asyncCalendarData();
    //testing data

    setCalendarData({
        resources: [], 
        events: dummyData, 
        keys: []
    });

    setCalendarDataSave({
        resources: [], 
        events: dummyData, 
        keys: []
    })
},
[props.pcfContext.parameters.calendarDataSet.records]);

//allows for changing the calendar date if a date/time field is utilized in canvas on the input parameters
React.useEffect(()=>{
    //this appears to be firing every time a render happens...

    if (props.pcfContext.parameters.calendarDate?.raw?.getTime() !== 0 
    && !moment(calendarDate).isSame(props.pcfContext.parameters.calendarDate.raw)){
        setCalendarDate(props.pcfContext.parameters.calendarDate.raw as Date)
    }    
},[props.pcfContext.parameters.calendarDate?.raw?.getTime()])

//allows for changing the calendar view if a user decides to add in custom button for the view in canvas
React.useEffect(()=>{
    if (props.pcfContext.parameters.calendarView?.raw && calendarView != props.pcfContext.parameters.calendarView.raw){
        setCalendarView(getCalendarView(calendarViews, props.pcfContext.parameters.calendarView.raw))
    }    
},[props.pcfContext.parameters.calendarView?.raw])

React.useEffect(()=>{
    if (calendarDate && calendarView)
    {            
        _onCalendarChange();       
    }
},[calendarDate, calendarView])

React.useEffect(()=>{
    ToolbarColor.textColor = calendarTextColor;
    ToolbarColor.borderColor = calendarBorderColor;
    let styleTag = document.getElementById('rbc-calendar-theme-style');
    if (styleTag){
        styleTag.innerHTML = generateThemeCSS();
    }
},[props.pcfContext.parameters.eventDefaultColor?.raw, props.pcfContext.parameters.calendarTodayBackgroundColor?.raw, 
    props.pcfContext.parameters.calendarTextColor?.raw, props.pcfContext.parameters.calendarBorderColor?.raw, 
    props.pcfContext.parameters.calendarTimeBarBackgroundColor?.raw])

const generateThemeCSS = () : string =>{
    return `
    .rbc-calendar, 
    .rbc-toolbar button, 
    .rbc-agenda-date-cell,
    .rbc-agenda-time-cell
    {
        color: ${calendarTextColor};
    }

    .rbc-toolbar button:active, .rbc-toolbar button.rbc-active, .rbc-toolbar button:focus, .rbc-toolbar button:hover {
        background-color: ${calendarTextColor.fade(.7)};
    }

    .rbc-toolbar button:active:hover, .rbc-toolbar button:active:focus, .rbc-toolbar button.rbc-active:hover, .rbc-toolbar button.rbc-active:focus {
        background-color: ${calendarTextColor.fade(.6)};
    }

    .rbc-toolbar button:active:hover, .rbc-toolbar button:active:focus, .rbc-toolbar button.rbc-active:hover, .rbc-toolbar button.rbc-active:focus,
    rbc-toolbar button:focus,
    .rbc-toolbar button:hover {
        color: ${calendarTextColor.grayscale()} !important;
    }

    .rbc-off-range-bg {
        background-color: ${calendarTextColor.fade(.8)} !important
    }

    .rbc-off-range {
        color: ${calendarTextColor.fade(.6)}
    }

    .rbc-show-more {
        color: ${calendarTextColor.fade(.3)} !important;
    }

    .rbc-show-more:hover {
        background-color: ${calendarTextColor.isDark() ? calendarTextColor.grayscale().fade(.8) : calendarTextColor.grayscale().fade(.2) } !important;
    }

    .rbc-time-view-resources .rbc-time-gutter,
    .rbc-time-view-resources .rbc-time-header-gutter {
        background-color: ${calendarTimeBarBackgroundColor};
    }

    .rbc-header,
    .rbc-header + .rbc-header,
    .rbc-rtl .rbc-header + .rbc-header,
    .rbc-month-view,
    .rbc-month-row,
    .rbc-day-bg + .rbc-day-bg,
    .rbc-rtl .rbc-day-bg + .rbc-day-bg,
    .rbc-agenda-view table.rbc-agenda-table,
    .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td,
    .rbc-rtl .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td,
    .rbc-agenda-view table.rbc-agenda-table tbody > tr + tr,
    .rbc-agenda-view table.rbc-agenda-table thead > tr > th,
    .rbc-timeslot-group,
    .rbc-time-view-resources .rbc-time-gutter,
    .rbc-time-view-resources .rbc-time-header-gutter,
    .rbc-time-view,
    .rbc-time-view .rbc-allday-cell + .rbc-allday-cell,
    .rbc-time-header.rbc-overflowing,
    .rbc-rtl .rbc-time-header.rbc-overflowing,
    .rbc-time-header > .rbc-row:first-child,
    .rbc-time-header > .rbc-row.rbc-row-resource,
    .rbc-time-header-content,
    .rbc-rtl .rbc-time-header-content,
    .rbc-time-header-content > .rbc-row.rbc-row-resource,
    .rbc-time-content,
    .rbc-time-content > * + * > *,
    .rbc-rtl .rbc-time-content > * + * > *,
    .rbc-toolbar button
    {
        border-color: ${calendarBorderColor} !important;
    }

    .rbc-event:focus,
    .rbc-toolbar button:focus
    {
        outline: 5px auto ${calendarBorderColor};
    }

    .rbc-day-slot .rbc-time-slot {
        border-color: ${calendarBorderColor.fade(.2)} !important;
    }
    
    .rbc-view-day .rbc-time-view .rbc-allday-cell {
        width: 140px;
    }
    .rmsc {
        text-align: left;
        width: 300px;
        z-index: 999;
        --rmsc-main: #4285f4;
        --rmsc-hover: #f1f3f5;
        --rmsc-selected: #e2e6ea;
        --rmsc-border: #ccc;
        --rmsc-gray: #aaa;
        --rmsc-bg: #fff;
        --rmsc-p: 10px; /* Spacing */
        --rmsc-radius: 4px; /* Radius */
        --rmsc-h: 38px; /* Height */
    }
    .rmsc .select-item {
        text-align: left;
        display: block;
        
    }
    .rmsc input[type=checkbox] {
        width:auto;
    }
    .body-modal-fix{height:100%;width:100%;overflow:hidden}.pure-modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;background-color:rgba(0,0,0,.4);display:flex;flex-direction:column;justify-content:center;align-items:center}.backdrop-overflow-hidden{overflow:hidden!important}.pure-modal-backdrop .pure-modal{width:300px;max-width:100%;box-sizing:border-box;transition:all .2s ease-in-out;max-height:100%}.pure-modal.auto-height{position:static}.pure-modal-backdrop.scrollable{overflow-y:auto}.pure-modal-backdrop .panel{display:grid;grid-template-rows:repeat(3,min-content)}.pure-modal-backdrop:not(.scrollable) .panel{grid-template-rows:min-content minmax(0,1fr) min-content;max-height:-moz-available;max-height:-webkit-fill-available;max-height:fill-available;height:100%}.pure-modal>*>*{flex:0 0 auto}.pure-modal>*>.scrollable{overflow-x:hidden;overflow-scrolling:touch}@media (max-width:480px){.pure-modal-backdrop .pure-modal{width:100%}}.pure-modal .panel-body{background-color:#fff}.pure-modal .panel-heading{background:#f0f0f0}.pure-modal .panel-title{padding:12px 45px 12px 15px;margin:0}.pure-modal .close{right:10px;top:10px;z-index:1;background:hsla(0,0%,94.1%,.8);width:30px;color:#8c8c8c;transition:color .1s ease-in-out;height:30px;border-radius:15px;text-align:center;line-height:30px;cursor:pointer}.pure-modal .panel-heading .close:hover{color:#000}.pure-modal .panel-body{padding:15px}.pure-modal .panel-footer{padding:12px 45px 12px 15px;background:#f0f0f0}.pure-modal .panel-body,.pure-modal .panel-footer,.pure-modal .panel-title{word-break:break-all}.pure-modal-backdrop .additional-row,.pure-modal-backdrop:not(.scrollable) .additional-row{display:grid;grid-template-rows:min-content minmax(0,1fr) min-content min-content}
    .event-list {
        padding: 0;
        list-style-type: none;
    }
    .event-list li {
        text-align: left;
    }
    `;
}

//when an event is selected it return the events id in canvas and open the record in model app
const _handleEventSelected = (event: IEvent) => {
    let eventId = event.id as string
    
    props.onClickSelectedRecord(event.id as string);

    //if we are in a model app open the record when it's selected.
    if (props.pcfContext.mode.allocatedHeight === -1){
        props.pcfContext.navigation.openForm({
            entityId: eventId, 
            entityName: props.pcfContext.parameters.calendarDataSet.getTargetEntityType(),
            openInNewWindow: false
        });
    }
}

//when an empty area on the calendar is selected this output the values for the selected range in canvas
//and opens the record in model.
const _handleSlotSelect = (slotInfo: any) => {
   
    props.onClickSlot(slotInfo.start, slotInfo.end, slotInfo.resourceId || "");
    //if we are in a model app open a new record and pass in the data
    if (props.pcfContext.mode.allocatedHeight === -1){

        let newRecordProperties: any = {};
        newRecordProperties[calendarData.keys.start] = formatDateAsParameterString(slotInfo.start);
        newRecordProperties[calendarData.keys.end] = formatDateAsParameterString(slotInfo.end);
        if (calendarData.keys.resource && slotInfo.resourceId && calendarData.resources){
            var resourceInfo = calendarData.resources.find(x=> x.id === slotInfo.resourceId);
            newRecordProperties[calendarData.keys.resource] = resourceInfo.id;
            newRecordProperties[calendarData.keys.resource + "name"] = resourceInfo.title;
            newRecordProperties[calendarData.keys.resource + "type"] = resourceInfo.etn;
        }    
        props.pcfContext.navigation.openForm({            
            entityName: props.pcfContext.parameters.calendarDataSet.getTargetEntityType(),
            openInNewWindow: false,            
        }, newRecordProperties);
    }
}

//required event when using a variable for the Calendar Date
const _handleNavigate = (date: Date, view: string, action: string) => {    
    if (action === 'coach' || action === 'frontdesk' || action === 'all') {
        //manipulate data by filter
        alert (action);

        const resources = calendarDataSave.resources;
        const events = calendarDataSave.events.filter( e => e.filterType === action );
        const keys = calendarDataSave.keys;
       
        setCalendarData({
            resources, 
            events,
            keys
        });
        
        return;

    } 
    setCalendarDate(moment(date).toDate());    
}

const _handleFilter = (filter: any[]) => {    
     //manipulate data by filter
    console.log ('filter', filter);

    let filters = filter.map(a => a.value);
    console.log ('filters', filters);
    const resources = calendarDataSave.resources;
    const events = calendarDataSave.events.filter( (e) => {return filters.indexOf(e.filterType) >= 0});
    const keys = calendarDataSave.keys;
    
    setCalendarData({
        resources, 
        events,
        keys
    });
    
    return;

}

const EventComponent = () => (props: any) => {
    return (
      <div className="rbc-event-content">
        <a data-tip data-for={props.event.title}>
            {props.event.title}
        </a>
        <ReactTooltip id={props.event.title} place="top" type="dark" effect="float">
            <div>
                {props.event.title}
            </div>
            <div>
            {props.event.icon === 'icon1'?  <FaHeart style={{color: 'red', fontSize: '18px'}}/> : <FaSmile style={{color: 'yellow', fontSize: '18px'}}/>}
            </div>
        </ReactTooltip>
        
      </div>
    );
  };
  

const _handleOnView = (view: string) => {
    setCalendarView(getCalendarView(calendarViews, view));    
}

const _onCalendarChange = () =>
{
    let ref = calendarRef.current as any;
    let rangeDates = getCurrentRange(calendarDate, ref.props.view, ref.props.culture)        
    props.onCalendarChange(ref.props.date, rangeDates.start, rangeDates.end, ref.props.view);
}

const eventPropsGetter = (event: IEvent) => {
    return {
        style: {
            backgroundColor: event.color || eventDefaultBackgroundColor.toString(),
            color: Color(event.color || eventDefaultBackgroundColor).isDark() ? '#fff' : "#000",
            borderColor: calendarBorderColor.toString()
        }
    }
}

const dayPropsGetter = (date: Date) => {
    if (moment(date).startOf('day').isSame(moment().startOf('day')))
      return {        
        style: {
          backgroundColor: calendarTodayBackgroundColor.toString(),
        }
      }
    else return {        
    }
  }

const agendaEvent = ({event} : any)=> {    
    return (                
      <span 
      title={event.title}
      style={{
        overflow: 'auto',
        display: 'block',
        backgroundColor: event.color || eventDefaultBackgroundColor.toString(),
        padding: '5px',
        color: Color(event.color || eventDefaultBackgroundColor).isDark() ? '#fff' : "#000"
      }}>               
        {event.title}
      </span>
    ) 
}

const resourceHeader = ({label} : any)=> {
    let ref = calendarRef.current as any;
    return (                
      <span>
          {label}
      </span>
    ) 
}

const timeGutterHeader = ()=> {
    let ref = calendarRef.current as any;
    return (                
      <span title={ref ? ref.props.messages.allDay : ""} className="rbc-time-header-gutter-all-day">
          {ref ? ref.props.messages.allDay : ""}
      </span>
    ) 
}

return(!calendarData?.resources ? <><Calendar    
    selectable
    localizer={localizer}
    date={calendarDate}
    culture={calendarCulture}
    rtl={calendarRtl}
    messages={calendarMessages}
    defaultView={calendarView}
    view={calendarView}
    views={calendarViews}
    scrollToTime={calendarScrollTo} 
    events={calendarData.events}
    onSelectEvent={ _handleEventSelected} 
    onSelectSlot={ _handleSlotSelect }
    onNavigate={ _handleNavigate }
    onView={ _handleOnView }
    onFilter={ _handleFilter }
    onShowMore={(events, date) => {setModal(true);setModalEvents(events);}}
    doShowMoreDrillDown={false}
    ref={calendarRef}    
    className={`rbc-view-${calendarView}`}
    eventPropGetter={eventPropsGetter}
    dayPropGetter={dayPropsGetter}     
    components={{
        agenda: {
          event: agendaEvent,
        },
        //toolbar: MobileToolbar,
      //  timeGutterHeader: timeGutterHeader,
        toolbar: MobileToolbar,
        event: EventComponent(),
    }}
    />
    <ModalWithEvents
        modal={modal}
        modalEvents={modalEvents}
    />
    </>: 
    
    <><Calendar
    selectable
    localizer={localizer}
    date={calendarDate}
    culture={calendarCulture}
    messages={calendarMessages}
    defaultView={calendarView}
    view={calendarView}
    views={calendarViews}
    scrollToTime={calendarScrollTo} 
    events={calendarData.events}
    onSelectEvent={ _handleEventSelected }
    onSelectSlot={ _handleSlotSelect }
    onNavigate={ _handleNavigate }
    onView={ _handleOnView }
    onFilter={ _handleFilter }
    onShowMore={(events, date) => {setModal(true);setModalEvents(events);}}
    doShowMoreDrillDown={false}
    resources={calendarData.resources}
    resourceAccessor="resource"
    ref={calendarRef}    
    className={`rbc-view-${calendarView}`}
    eventPropGetter={eventPropsGetter}
    dayPropGetter={dayPropsGetter}
    components={{
        agenda: {
          event: agendaEvent,
        },
        //toolbar: MobileToolbar,  
        resourceHeader: resourceHeader,
       // timeGutterHeader: timeGutterHeader,
        toolbar: MobileToolbar,
        event: EventComponent(),
    }}
    />
    <ModalWithEvents
        modal={modal}
        modalEvents={modalEvents}
    />
    </>);
}

//gets all the fields names and other keys will will need while processing the data
async function getKeys(pcfContext: ComponentFramework.Context<IInputs>) : Promise<any> {
    let params = pcfContext.parameters;
    let dataSet = pcfContext.parameters.calendarDataSet;

    let resource = params.resourceField.raw ? getFieldName(dataSet, params.resourceField.raw) : "";
    let resourceGetAllInModel = params.resourceGetAllInModel.raw?.toLowerCase() === "true" ? true : false;
    let resourceEtn = '';
    let resourceName = params.resourceName.raw ? getFieldName(dataSet, params.resourceName.raw) : "";
    let resourceId = '';

    //if we are in a model app let's get additional info about the resource
    if (pcfContext.mode.allocatedHeight === -1 && resource && resourceGetAllInModel)
    {
        //get the resource entity name
        ///@ts-ignore
        let eventMeta = await pcfContext.utils.getEntityMetadata(pcfContext.mode.contextInfo.entityTypeName, [resource]);
        resourceEtn = eventMeta.Attributes.getByName(resource).Targets[0];        
        //get the resource primary name and id fields for resource.
        let resourceMeta = await pcfContext.utils.getEntityMetadata(resourceEtn);
        resourceName = resourceName ? resourceName : resourceMeta.PrimaryNameAttribute;
        resourceId = resourceMeta.PrimaryIdAttribute;        
    }

    return {
        id: params.eventId.raw ? getFieldName(dataSet,params.eventId.raw) : "", 
        name: params.eventFieldName.raw ? getFieldName(dataSet, params.eventFieldName.raw) : "",
        start: params.eventFieldStart.raw ? getFieldName(dataSet, params.eventFieldStart.raw) : "",
        end: params.eventFieldEnd.raw ? getFieldName(dataSet, params.eventFieldEnd.raw) : "",
        eventColor: params.eventColor.raw ? getFieldName(dataSet, params.eventColor.raw) : "",
        resource: resource,
        resourceName: resourceName,
        resourceId: resourceId,
        resourceGetAllInModel: resourceGetAllInModel,
        resourceEtn: resourceEtn
    }
}

//gets fields name from the datsource columns and provides the necessary alias information for
//related entities.
function getFieldName(dataSet: ComponentFramework.PropertyTypes.DataSet , fieldName: string): string {
    //if the field name does not contain a .  or linking is null which could be the case in a canvas app
    // when using a collection  then just return the field name
    if (fieldName.indexOf('.') === -1 || !dataSet.linking) return fieldName;
    
    //otherwise we need to determine the alias of the linked entity
    var linkedFieldParts = fieldName.split('.');
    linkedFieldParts[0] = dataSet.linking.getLinkedEntities().find(e => e.name === linkedFieldParts[0].toLowerCase())?.alias || "";
    return linkedFieldParts.join('.');
}

//returns all the calendar data including the events and resources
async function getCalendarData(pcfContext: ComponentFramework.Context<IInputs>, keys: any) : Promise<{resources: any[] | undefined, events: Event[], keys: any}>
{
    let resourceData = await getResources(pcfContext, keys);
    let eventData = await getEvents(pcfContext, resourceData, keys);

    //console.log(`getCalendarData: eventData.length: ${eventData?.length}`);
    return {resources: resourceData, events: eventData, keys: keys}
}

//retrieves all the resources from the datasource
async function getResources(pcfContext: ComponentFramework.Context<IInputs>, keys: any): Promise<any[] | undefined> {
    let dataSet = pcfContext.parameters.calendarDataSet;
    
    let resources: any[] = [];
    //if the user did not put in resource then do not add them to the calendar.
    if (!keys.resource) return undefined;
    
    let totalRecordCount = dataSet.sortedRecordIds.length;
    
    for (let i = 0; i < totalRecordCount; i++) {
        let recordId = dataSet.sortedRecordIds[i];
        let record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;

        let resourceId = "";
        let resourceName = "";
        let resourceEtn = "";

        //if this is a Model app we will be using a lookup reference for the Resources
        if (pcfContext.mode.allocatedHeight === -1){
            let resourceRef = record.getValue(keys.resource) as ComponentFramework.EntityReference;
            if (resourceRef){
                resourceId = resourceRef.id.guid;
                resourceName = keys.resourceName && keys.resourceName.indexOf('.') !== -1 ? record.getValue(keys.resourceName) as string || "" : resourceRef.name;
                resourceEtn = resourceRef.etn as string;
            }
        }
        //otherwise this is canvas and the user has supplied the data.
        else
        {
            resourceId = record.getValue(keys.resource) as string || "";
            resourceName = record.getValue(keys.resourceName) as string || "";
        }
        
        if (!resourceId) continue;

        resources.push({id: resourceId, title: resourceName, etn: resourceEtn});
    }

    if (pcfContext.mode.allocatedHeight === -1 && keys.resource && keys.resourceGetAllInModel){
        await getAllResources(pcfContext, resources, keys);
    }

    const distinctResources : any[] = [];
    const map = new Map();
    for (const item of resources) {
        if (!map.has(item.id)){
            map.set(item.id, true);
            distinctResources.push({
                id: item.id,
                title: item.title || ''
            });
        }
    }

    return distinctResources;    
}

async function getAllResources(pcfContext: ComponentFramework.Context<IInputs>, resources: any[], keys: any): Promise<void> {
    var resourceName = keys.resourceName.indexOf('.') === -1 ? keys.resourceName : keys.resourceName.split('.')[1];
    var options = keys.resourceName ? `?$select=${resourceName}` : undefined;
    
    //retrieve all the resources
    var allResources = await pcfContext.webAPI.retrieveMultipleRecords(keys.resourceEtn, options, 5000);
    
    //loop through and push them to the resources array
    allResources.entities.forEach(e => { 
        resources.push({
            id: e[keys.resourceId],
            title: e[resourceName]
        })
    });
}

//retrieves all the events from the datasource
async function getEvents(pcfContext: ComponentFramework.Context<IInputs>, resources: any[] | undefined, keys: any): Promise<Event[]> {
        let dataSet = pcfContext.parameters.calendarDataSet;
        let totalRecordCount = dataSet.sortedRecordIds.length;

        let newEvents: Event[] = [];
        for (let i = 0; i < totalRecordCount; i++) {
			var recordId = dataSet.sortedRecordIds[i];
            var record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;
        
            var name = record.getValue(keys.name) as string;
			var start = record.getValue(keys.start);
            var end = record.getValue(keys.end);                        

            if (!name || !start || !end) continue;

            let newEvent: IEvent = {
                id: keys.id ? record.getValue(keys.id) as string || recordId : recordId,
                start: new Date(start as number),
                end: new Date(end as number),
                title: name
            };

            let color = record.getValue(keys.eventColor);
            if (color) newEvent.color = color as string;

            if (resources)
            {
                var resourceId = record.getValue(keys.resource);
                if (resourceId){
                    //if model app get the id of the entity reference, otherwise use the id field provided
                    newEvent.resource = pcfContext.mode.allocatedHeight === -1 ? 
                        (resourceId as ComponentFramework.EntityReference).id.guid : resourceId;
                }
            }

            newEvents.push(newEvent);
        }

        return newEvents;
}

//format the date/time so that it can be passed as a parameter to a Dynamics form
function formatDateAsParameterString(date: Date){
    //months are zero index so don't forget to add one :)
    return (date.getMonth() + 1) + "/" +
        date.getDate() + "/" +
        date.getFullYear() + " " +
        date.getHours() + ":" +
        date.getMinutes() + ":" +
        date.getSeconds();
}

function getCalendarView(calendarViews: ViewsProps, viewName: string) : View {
    let calView = Object.keys(calendarViews).find((x: string) => x === viewName.toLowerCase());
    return calView ? calView as View : Object.keys(calendarViews)[0] as View;    
}

function getCalendarViews(pcfContext: ComponentFramework.Context<IInputs>) : ViewsProps {
    let viewList = pcfContext.parameters.calendarAvailableViews?.raw || "month";
    let validViews = viewList.split(',').filter(x => allViews.indexOf(x.trim()) !== -1);
    
    let selectedViews: any = {};
    if (validViews.length < 1){
        selectedViews.week = true;
    }
    else{
        validViews.forEach((view: string) => {
            if (view === 'work_week'){
                selectedViews.work_week = CustomWorkWeek.default;                
                selectedViews.work_week.includedDays = getWorkWeekExcludedDays(pcfContext)                
            }
            else{
                selectedViews[view] = true;
            }
        });
    }
    return selectedViews;    
}

function getWorkWeekExcludedDays(pcfContext: ComponentFramework.Context<IInputs>): number[]
{   
    if (pcfContext.parameters.calendarWorkWeekDays && pcfContext.parameters.calendarWorkWeekDays.raw)
    {
        return pcfContext.parameters.calendarWorkWeekDays.raw.split(',').map( x => { return (+x)-1; });
    }
    else
    {
        return [1,2,3,4,5];
    }
}

function getCurrentRange(date: Date, view: string, culture: string) : {start: Date, end: Date} {

    let start = moment().toDate(), end = moment().toDate();
    if(view === 'day'){
      start = moment(date).startOf('day').toDate();
      end   = moment(date).endOf('day').toDate();
    }
    else if(view === 'week'){
      start = moment(date).startOf('week').toDate();
      end   = moment(date).endOf('week').toDate();
    } 
    else if(view === 'work_week'){
        start = moment(date).weekday(1).toDate();
        end   = moment(date).weekday(5).toDate();
    }    
    else if(view === 'month'){
    start = moment(date).startOf('month').startOf('week').toDate()
    end = moment(date).endOf('month').endOf('week').toDate()
    }
    else if(view === 'agenda'){
      start = moment(date).startOf('day').toDate();
      end   = moment(date).endOf('day').add(1, 'month').toDate();
    }
    return {start, end};
  }

function getISOLanguage(pcfContext: ComponentFramework.Context<IInputs>): string
{
    //look for a language setting coming in from the parameters.
    //if nothing was entered use an empty string which will default to en
    let lang = pcfContext.parameters.calendarLanguage?.raw || '';    

    //if this is a model app and a language was not added as an input then user the current users
    // language settings.
    if (!lang && pcfContext.mode.allocatedHeight === -1){
        lang = lcid.from(pcfContext.userSettings.languageId);
        return lang.substring(0, lang.indexOf('_'));
    }

    return lang;
}