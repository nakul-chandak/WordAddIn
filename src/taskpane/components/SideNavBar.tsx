import React, { useState } from "react";
import { INavLinkGroup, INavStyles, Nav } from "@fluentui/react";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  welcome__header: {
    top: 0,
    left: 0,
    display: "flex",
    position: "fixed",
    flexDirection: "row",
    verticalAlign: "center",
    alignItems: "center",
    paddingBottom: "5px",
    backgroundColor: "#1e517b",
    color: "#fff",
    height: "30px",
    width: "100%",
  },
  NavContainer: {
    marginLeft: "10px",
  },
});

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        key: "Home",
        name: "Home",
        url: "https://guardrail.tech/",
        icon: "Home",
        target: "_blank",
      },
      {
        key: "AboutUs",
        name: "AboutUs",
        url: "https://guardrail.tech/about-us/",
        icon: "News",
        target: "_blank",
      },
      {
        key: "Search",
        name: "Search",
        url: "https://app.azdev.guardrail.tech/",
        icon: "Search",
        target: "_blank",
      },
    ],
  },
];

const navStyles: Partial<INavStyles> = {
  root: {
    width: "230px",
    boxSizing: "border-box",
    // border: "1px solid #eee",
    overflowY: "auto",
    height: "100vh",
    backgroundColor: "#1e517b",
    color: "#f5f5f5",
  },
  link: {
    color: "#fff !important", // Override link text color
    selectors: {
      ".ms-Nav-linkText": {
        color: "#acc1d1 !important", // Override link text color
      },
      ".ms-Icon": {
        color: "#acc1d1 !important", // Override icon color
      },
      "&.is-selected": {
        backgroundColor: "transparent !important", // Change to your desired color
      },
    },
  },
};

const SideNavBar = () => {
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const styles = useStyles();
  const handleLinkClick = (item?: any) => {
    setSelectedLinkId((prevSelectedId) => (prevSelectedId !== item.key ? item.key : null));
  };
  return (
    <div className={styles.NavContainer}>
      <Nav styles={navStyles} groups={navLinkGroups} onLinkClick={handleLinkClick} selectedKey={selectedLinkId} />
      <hr color="#a7aebe"/>
    </div>
    
  );
};

export default SideNavBar;
