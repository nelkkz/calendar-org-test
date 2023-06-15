import * as PropTypes from 'prop-types'
import * as React from 'react';
import { useState } from 'react';
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
import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import DateRangePicker from "react-daterange-picker";
import PureModal from 'react-pure-modal';

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

initializeIcons();

export const MobileToolbar: React.FC<ToolbarProps<Event, any>> = (props) =>  {

  type FilterPopupProps = {
    modal: boolean;
  }

  const onFilterClick = () => {
    setModal(true);
  }

  const handleListView = () => {
    //navigate.bind(null, 'LISTVIEW');
    props.onListView();
  }

 //filter popup otions
 const [inputName, setInputName] = React.useState<string>('');
 const handleInputName = (e: any) => {
   setInputName(e.target.value);
 }
  const [optionsEngagement, setOptionsEngagement]  = React.useState<Option[]>([]);
  const [selectedEngagement, setSelectedEngagement] = React.useState<Option[]>([]);
  const onSelectMultiEngagement = (selected: []) => { setSelectedEngagement(selected); }

  const [optionsAttendance, setOptionsAttendance] = React.useState<Option[]>([]);
  const [selectedAttendance, setSelectedAttendance] = React.useState<Option[]>([]);
  const onSelectMultiAttendance = (selected: []) => { setSelectedAttendance(selected); }

  const [optionsMethod, setOptionsMethod] = React.useState<Option[]>([]);
  const [selectedMethod, setSelectedMethod] = React.useState<Option[]>([]);
  const onSelectMultiMethod = (selected: []) => { setSelectedMethod(selected); }

  const [optionsType, setOptionsType] = React.useState<Option[]>([]);
  const [selectedType, setSelectedType] = React.useState<Option[]>([]);
  const onSelectMultiType = (selected: []) => { setSelectedType(selected); }

  const [optionsIndigenous, setOptionsIndigenous] = React.useState<Option[]>([]);
  const [selectedIndigenous, setSelectedIndigenous] = React.useState<Option[]>([]);
  const onSelectIndigenous = (selected: []) => {  setSelectedIndigenous(selected); }

  const [optionsCategory, setOptionsCategory] = React.useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<Option[]>([]);
  const onSelectCategory = (selected: []) => { setSelectedCategory(selected); }

  const [optionsContact, setOptionsContact] = React.useState<Option[]>([]);
  const [selectedContact, setSelectedContact] = React.useState<Option[]>([]);
  const onSelectContact = (selected: []) => { setSelectedContact(selected); }

  const [optionsPillars, setOptionsPillars] = React.useState<Option[]>([]);
  const [selectedPillars, setSelectedPillars] = React.useState<Option[]>([]);
  const onSelectPillars = (selected: []) => { setSelectedPillars(selected); }

  const [optionsInitiatives, setOptionsInitiatives] = React.useState<Option[]>([]);
  const [selectedInitiatives, setSelectedInitiatives] = React.useState<Option[]>([]);
  const onSelectInitiatives = (selected: []) => { setSelectedInitiatives(selected); }

  const [optionsProgram, setOptionsProgram] = React.useState<Option[]>([]);
  const [selectedProgram, setSelectedProgram] = React.useState<Option[]>([]);
  const onSelectProgram = (selected: []) => { setSelectedProgram(selected); }

  const [optionsCorporate, setOptionsCorporate] = React.useState<Option[]>([]);
  const [selectedCorporate, setSelectedCorporate] = React.useState<Option[]>([]);
  const onSelectCorporate = (selected: []) => {  setSelectedCorporate(selected); }

  React.useEffect(()=>{
    //inputDateSelected(formatDate());
    console.log('get filters from toolbar');
    var filters = props.getFilters();
    console.log(filters);

    for (var i=0, len = filters.length; i< len; i++) {
      if (filters[i].type === "engagement") {
        setOptionsEngagement(filters[i].filters);
        setSelectedEngagement(filters[i].filters);
      } else if (filters[i].type === "attendance") {
        setOptionsAttendance(filters[i].filters);
        setSelectedAttendance(filters[i].filters);
      } else if (filters[i].type === "method") {
        setOptionsMethod(filters[i].filters);
        setSelectedMethod(filters[i].filters);
      } else if (filters[i].type === "type") {
        setOptionsType(filters[i].filters);
        setSelectedType(filters[i].filters);
      } else if (filters[i].type === "indigenous") {
        setOptionsIndigenous(filters[i].filters);
        setSelectedIndigenous(filters[i].filters);
      } else if (filters[i].type === "category") {
        setOptionsCategory(filters[i].filters);
        setSelectedCategory(filters[i].filters);
      } else if (filters[i].type === "contact") {
        setOptionsContact(filters[i].filters);
        setSelectedContact(filters[i].filters);
      } else if (filters[i].type === "pillars") {
        setOptionsPillars(filters[i].filters);
        setSelectedPillars(filters[i].filters);
      } else if (filters[i].type === "initiatives") {
        setOptionsInitiatives(filters[i].filters);
        setSelectedInitiatives(filters[i].filters);
      } else if (filters[i].type === "program") {
        setOptionsProgram(filters[i].filters);
        setSelectedProgram(filters[i].filters);
      } else if (filters[i].type === "corporate") {
        setOptionsCorporate(filters[i].filters);
        setSelectedCorporate(filters[i].filters);
      }

    }

  }, []);


  const [modal, setModal] = useState(false);

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



  return (
    <div>
      <PureModal
        className="filterModal"
        header=""
        isOpen={modal}
        closeButton={<IoIosCloseCircleOutline color="black" size="30"/>}
        closeButtonPosition="header"
        width="900px"
        onClose={() => {
          console.log('closed me');
       //   setModal(false);
        //  return true;
        return true;
        }}
      >
      <IoIosCheckmarkCircleOutline className="filterApply" color="green" size="30" onClick={()=>{
        //TODO: combine selected filter items and call parent with filters.
        props.onFilter([]);
        setModal(false);
      }} />

      <IoIosCloseCircleOutline className="filterClose" color="black" size="30" onClick={()=>{
        setModal(false);
      }}/>
      
      <div className="row">
        <div className="column">
            <h2 className="filterHeader">Event Details</h2>
            <hr></hr>

            <input type="text" 
                placeholder="Event name"
                value={inputName}
                onChange={handleInputName}
                className="rmsc filterInput"
              />

            <MultiSelect
              className="filterSelect"
              options={optionsEngagement}
              value={selectedEngagement}
              labelledBy="Level of Engagement"
              valueRenderer={(selected: typeof optionsEngagement) => {
                if (!selected.length) {
                  return "Level of Engagement";
                }
                if (selected.length == optionsEngagement.length) {
                  return "All Level of Engagemen selected";
                }
              }}
              onChange={onSelectMultiEngagement}
            />

            <MultiSelect
              className="filterSelect"
              options={optionsAttendance}
              value={selectedAttendance}
              labelledBy="Executive Attendance"
              valueRenderer={(selected: typeof optionsAttendance) => {
                if (!selected.length) {
                  return "Executive Attendance";
                }
                if (selected.length == optionsAttendance.length) {
                  return "All Executive Attendance selected";
                }
              }}
              onChange={setSelectedAttendance}
            />

            <MultiSelect
              className="filterSelect"
              options={optionsMethod}
              value={selectedMethod}
              labelledBy="Engagement Method"
              valueRenderer={(selected: typeof optionsMethod) => {
                if (!selected.length) {
                  return "Engagement Method";
                }
                if (selected.length == optionsMethod.length) {
                  return "All Engagement Method selected";
                }
              }}
              onChange={setSelectedMethod}
            />

            <MultiSelect
              className="filterSelect"
              options={optionsType}
              value={selectedType}
              labelledBy="Event Type"
              valueRenderer={(selected: typeof optionsType) => {
                if (!selected.length) {
                  return "Event Type";
                }
                if (selected.length == optionsType.length) {
                  return "All Event Type selected";
                }
              }}
              onChange={setSelectedType}
            />

            <MultiSelect
              className="filterSelect"
              options={optionsIndigenous}
              value={selectedIndigenous}
              labelledBy="Indigenous Engagements"
              valueRenderer={(selected: typeof optionsIndigenous) => {
                if (!selected.length) {
                  return "Indigenous Engagements";
                }
                if (selected.length == optionsIndigenous.length) {
                  return "All Indigenous Engagements selected";
                }
              }}
              onChange={setSelectedIndigenous}
            />

        </div>
        <div className="column">
            <h2 className="filterHeader">Organization & Contacts</h2>
            <hr></hr>
            <MultiSelect
              className="filterSelect"
              options={optionsCategory}
              value={selectedCategory}
              labelledBy="Organization Categoy(ies)"
              valueRenderer={(selected: typeof optionsCategory) => {
                if (!selected.length) {
                  return "Organization Categoy(ies)";
                }
                if (selected.length == optionsCategory.length) {
                  return "All Organization Categoy(ies) selected";
                }
              }}
              onChange={setSelectedCategory}
            />
            <MultiSelect
              className="filterSelect"
              options={optionsContact}
              value={selectedContact}
              labelledBy="Contact(s)"
              valueRenderer={(selected: typeof optionsContact) => {
                if (!selected.length) {
                  return "Contact(s)";
                }
                if (selected.length == optionsContact.length) {
                  return "All Contact(s) selected";
                }
              }}
              onChange={setSelectedContact}
            />
            <h2 className="filterHeader">OPP</h2>
            <hr></hr>
            <MultiSelect
              className="filterSelect"
              options={optionsPillars}
              value={selectedPillars}
              labelledBy="OPP Pillars"
              valueRenderer={(selected: typeof optionsPillars) => {
                if (!selected.length) {
                  return "OPP Pillars";
                }
                if (selected.length == optionsPillars.length) {
                  return "All OPP Pillars selected";
                }
              }}
              onChange={setSelectedPillars}
            />
            <MultiSelect
              className="filterSelect"
              options={optionsInitiatives}
              value={selectedInitiatives}
              labelledBy="CPP Initiatives"
              valueRenderer={(selected: typeof optionsInitiatives) => {
                if (!selected.length) {
                  return "CPP Initiatives";
                }
                if (selected.length == optionsInitiatives.length) {
                  return "All CPP Initiatives selected";
                }
              }}
              onChange={setSelectedInitiatives}
            />
        </div>
        <div className="column">
            <h2 className="filterHeader">Regions</h2>
            <hr></hr>
            <MultiSelect
              className="filterSelect"
              options={optionsProgram}
              value={selectedProgram}
              labelledBy="Program Area Region(s)"
              valueRenderer={(selected: typeof optionsProgram) => {
                if (!selected.length) {
                  return "Program Area Region(s)";
                }
                if (selected.length == optionsProgram.length) {
                  return "All Program Area Region(s) selected";
                }
              }}
              onChange={setSelectedProgram}
            />
            <MultiSelect
              className="filterSelect"
              options={optionsCorporate}
              value={selectedCorporate}
              labelledBy="Corporate Region(s)"
              valueRenderer={(selected: typeof optionsCorporate) => {
                if (!selected.length) {
                  return "Corporate Region(s)";
                }
                if (selected.length == optionsCorporate.length) {
                  return "All Corporate Region(s) selected";
                }
              }}
              onChange={setSelectedCorporate}
            />
        </div>
    </div>


    </PureModal>

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

            <button
              type="button"
              onClick={onFilterClick}
            >
              {'Filter'}
            </button>
            
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
        <span className="rbc-btn-group"><button type="button" onClick={handleListView}>{messages.listview}</button></span>
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