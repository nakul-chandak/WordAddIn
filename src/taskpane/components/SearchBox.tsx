import React from "react";
import { TextField, Stack, IIconProps } from "@fluentui/react";
import { IconButton } from "@fluentui/react/lib/Button";
import { Spinner } from "@fluentui/react-components";

export function SearchBox(props) {
  const searchIcon: IIconProps = { iconName: "Search" };
  return (<Stack styles={{
    root: {
      width: "96%",
      marginLeft: "8px",
      border: "1px solid #bbc7df",
      borderRadius: "5px"
    }
  }}>
    <Stack horizontal>
      <Stack.Item grow>
        <TextField placeholder="your query?" value={props.userInput} onChange={props.handleUserInput} borderless styles={{
          root: {
            marginLeft: "1px",
            borderRadius: "5px"
          }
        }} />
      </Stack.Item>   
      <div>
        {!props.isLoading && <IconButton iconProps={searchIcon} aria-label="Search" onClick={props.sendMessage} styles={{
          root: {
            backgroundColor: "white",
            marginRight: "1px",
            borderRadius: "5px"
          }
        }} />}
        {props.isLoading && <div style={{
          marginRight: "1px"
        }}><Spinner size="small" /></div>}
      </div>
    </Stack>

  </Stack>);
}
