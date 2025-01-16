import { CounterBadge, makeStyles, Tab, TabList, TabValue } from "@fluentui/react-components";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import Review from "../ReviewPage/Review";
import FactCheck from "../FactCheckPage/FactCheck";

const useStyles = makeStyles({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "50px 20px",
    rowGap: "20px",
    marginTop: "20px",
  },
  badge: {
    width: "25px",
    height: "25px",
    marginRight: "7px",
    marginBottom: "2px",
  },
  borderSet: {
    width: "100%",
    border: "1px solid #dcdcdc",
  },
});

const InformationPage = () => {
  const location = useLocation();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>("review");
  const [loading] = React.useState<boolean>(false); // Loading state
  const [error] = React.useState<string | null>(null); // Error state
  const [response, setResponse] = React.useState<String>('');
  const [data] = React.useState();
  const styles = useStyles();
  const [promptType, setPromptType] = React.useState();

  React.useEffect(() => {
    // Check if location.state is available
    if (location.state && location.state.prompt) {
      setResponse(location.state.prompt);
    }
  }, [location.state]);
  
  const onTabSelect = (_event: React.MouseEvent<HTMLElement>, data: { value: string }) => {
    setSelectedValue(data);
  };

  const redirectToFactCheck = (data: any) => {
    console.log('factcheck data' + data);
    setPromptType(data.promptType)
    // setRequest(request);
    console.log(data);
    setResponse(data);
    setSelectedValue('factCheck');
  }

  return (
    <div className={styles.root}>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab value="prompt"
          style={{ pointerEvents: selectedValue !== 'prompt' ? 'none' : 'auto' }}>
          <CounterBadge
            appearance="filled"
            style={selectedValue === "prompt" ? { backgroundColor: "#8647D6", color: "white", pointerEvents: 'none', height: "23px !important", width: "23px !important" } : { backgroundColor: "#ebebeb", color: "#616161", height: "23px !important", width: "23px !important" }}
            count={1}
            className={styles.badge}
          />
          Prompt
        </Tab>
        <Tab value="review" 
        style={{ pointerEvents: 'none'}}
        >
          <CounterBadge
            appearance="filled"
            style={selectedValue === "review" ? { backgroundColor: "#8647D6", color: "white", height: "23px !important", width: "23px !important" } : { backgroundColor: "#ebebeb", color: "#616161", height: "23px !important", width: "23px !important" }}
            count={2}
            className={styles.badge}
          />
          Review
        </Tab>
        <Tab
          value="factCheck"
          style={{ pointerEvents: 'none'}}>
          <CounterBadge
            appearance="filled"
            style={selectedValue === "factCheck"
              ? { backgroundColor: "#8647D6", color: "white", pointerEvents: 'none', height: "23px !important", width: "23px !important" }
              : { backgroundColor: "#ebebeb", color: "#616161", height: "23px !important", width: "23px !important" }}
            count={3}
            className={styles.badge}
          />
          Fact Check
        </Tab>
      </TabList>
      {/* <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}> */}
        <div style={{ width: '100%', border: 'solid 1px' }}>
          {selectedValue === "prompt" && <HomePage />}
          {selectedValue === "review" && <Review promptRequest={location.state} onFactCheckClick={redirectToFactCheck} />}
          {selectedValue === "factCheck" && <FactCheck state={location.state} data={data} promptType={promptType} response={response} />}
        </div>
      {/* </React.Suspense> */}

      {/* Error and Loading States */}
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default InformationPage;