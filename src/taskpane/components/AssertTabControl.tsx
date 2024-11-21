import * as React from 'react';
import { makeStyles, shorthands } from "@fluentui/react-components";
import { SelectTabData, SelectTabEvent, TabList, Tab, TabValue } from '@fluentui/react-components';

import { Text, Checkbox, DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from '@fluentui/react';
import { CopyInsert } from './CopyInsert';



const useStyles = makeStyles({
  tabContainer: {
    ...shorthands.borderRadius("5px"),
    paddingTop:"1px",
    paddingBottom:"5px",
    // marginRight: "5px",
    // marginLeft: "5px",
    // marginTop: "5px",
    backgroundColor: "#ffffff",
  },
  tabStyle: {
    ...shorthands.borderRadius("5px"),
    marginRight: "5px",
    marginLeft: "5px",
    marginTop: "5px",
    backgroundColor: "#e7e5e5",
  },
  tabContent: {
    ...shorthands.borderRadius("5px"),
    marginRight: "5px",
    marginLeft: "5px",
    marginTop: "5px",
    backgroundColor: "#ffffff",
  },
  copyInsertStyle:{
    marginBottom: "40px",
    marginTop: "10px"
  }
});

export const AssertTabControl = ({ chatItem, assertions  }) => {
    const styles = useStyles();
    const [selectedItems, setSelectedItems] = React.useState([]);
    const [selectedValue, setSelectedValue] = React.useState<TabValue>(null);

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        console.log(`The ${data.value} tab was selected`);
        console.log(`The ${event} tab event selected`);
        setSelectedValue(data.value);
        //setSelectedItems([]); // Clear selected items when changing tabs
    };
  
  
    const columns = [
      { key: 'column1', name: 'Source', fieldName: 'source', minWidth: 100 },
      { key: 'column2', name: 'Excerpt', fieldName: 'excerpt', minWidth: 200 },
      { key: 'column3', name: 'Score', fieldName: 'score', minWidth: 40 },
      { key: 'column4', name: 'Accept', fieldName: 'select', minWidth: 45 }
    ];
  
    const renderCheckbox = (item) => {
      return <Checkbox onChange={() => toggleCheckbox(selectedValue, item.excerpt)} checked={isSelected(selectedValue, item.excerpt)} />;
    };

    const isSelected = (assertionId, excerpt) => {
      return selectedItems.some(selectedItem => selectedItem.assertionId === assertionId && selectedItem.excerpt === excerpt);
    };
  
    const toggleCheckbox = (assertionId, excerpt) => {
      const isSelected = selectedItems.some(selectedItem => selectedItem.assertionId === assertionId && selectedItem.excerpt === excerpt);
  
      if (isSelected) {
        setSelectedItems(prevItems => prevItems.filter(item => !(item.assertionId === assertionId && item.excerpt === excerpt)));
      } else {
        setSelectedItems(prevItems => [...prevItems, { assertionId, excerpt }]);
      }
      console.log(selectedItems);
    };
    if (!assertions || assertions.length === 0) {
        return <div>No assertions available.</div>;
      }
    let selectedAssertion = assertions.find((assertion) => assertion.id === selectedValue);
    if(selectedValue === null) {      
      selectedAssertion =assertions[0]
      setSelectedValue(assertions[0].id);
    }

    return (
    <div className={styles.tabContainer}>
      <div className={styles.tabStyle}>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        {assertions && assertions.map((assertion,index) => (
          <Tab 
            key={assertion.id}
            value={ assertion.id}
            id={assertion.id}
          >
            {index+1}
          </Tab>
        ))}
      </TabList>
      </div>
      
      {selectedAssertion  &&  
      <div className={styles.tabContent}>
        {selectedAssertion.articleName} 
          <DetailsList
                  items={selectedAssertion.topRanks.map((rank, index) => ({
                      key: index,
                      source: rank.source,
                      excerpt: rank.excerpt,
                      score: rank.score.toFixed(4),
                      select: renderCheckbox(rank)
                  }))}
                  columns={columns}
                  layoutMode={DetailsListLayoutMode.justified}
                  selectionMode={SelectionMode.none}
                  />
              
      </div>
      }
      {chatItem.sender == "bot" && chatItem.shortMessage && chatItem.shortMessage == "accept" &&
            <div className={styles.copyInsertStyle}><CopyInsert item={chatItem} selectedItems={selectedItems} selectedTab={selectedValue}></CopyInsert></div>}
    </div>
    );
  };