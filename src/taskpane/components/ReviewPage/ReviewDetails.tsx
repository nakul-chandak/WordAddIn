import React from 'react'
import { Avatar, Badge, Button, Divider, Image, makeStyles, typographyStyles, Spinner } from "@fluentui/react-components";
import guardrail from "../../../../assets/AI_Logos/guardrail.png";
import chatgpt3 from "../../../../assets/AI_Logos/chatgpt3.png";
import chatgpt4 from "../../../../assets/AI_Logos/chatgpt4.png";
import gemini from "../../../../assets/AI_Logos/gemini1.png";
import copilot from "../../../../assets/AI_Logos/copilot.png";

import { CheckmarkRegular, ThumbDislike16Filled, ThumbDislike16Regular, ThumbLike16Filled, ThumbLike16Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  subtitle2: typographyStyles.subtitle2,
});

export const ReviewDetails = (props: any) => {
  const styles = useStyles();

  // need to call API and map data here....
  const reviews = props.data;
  console.log("Reviews in review details page.") 
  console.log(reviews);
  
  function getLikeIcon(isLike: boolean) {
    if (isLike) {
      return <ThumbLike16Filled style={{ float: "right" }} />;
    } else { 
      return <ThumbLike16Regular style={{ float: "right" }} />;
    }
  }

  function getDisLikeIcon(isDislike: boolean) {
    if (isDislike) {
      return <ThumbDislike16Filled style={{ marginLeft: "10px", float: "right" }} />;
    } else { 
      return <ThumbDislike16Regular style={{ marginLeft: "10px", float: "right" }} />;
    }
  }

  function getLogo(promptType: string) {
    switch (promptType) {
      case "gpt3":
        return chatgpt3;
      
      case "gpt4":
        return chatgpt4;

      case "copilot":
        return copilot;

      case "gemini":
        return gemini;

      default:
        return guardrail;
    }
  }

  function getAIName(promptType: string) {
    switch (promptType) {
      case "gpt3":
        return "GPT 3";
      
      case "gpt4":
        return "GPT 4";
      
      case "gemini":
        return "Gemini";
      
      case "copilot":
        return "Microsoft Copilot";
      
      default:
        return "Guardrail LLM";
    }
  }
  function handleClick(promptType: string) {
    props.onFactCheckClick(promptType);
  }

  return (
    <>
      {
        reviews?.map((r, index: number) => {
          return (
            <div key={index} className="ms-Grid" dir="ltr" style={{ marginTop: "20px", marginBottom: "10px" }}>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm10 ms-xl12" style={{ display: "inline-flex" }}>
                  <Image height={30} src={getLogo(r.promptType)} />
                  <span className={styles.subtitle2} style={{ margin: "3px 0px 0px 10px" }}>
                    {getAIName(r.promptType)}
                  </span>
                </div>
              </div>

              <div className="ms-Grid-row" style={{ marginTop: "10px" }}>
                <div className="ms-Grid-col ms-sm12 ms-xl12" style={{ display: "inline-flex", marginTop: "-10px" }}>
                  <p>{r.description}</p>
                </div>
                <div className="ms-Grid-col ms-sm1">
                  {r?.names?.map((name: string, idx: number) => {
                    return (
                      <div style={{ marginBottom: "10px" }}>
                        <Avatar key={idx} name={name} size={20} shape="square" color='colorful' />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm6">
                  {/* Conditionally render button or spinner based on r.isDisable */}
                  {r.isDisable ? (
                    <Button
                      disabled={true}
                      style={{ backgroundColor: "#8647D6", color: "white", position: "relative", height:'30px' }}
                      size="small"
                      icon={<Spinner size="extra-tiny" />}
                    >{r.buttonCaption}
                    </Button>
                  ) : (
                    <Button
                      style={{ backgroundColor: "#8647D6", color: "white", height:'30px' }}
                      size="small"
                      onClick={() => handleClick(r.promptType)}
                    >
                      <Badge style={{ backgroundColor: "#BE8BFF", color: "white", marginRight: "10px" }} size="small" icon={<CheckmarkRegular />} />
                      {r.buttonCaption}
                    </Button>
                  )}
                </div>
                <div className="ms-Grid-col ms-sm2" />
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12" style={{ marginTop: "5px", paddingRight: "10px" }}>
                  <Divider />
                </div>
              </div>
            </div>
          );
        })
      }
    </>
  );
}