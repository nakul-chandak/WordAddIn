import { Stack } from "@fluentui/react";
import { Avatar, Button, CounterBadge, makeStyles, Tab, TabList, TabValue } from "@fluentui/react-components";
import * as React from "react";
import FactCheck from "../FactCheckPage/FactCheck";
import Review from "../ReviewPage/Review";
import GetPrompt from "./GetPrompts";
import { useLocation, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import { LlmService } from "../../../common/services/llm/llm.service";

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
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>("review");
  const [textInput, setTextInput] = React.useState<string>(""); // For storing input value
  const [loading, setLoading] = React.useState<boolean>(false); // Loading state
  const [error, setError] = React.useState<string | null>(null); // Error state
  const [apiCalled, setApiCalled] = React.useState<boolean>(false); // To track if API has been called
  const [response, setResponse]=React.useState<String>('');
  const styles = useStyles();

  React.useEffect(() => {
    // Check if location.state is available
    if (location.state && location.state.optimized_prompt) {
      setResponse(location.state.optimized_prompt); 
    }
  }, [location.state]);
  const onTabSelect = (_event: React.MouseEvent<HTMLElement>, data: { value: string }) => {
    setSelectedValue(data);
  };

  const redirectToHomeScreen = () => {
    navigate('/');
  };
  const redirectToFactCheck = (data: any) => {
    console.log('factcheck data' + data);
    const request = {
      article: data[0].description,
      assertions: [],
      checkForSimilarity: true,
      recursion_level: 3,
      sourceType: data.promptType,
      top_k: 10,
      top_n: 5
    }
    // LlmService.getArticles(request).then((response: any) => {
    //   console.log(response);
    // })
    setSelectedValue('factCheck');
  }

  return (
    <div className={styles.root}>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab value="prompt"
         style={{ pointerEvents: selectedValue !== 'prompt' ? 'none' :'auto' }}>
          <CounterBadge
            appearance="filled"
            style={selectedValue === "prompt" ? { backgroundColor: "#8647D6", color: "white", pointerEvents:'none', height: "23px !important", width: "23px !important"  } : { backgroundColor: "#ebebeb", color: "#616161", height: "23px !important", width: "23px !important" }}
            count={1}
            className={styles.badge}
          />
          Prompt
        </Tab>
        <Tab value="review" 
        style={{ pointerEvents: selectedValue !== 'review' ? 'none' :'auto' }}
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
          style={{ pointerEvents: selectedValue !== 'factCheck' ? 'none' :'auto' }}>
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

      <div style={{width: '100%'}}>
        {selectedValue === "prompt" && <HomePage/>}
        {selectedValue === "review" && <Review promptRequest={location.state} onFactCheckClick={ redirectToFactCheck} />}
        {selectedValue === "factCheck" && <FactCheck />}
      </div>

      {/* Error and Loading States */}
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default InformationPage;
