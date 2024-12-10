import React from "react";
import { CopyInsert } from "./CopyInsert";
import { List } from "@fluentui/react";
import { AssertTabControl } from "./AssertTabControl";
export function ConversationContainer(props) {
  // const [assertionsAccept, setAssertionsAccept] = React.useState([]);

  return (
    <List
        items={props.items}
        onRenderCell={(item) => (          
          <div style={{
            display: "flex",
            marginBottom: "5px"
          }}>
            <div style={{
              backgroundColor: item.sender === "user" ? "#1e517b" : "#ffffff",
              color: item.sender === "user" ? "#ffffff" : "#5e5858f",
              padding: "5px 5px",
              borderRadius: "3px",
              marginLeft: "10px",
              marginRight: "10px",
              marginBottom: "2px",
              width: "95%"
            }}>
              {item.message}
              {
                /* {item.messageObj === undefined ? item.message : getTopRankData(item.messageObj).slice(0, 200) + "..."} */
              }
              {/* {item && item.messageObj && item.messageObj?.assertions?.length>0 && console.log(item.messageObj.assertions)} */}
              
              {item && item.messageObj && item.messageObj?.assertions?.length>0 &&  
                <AssertTabControl chatItem={item} assertions={item.messageObj.assertions} ></AssertTabControl>              
              }
              {/* {item.sender == "bot" && item.shortMessage && item.shortMessage == "accept" && 
              <CopyInsert item={item} acceptedAssertionScore={assertionsAccept}></CopyInsert>} */}
              
            </div>
          </div>
        )}
      />
  );
}
