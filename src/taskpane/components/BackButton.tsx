import * as React from "react";
import { IconButton } from "@fluentui/react/lib/Button";

export function BackButton(props) {
  return ( 
    <IconButton iconProps={{
      iconName: "ChevronLeft"
    }} aria-label="Search" onClick={props.handleBackButtonClick} // className={styles.hamburgerIconStyle}
      styles={{
        root: {
          top: 0,
          right: 10,
          position: "absolute",
          backgroundColor: "#689ac4",
          color: "white",
          zIndex: 1000,
          height: "34px"
        },
        rootHovered: {
          backgroundColor: "#1e517b",
          color: "white"
        }
      }} />);
}
