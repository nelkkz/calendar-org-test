import * as PropTypes from 'prop-types'
import * as React from 'react';
import clsx from 'clsx'
import * as Color from 'color'
import { ToolbarProps, NavigateAction, View, Messages, DateRange } from 'react-big-calendar-ex'
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { CommandBarButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { CommandBar, ICommandBarItemProps, ICommandBarData, } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItemProps, IContextualMenuItem, ContextualMenuItem,  IContextualMenuItemStyles,  IContextualMenuStyles,} from 'office-ui-fabric-react/lib/ContextualMenu';
import { getTheme, concatStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { IButtonStyles } from 'office-ui-fabric-react/lib/Button';
import { memoizeFunction } from 'office-ui-fabric-react/lib/Utilities';
import { initializeIcons } from '@uifabric/icons';
import {useSwipeable} from 'react-swipeable';
import { MultiSelect,Option } from "react-multi-select-component";
import { FaCheck  } from "react-icons/fa";
import DateRangePicker from "react-daterange-picker";

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

initializeIcons();

export const MobileToolbar: React.FC<ToolbarProps<Event, any>> = (props) =>  {
  const messages = props.localizer.messages;

  const getViewNamesGroup = (messages: any) : any => {
    let viewNames: any = props.views
    const view = props.view

    if (viewNames.length > 1) {
      return viewNames.map((name: any) => (
        <button
          type="button"
          key={name}
          className={clsx({ 'rbc-active': view === name })}
          onClick={props.onView.bind(null, name)}
        >
          {messages[name]}
        </button>
      ));
    }
  }

  const navigate = (action: NavigateAction): void => {
    props.onNavigate(action)
  }

  const handlers = useSwipeable({
      onSwipedLeft: (eventData) => navigate.bind(null, 'PREV'),
      onSwipedRight: (eventData) => navigate.bind(null,'NEXT'),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true
    });

  const theme = getTheme();

  const buttonStyle: Partial<IButtonStyles> = {    
      root: {
        color: ToolbarColor?.textColor?.toString() || '',
        backgroundColor: 'transparent'   
      },
      rootHovered: {
        backgroundColor: ToolbarColor?.textColor?.fade(.6)?.toString() || ''
      },
      rootPressed: {
        backgroundColor: ToolbarColor?.textColor?.fade(.7)?.toString() || ''
      }
  };

  const itemStyles: Partial<IContextualMenuItemStyles> = {
    root: {
      backgroundColor: 'transparent',
      color: ToolbarColor?.textColor?.toString() || '',
      fontSize: 14
    },   
  };

  // For passing the styles through to the context menus
  const menuStyles: Partial<IContextualMenuStyles> = {
    root: {
      backgroundColor: 'transparent'
    },    
    subComponentStyles: {       
      menuItem: itemStyles, 
      callout: {}       
    },    
  };

  const getCommandBarButtonStyles = memoizeFunction(
    (originalStyles: IButtonStyles | undefined): Partial<IContextualMenuItemStyles> => {
      if (!originalStyles) {
        return itemStyles;
      }
  
      return concatStyleSets(originalStyles, itemStyles);
    },
  );

  const _onReduceData = (data: ICommandBarData): any =>{
    if (data.primaryItems[0].key === 'dates') return undefined;
    if (data.primaryItems[0].iconOnly === true)
    {
      let firstItem = data.primaryItems[0];
      data.primaryItems.shift();
      data.overflowItems.push(firstItem);
    }
    else
    {
      data.primaryItems.forEach(item => { if (item.iconProps) item.iconOnly = true});
      return data;
    }
  }

  const options_p = [
    { label: "TC-ECH", value: "948010000" },
    { label: "OPP", value: "948010001"},
    { label: "IR", value: "948010002" },
    { label: "RS", value: "948010003" },
    { label: "TDG Secretariat", value: "948010004" },
    { label: "TDG Safety Awareness", value: "948010005" }
  ];

  const [selected_p, setSelected_p] = React.useState<Option[]>([
    { label: "TC-ECH", value: "948010000" },
    { label: "OPP", value: "948010001"},
    { label: "IR", value: "948010002" },
    { label: "RS", value: "948010003" },
    { label: "TDG Secretariat", value: "948010004" },
    { label: "TDG Safety Awareness", value: "948010005" }
  ]);

  const options_t = [
    { label: "Assembly", value: "t948010002_" },
    { label: "Bilateral Meeting", value: "t13_"},
    { label: "Capacity Development Activities", value: "t7_" },
    { label: "Conference", value: "t4_" },
    { label: "Coordination", value: "t8_" },
    { label: "Informal Meeting", value: "t948010003_" },
    { label: "Inspections", value: "t12_" },
    { label: "Meeting", value: "t2_" },
    { label: "Multilateral", value: "t948010000_" },
    { label: "Mutual Recognition", value: "t948010001_" },
    { label: "Other", value: "t10_" },
    { label: "Panel", value: "t1_" },
    { label: "Symposium", value: "t5_" },
    { label: "Task Force", value: "t6_" },
    { label: "Working Group", value: "t3_" },
    { label: "Workshop", value: "t9_" },
    { label: "Virtual Meeting", value: "t948010004_" }
  ];
  const [selected_t, setSelected_t] = React.useState<Option[]>([
    { label: "Assembly", value: "t948010002_" },
    { label: "Bilateral Meeting", value: "t13_"},
    { label: "Capacity Development Activities", value: "t7_" },
    { label: "Conference", value: "t4_" },
    { label: "Coordination", value: "t8_" },
    { label: "Informal Meeting", value: "t948010003_" },
    { label: "Inspections", value: "t12_" },
    { label: "Meeting", value: "t2_" },
    { label: "Multilateral", value: "t948010000_" },
    { label: "Mutual Recognition", value: "t948010001_" },
    { label: "Other", value: "t10_" },
    { label: "Panel", value: "t1_" },
    { label: "Symposium", value: "t5_" },
    { label: "Task Force", value: "t6_" },
    { label: "Working Group", value: "t3_" },
    { label: "Workshop", value: "t9_" },
    { label: "Virtual Meeting", value: "t948010004_" }
  ]);

  const options_r = [
    { label: "Alberta", value: "r948010000" },
    { label: "British Columbia", value: "r948010006"},
    { label: "Manitoba", value: "r948010002" },
    { label: "New Brunswick", value: "r948010010" },
    { label: "Newfoundland &amp; Labrador", value: "r948010011" },
    { label: "Northwest Territories", value: "r948010004" },
    { label: "Nova Scotia", value: "r948010009" },
    { label: "Nunavut", value: "r948010005" },
    { label: "Ontario", value: "r948010007" },
    { label: "Prince Edward Island", value: "r948010012" },
    { label: "Quebec", value: "r948010008" },
    { label: "Saskatchewan", value: "r948010001" },
    { label: "Yukon", value: "r948010003" }
  ];

  const [selected_r, setSelected_r] = React.useState<Option[]>([
    { label: "Alberta", value: "r948010000" },
    { label: "British Columbia", value: "r948010006"},
    { label: "Manitoba", value: "r948010002" },
    { label: "New Brunswick", value: "r948010010" },
    { label: "Newfoundland &amp; Labrador", value: "r948010011" },
    { label: "Northwest Territories", value: "r948010004" },
    { label: "Nova Scotia", value: "r948010009" },
    { label: "Nunavut", value: "r948010005" },
    { label: "Ontario", value: "r948010007" },
    { label: "Prince Edward Island", value: "r948010012" },
    { label: "Quebec", value: "r948010008" },
    { label: "Saskatchewan", value: "r948010001" },
    { label: "Yukon", value: "r948010003" }
  ]);
  const onSelectMulti_p = (selected: []) => {
    setSelected_p(selected);
    props.onFilter(selected);
  }
  const onSelectMulti_t = (selected: []) => {
    setSelected_t(selected);
    props.onFilter(selected);
  }
  const onSelectMulti_r = (selected: []) => {
    setSelected_r(selected);
    props.onFilter(selected);
  }
  const onToggle = () => {
    setIsOpen(!isOpen);
  }
  const onSelect = (states) => {
    setDateRage(states);

    props.onFilter([{value: 'dr' + states.start.format("YYYY-MM-DD")},
      {value: 'dr' + states.end.format("YYYY-MM-DD")}]);
    setIsOpen(false);
  }
  const selectedToString = (items: Option[]) => {
    let values = items.map(a => a.value);
    return values.join(',');
  }
  // handle date input
  const formatDate = () : string => {
    let d = new Date();
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
  }

  const [inputDate, inputDateSelected] = React.useState<string>('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [dateRage, setDateRage] = React.useState<DateRange>();

  const handleInputDate = (e: any) => {
    inputDateSelected(e.target.value);

  }

  const handleDateChange = () => {
    const dateReg = /^\d{4}([./-])\d{2}\1\d{2}$/;

    if (!inputDate.match(dateReg)) {
      inputDateSelected('');
      return;
    }

    const [year, month, day] = inputDate.split('-');
    console.log('year, month, day', [year, month, day]);

    const date = new Date(parseInt(year), parseInt(month)-1, parseInt(day));
    console.log('date', date);
    props.onNavigate('DATE',  date);
  }

  React.useEffect(()=>{
    //inputDateSelected(formatDate());
  });


  return (
    <div>
      <div className="rbc-toolbar">
          {messages.programarea}: <span>&nbsp;</span>
          <MultiSelect
            options={options_p}
            value={selected_p}
            labelledBy="Select program areas"
            onChange={onSelectMulti_p}
            />
          <span>&nbsp;&nbsp;</span>
          {messages.eventtype}: <span>&nbsp;</span>
          <MultiSelect
            options={options_t}
            value={selected_t}
            labelledBy="Select event types"
            onChange={onSelectMulti_t}
            />
            <span>&nbsp;&nbsp;</span>
          {messages.province}: <span>&nbsp;</span>
          <MultiSelect
            options={options_r}
            value={selected_r}
            labelledBy="Select provinces"
            onChange={onSelectMulti_r}
            />
            
      </div>
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button
              type="button"
              onClick={navigate.bind(null, 'TODAY')}
            >
              {messages.today}
            </button>
            <button
              type="button"
              onClick={navigate.bind(null, 'PREV')}
            >
              {messages.previous}
            </button>
            <button
              type="button"
              onClick={navigate.bind(null, 'NEXT')}
            >
              {messages.next}
          </button>
          &nbsp;&nbsp;{messages.enterdate}:&nbsp;

          <input type="text" 
            placeholder="yyyy-mm-dd"
            value={inputDate} 
            style={{'width': '140px','height': '29px', 'padding': '0px'}}
            onChange={handleInputDate} />
          
          <button
            type="button"
            onClick={handleDateChange}>
            Go
          </button>
          &nbsp;&nbsp;
          <input 
            type="button"
            value={messages.enterdate}
            onClick={onToggle}
            />
            
            {isOpen && (
              <DateRangePicker
                value={dateRage}
                onSelect={onSelect}
                singleDateRange={true}
                />
              )}


        </span>
        <span className="rbc-toolbar-label">{props.label}</span>
        <span className="rbc-btn-group">{getViewNamesGroup(messages)}</span>
        <span>&nbsp;&nbsp;</span>
        <span className="rbc-btn-group"><button type="button" onClick={navigate.bind(null, 'LISTVIEW')}>{messages.listview}</button></span>
      </div>
    </div>
  )
}

export const ToolbarColor = { 
  textColor: Color(),
  borderColor: Color()
}
// export default MobileToolbar


// MobileToolbar.propTypes = {
//   view: PropTypes.View.isRequired,
//   views: PropTypes.arrayOf(PropTypes.string).isRequired,
//   label: PropTypes.node.isRequired,
//   localizer: PropTypes.object,
//   onNavigate: PropTypes.func.isRequired,
//   onView: PropTypes.func.isRequired,
// }