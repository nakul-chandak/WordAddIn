import { Stack } from "@fluentui/react";
import { Avatar, Button, CounterBadge, makeStyles, selectClassNames, SelectTabData, SelectTabEvent, Tab, TabList, TabListProps, TabValue } from "@fluentui/react-components";
import * as React from "react";
import Propmt from "../PromptPage/Propmt";
import FactCheck from "../FactCheckPage/FactCheck";
import Review from "../ReviewPage/Review";
import GetPrompt from "./GetPrompts";
import { useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

const useStyles = makeStyles({
    root: {
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: "50px 20px",
      rowGap: "20px",
      marginTop:"20px"
    },
    badge:{
      width:"25px",
      height:"25px",
      marginRight: "7px",
      marginBottom: "2px"
    },
    borderSet:{
      width:"100%",
      border: "1px solid #dcdcdc"
    }
    
  });

 
const InformationPage = () => {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] =  React.useState<TabValue>("review");
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    event = event;
    setSelectedValue(data.value);
  };

    const styles = useStyles();
  const redirectToHomeScreen = () =>{
    navigate('/');
  }

    return (
    <div className={styles.root}>
      {/* <Button onClick={redirectToHomeScreen}>Back</Button> */}
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab value="prompt"> <CounterBadge appearance="filled" style={selectedValue === "prompt"? {backgroundColor:"#8647D6",color:"white"}:{backgroundColor:"#ebebeb",color:"#616161"}} count={1} className={styles.badge} />Prompt</Tab>
        <Tab value="review"><CounterBadge appearance="filled" style={selectedValue === "review"? {backgroundColor:"#8647D6",color:"white"}:{backgroundColor:"#ebebeb",color:"#616161"}} count={2} className={styles.badge} />Review</Tab>
        <Tab value="factCheck"><CounterBadge appearance="filled" style={selectedValue === "factCheck"? {backgroundColor:"#8647D6",color:"white"}:{backgroundColor:"#ebebeb",color:"#616161"}} count={3} className={styles.badge} />Fact Check</Tab>
      </TabList>
      <div>
        {selectedValue === "prompt" && <HomePage/>}
        {selectedValue === "review" && <Review />}
        {selectedValue === "factCheck" && <FactCheck />}
      </div>
    </div>
  )
}

export default InformationPage