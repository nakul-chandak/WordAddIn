import React, { useRef, useState } from "react";
import { PrimaryButton, List, initializeIcons, IIconProps, SpinnerSize } from "@fluentui/react";
import { AssertionResult } from "../../common/services/article/models/ArticleResponse";
import { tokens, makeStyles, shorthands } from "@fluentui/react-components";
import { ArticleProcessRequest } from "../../common/services/article/models/ArticleProcessRequest";
import { ArticleService } from "../../common/services/article/article.service";
import { SearchBox } from "./SearchBox";
import { ClearConversation } from "./ClearConversation";
import { ConversationContainer } from "./ConversationContainer";
import { ChatGptRequest } from "../../common/services/llm/models/ChatGptRequest";
import { LlmResponse } from "../../common/services/llm/models/llmResponse";
import { LlmService } from "../../common/services/llm/llm.service";
import { ProfanityCheckRequest } from "../../common/services/prompt-protect/models/ProfanityCheckRequest";
import { PromptProtectService } from "../../common/services/prompt-protect/prompt-protect.service";
import { PromptProtectResponseDto } from "../../common/services/prompt-protect/models/PromptProtectResponse";

const useStyles = makeStyles({
  list: {
    marginTop: "20px",
  },
  listItem: {
    paddingBottom: "20px",
    display: "flex",
  },
  icon: {
    marginRight: "10px",
  },
  iconButton: {
    backgroundColor: "white",
    height: "25px",
    marginLeft: "5px",
    ...shorthands.border("1px", "solid", "#bbc7df"),
    ...shorthands.borderRadius("5px"),
  },

  itemText: {
    fontSize: tokens.fontSizeBase300,
    fontColor: tokens.colorNeutralBackgroundStatic,
    marginRight: "10px",
    marginLeft: "10px",
  },
  itemTextBot: {
    fontSize: tokens.fontSizeBase300,
    fontColor: tokens.colorPaletteRedBorder1,
    marginRight: "10px",
    marginLeft: "10px",
  },
  welcome__main: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  message: {
    fontSize: tokens.fontSizeBase500,
    fontColor: tokens.colorNeutralBackgroundStatic,
    fontWeight: tokens.fontWeightRegular,
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  fixed: {
    flexDirection: "row",
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
    fontSize: tokens.fontSizeBase500,
    marginBottom: "10px",
  },
});

const ChatUI = ({ onContentChange }) => {
  initializeIcons();
  const styles = useStyles();

  const savedState = localStorage.getItem("conversationState");
  const conversationState = savedState ? JSON.parse(savedState) : [];
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState(conversationState);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleConversationDelete = () => {
    setConversation([]);
  };

  const getTopRankData = (data: AssertionResult) => {
    let output: string
    if (data && data.assertions && data.assertions.length > 0 && data.assertions[0].topRanks && data.assertions[0].topRanks.length > 0) {
      output = data.assertions[0].topRanks.map(a => `${a.excerpt}`).toString();
    }
    return output
  }

  const botConversationMessage = async (message: string,disAppear: boolean=false) => {
    setConversation((prevConversation) => [
      ...prevConversation.filter(a=>a.disAppear!=true),
      { sender: "bot", shortMessage: "ignore", disAppear:disAppear },
    ]);
    await displayTypingEffect(message, 10)
  }

  async function promptProtectCheck(userInput: string) {
    let promptProtectMessage = "We are validating your query...";
    let isValidPrompt: boolean = false;
    const profanityCheckRequest = new ProfanityCheckRequest(userInput);
    let promptProtectResponse: PromptProtectResponseDto = await PromptProtectService.ProcessPromptProtect(profanityCheckRequest);
    console.log(promptProtectResponse);
    if (promptProtectResponse) {
      let promptInfos = promptProtectResponse.promptsInfoResponseDto;
      if (!promptInfos || promptInfos.length == 0) isValidPrompt = true;
      for (const info of promptInfos) {
        let promptChecks = info.profanityCheckResponseDto;
        if (!promptChecks || promptChecks.length == 0) isValidPrompt = true;
        break;
      }
    }
    if (isValidPrompt) {
      promptProtectMessage = "The given sentence is safe to be posted for querying";
    } else {
      promptProtectMessage = "Please provide a valid query, unable to process due to unacceptable content";
    }
    setConversation((prevConversation) => [
      ...prevConversation,
      { sender: "bot", message: promptProtectMessage, shortMessage: "ignore",disAppear:true },
    ]);
    await displayTypingEffect(promptProtectMessage, 5);
    return isValidPrompt;
  }

  async function getLlmOutput(userInput: string) {
    let llmOutput:string=undefined;
    const  gptInput= new ChatGptRequest(userInput);
      let gptResponse: LlmResponse = await LlmService.processLlm(gptInput);
      if(gptResponse){
        llmOutput= gptResponse.output.gpt3;      
        setConversation((prevConversation) => [
          ...prevConversation,
          { sender: "bot", message: llmOutput, shortMessage: "ignore",disAppear:false },
        ]);
        await displayTypingEffect(llmOutput, 5);
      }
      return llmOutput;
  }

  const sendMessage = async () => {
    if (!userInput.trim()) return; // Ignore empty messages
    const newConversation = [...conversation, { sender: "user", message: userInput }];
    setConversation(newConversation);
    setUserInput(""); // Clear input field
    setIsLoading(true);

    try {
      const botStartMessage = "We are verifying your query, thank you for your patience..."
      await botConversationMessage(botStartMessage,true)

      const isValidPrompt=await promptProtectCheck(userInput);
      if(!isValidPrompt) {
        setIsLoading(false);
        return
      }
      const llmOutput=await getLlmOutput(userInput)
      if(!llmOutput) {
        setIsLoading(false);
        return
      };
      console.log(`articleInput: ${llmOutput}`)
      const articleInput = new ArticleProcessRequest(llmOutput);

      const botInfoMessage = "We are fact checking the above response, thank you for your patience..."
      await botConversationMessage(botInfoMessage,true)

      const response: AssertionResult = await ArticleService.processArticle(articleInput);
      console.log(response);
      // let response: AssertionResult = DefaultAssertionsData;
      // const randomIndex: number = Math.floor(Math.random() * response.assertions[0].topRanks.length);
      //let result: string = response.assertions[0].topRanks[randomIndex].excerpt;
      
      setConversation((prevConversation) => [
        ...prevConversation.filter(a=>a.disAppear!=true),
        { sender: "bot", messageObj: response, shortMessage: "accept" },
      ]);
      let shortMessage = response === undefined ? userInput : getTopRankData(response).slice(0, 200) + "..."
      await displayTypingEffect(shortMessage, 5)     
    } catch (error) {
      console.error("Error sending message to GPT:", error);
    }
    setIsLoading(false);

  };

  const displayTypingEffect = async (message, typingDelay = 5) => {

    let typedMessage = ""; // Initialize an empty string to store the typed message
    for (let i = 0; i < message.length; i++) {
      typedMessage += message[i]; // Append the current character to the typed message
      setConversation((prevConversation) => {
        const updatedConversation = [...prevConversation];
        updatedConversation[updatedConversation.length - 1] = {
          ...updatedConversation[updatedConversation.length - 1], // Keep the previous message properties intact
          message: typedMessage, // Update the message with the typed message
        };
        return updatedConversation;
      });
      await sleep(typingDelay); // Wait for the typing delay
    }
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };  

  React.useEffect(() => {        
    localStorage.setItem("conversationState", JSON.stringify(conversation));
  }, [conversation]);


  React.useEffect(() => {
    if (onContentChange) {
      // If the onContentChange callback is provided, call it to trigger scrolling in the parent
      onContentChange();
    }
    scrollToBottom();
  }, [onContentChange, conversation]);


  return (
    <div style={{  marginBottom: "20px", backgroundColor: "#dae4f7" }}>
      <ConversationContainer  items={conversation}></ConversationContainer>
      <div className={styles.fixed}>
        {conversation.length > 0 &&
          <ClearConversation handleConversationDelete={handleConversationDelete}></ClearConversation>}
        <SearchBox userInput={userInput} isLoading={isLoading} handleUserInput={handleUserInput} sendMessage={sendMessage}></SearchBox>
      </div>      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatUI;



