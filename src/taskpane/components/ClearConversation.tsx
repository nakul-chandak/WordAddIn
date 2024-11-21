import React from "react";
import { ActionButton } from "@fluentui/react/lib/Button";
import { makeStyles, shorthands } from "@fluentui/react-components";
import { IIconProps } from "@fluentui/react";
const useStyles = makeStyles({
  iconClearButton: {
    backgroundColor: "#ffffff",
    color: "#f90000",
    height: "25px",
    marginLeft: "5px",
    ...shorthands.border("1px", "solid", "#9c4040"),
    ...shorthands.borderRadius("5px"),
  },
});
export function ClearConversation(props) {
  const styles = useStyles();
  const clearIcon: IIconProps = {
    iconName: "Delete",
    styles: {
      root: {
        color: "#f40a0a", // Change the color here
      },
    },
  };
  return (<div style={{
    display: "flex",
    marginBottom: "5px",
    marginTop: "10px",
    justifyContent: "right",
    marginRight: "10px"
  }}>
    <ActionButton styles={{
      root: {
        color: 'red'
      },
      rootHovered: {
        color: 'blue',
        border: '1px solid blue',
        backgroundColor: "#e0e1e9"
      }
    }} className={styles.iconClearButton} onClick={() => {
      props.handleConversationDelete();
    }} iconProps={clearIcon} allowDisabledFocus>
      Clear
    </ActionButton>
  </div>);
}
