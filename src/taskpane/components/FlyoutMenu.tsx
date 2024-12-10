import React, { useRef, useState } from "react";
import { ActionButton, IconButton } from "@fluentui/react/lib/Button";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import SideNavBar from "./SideNavBar";
import { IIconProps } from "@fluentui/react";
import { Document10020Regular, DocumentLightning20Regular } from "@fluentui/react-icons";

interface FlyoutMenuProps {
  onMenuItemClick: (menuItem: string) => void;
}

const useStyles = makeStyles({
  menu_list: {
    display: "flex",
    flexDirection: "column",
    verticalAlign: "center",
    alignItems: "center",
    paddingBottom: "5px",
    color: "#fff",
  },
  list: {
    marginTop: "40px",
    marginLeft: "10px",
  },
  listItem: {
    paddingBottom: "10px",
    paddingLeft: "10px",
    marginBottom: "5px",
    display: "flex",
    height: "20px",
  },
  icon: {
    marginLeft: "-2px",
    marginRight: "1px",
  },
  itemText: {
    fontSize: tokens.fontSizeBase300,
    fontColor: tokens.colorNeutralBackgroundStatic,
  },
  line:{
    color:"#a7aebe"
  }
});

const FlyoutMenu: React.FC<FlyoutMenuProps> = ({ onMenuItemClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const styles = useStyles();

  const [hoveredItems, setHoveredItems] = useState({});

  const handleMouseEnter = (index) => {
    setHoveredItems((prev) => ({ ...prev, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setHoveredItems((prev) => ({ ...prev, [index]: false }));
  };

  const listItemStyles = (index) => ({
    padding: "10px",
    cursor: "pointer",
    color: "#acc1d1",
    backgroundColor: hoveredItems[index] ? "lightblue" : "#1e517b", // Change background color on hover
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleMenuItemClick = (menuItem: string) => {
    // Close the menu
    setMenuOpen(false);
    // Notify the parent component about the selected menu item
    onMenuItemClick(menuItem);
  };

  const flyoutMenuStyle = mergeStyles({
    position: "fixed",
    top: 0, // Adjust as needed
    left: menuOpen ? "0" : "-240px", // Adjust as needed
    width: "240px",
    height: "100%",
    backgroundColor: "#1e517b",
    color: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    zIndex: 999,
    padding: 0,
    margin: 0,
    transition: "left .5s ease",
  });
  const addFriendIcon: IIconProps = { iconName: "AddFriend" };

  return (
    <>
      <div className={flyoutMenuStyle}>
        <div className={styles.list}>
          <div
            style={listItemStyles(0)}
            onMouseEnter={() => handleMouseEnter(0)}
            onMouseLeave={() => handleMouseLeave(0)}
            onClick={() => handleMenuItemClick("FactCheck")}
          >
            <i className={styles.icon}>{<DocumentLightning20Regular />}</i>{" "}
            <span className={styles.itemText}>FactCheck</span>
          </div>
          <div
            style={listItemStyles(1)}
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={() => handleMouseLeave(1)}
            onClick={() => handleMenuItemClick("Onboarding")}
          >
            <i className={styles.icon}>{<Document10020Regular />}</i>{" "}
            <span className={styles.itemText}>Onboarding</span>
          </div>
        </div>
        <hr className={styles.line} color="#a7aebe"/>
        <SideNavBar />

      </div>
      <IconButton
        iconProps={{ iconName: "GlobalNavButton" }}
        aria-label="Search"
        onClick={toggleMenu}
        // className={styles.hamburgerIconStyle}
        styles={{
          root: {
            top: 0,
            left: 0,
            position: "fixed",
            backgroundColor: "#689ac4",
            color: "white",
            zIndex: 1000,
            height: "34px",
          },
          rootHovered: {
            backgroundColor: "#1e517b",
            color: "white",
          },
        }}
      />
    </>
  );
};

export default FlyoutMenu;
