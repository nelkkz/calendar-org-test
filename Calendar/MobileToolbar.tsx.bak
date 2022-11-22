import * as PropTypes from 'prop-types'
import * as React from 'react';
import clsx from 'clsx'
import * as Color from 'color'
import { ToolbarProps, NavigateAction, View, Messages } from 'react-big-calendar-ex'
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

  const options = [
    { label: "Coach Event", value: "coach" },
    { label: "FrontDesk Event", value: "frontdesk"},
    { label: "Manager Event", value: "manager" },
  ];

  const [selected, setSelected] = React.useState<Option[]>([
    { label: "Coach Event", value: "coach" },
    { label: "FrontDesk Event", value: "frontdesk"},
    { label: "Manager Event", value: "manager" },
  ]);

  const optionsProvince = [
    { label: "Ontario", value: "on" },
    { label: "Alberta", value: "ab"},
    { label: "Manitoba", value: "mn" },
  ];

  const [selectedProvince, setSelectedProvince] = React.useState<Option[]>([
    { label: "Ontario", value: "on" },
    { label: "Alberta", value: "ab"},
    { label: "Manitoba", value: "mn" },
  ]);


  const onSelectMulti = (selected: []) => {
    setSelected(selected);
    props.onFilter(selected);
  }


  const onSelectMultiProvince = (selected: []) => {
    setSelectedProvince(selected);
    props.onFilter(selected);
  }

  const selectedToString = (items: Option[]) => {
    let values = items.map(a => a.value);
    return values.join(',');
  }
  const formatDate = () : string => {
    let d = new Date();
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
  }

  const [inputDate, inputDateSelected] = React.useState<string>('');

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
        </span>
        <span className="rbc-toolbar-label">{props.label}</span>
        <span className="rbc-btn-group">{getViewNamesGroup(messages)}</span>

      </div>
      <div className="rbc-toolbar">
          Enter a date: 
          <input type="text" 
            placeholder="yyyy-mm-dd"
            value={inputDate} 
            style={{'width': '140px'}}
            onChange={handleInputDate} />
          <button
            onClick={handleDateChange}>
            <FaCheck style={{color: 'grey', fontSize: '18px'}}/>
          </button>

          Filter event: 
          <MultiSelect
            options={options}
            value={selected}
            labelledBy="Select event types"
            onChange={onSelectMulti}
            />

          &nbsp;
          Filter provice: 
          <MultiSelect
            options={optionsProvince}
            value={selectedProvince}
            labelledBy="Province"
            onChange={onSelectMultiProvince}
            />
          &nbsp;<a href={"https://www.google.com?type=" 
          + selectedToString(selected)
          + "&province="
          + selectedToString(selectedProvince)}>List view</a>
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