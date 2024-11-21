import React from 'react'
import { Avatar, Badge, Button, Divider, Image } from "@fluentui/react-components";
import GuardrailLogo from "../../../../assets/Guardrail_WithName.png";
import chatGPTLogo from "../../../../assets/chatgpt_WithName.png";
import CopilotLogo from "../../../../assets/copilot_withname.png";
import data from "../../../Data/ReviewData.json";

import { CheckmarkRegular, Info16Regular, ThumbDislike16Filled, ThumbDislike16Regular, ThumbLike16Filled, ThumbLike16Regular, TriangleDown12Filled } from '@fluentui/react-icons';
export const ReviewDetails = () => {

  // need to call API and map data here....
  const reviews = data;

  function getLikeIcon(isLike: boolean) {
    if (isLike) {
      return <ThumbLike16Filled style={{ float: "right" }} />
    } else { return <ThumbLike16Regular style={{ float: "right" }} /> };
  }

  function getDisLikeIcon(isDislike: boolean) {
    if (isDislike) {
      return <ThumbDislike16Filled style={{ marginLeft: "10px", float: "right" }} />
    } else { return <ThumbDislike16Regular style={{ marginLeft: "10px", float: "right" }} /> };
  }

  function getLogo(promptType: string) {
    if (promptType.toLocaleLowerCase() === "guardrailai") {
      return GuardrailLogo;
    }
    else if (promptType.toLocaleLowerCase() === "chatgpt") { return chatGPTLogo }
    else if (promptType.toLocaleLowerCase() === "copilot") { return CopilotLogo }
    else {
      return ""
    }
  }

  return (
    <>
      {
        reviews.map((r, index: number) => {
          return (
            <div key={index} className="ms-Grid" dir="ltr">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm10 ms-xl12"> <Image height={50} src={getLogo(r.promptType)} /></div>

                {index == 0 ?
                  <div className="ms-Grid-col ms-sm2 ms-xl12" style={{ textAlign: "center", paddingLeft: "25px" }}>
                    <div style={{ display: "inline-flex" }}>
                      <Avatar icon={<Info16Regular />} size={20} />
                      <p style={{ fontSize: "10px", color: "gray", marginTop: 0, marginLeft: "5px" }}>ALERTS</p>
                    </div>
                    <div style={{ marginLeft: "25px", marginTop: "-20px" }}><TriangleDown12Filled style={{ width: 10, height: 10 }} color='gray' /></div>
                  </div> : null
                }

              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm11 ms-xl12" style={{ display: "inline-flex", marginTop: "-25px" }}><p>{r.description}</p>
                  <Divider style={{ marginLeft: "15px", marginBottom: "-15px" }} vertical />
                </div>
                <div className="ms-Grid-col ms-sm1">
                  {r.names.map((name: string, idx: number) => {
                    return (
                      <div style={{ marginBottom: "10px" }}>
                        <Avatar key={idx} name={name} size={20} shape="square" color='colorful' />
                      </div>
                    )
                  })}

                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm6">
                  <Button style={{ backgroundColor: "#8647D6", color: "white" }} size='small'>
                    <Badge style={{ backgroundColor: "#BE8BFF", color: "white", marginRight: "5px" }} size="small" icon={< CheckmarkRegular />} />{r.buttonCaption} </Button>
                </div>

                <div className="ms-Grid-col ms-sm4" style={{ marginBottom: "10px", marginLeft: "50px" }}>
                  {getDisLikeIcon(r.isDisLike)}
                  {getLikeIcon(r.isLike)}
                </div>
                <div className="ms-Grid-col ms-sm2" />
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm11" style={{ paddingRight: "10px" }}> <Divider />    </div>
              </div>
            </div>
          )
        })
      }
    </>
  )
}
