import * as React from "react";
import { tokens, makeStyles, shorthands } from "@fluentui/react-components";

export interface HeroListItem {
  icon: React.JSX.Element;
  primaryText: string;
}

export interface HeroListProps {
  message: string;
  items: HeroListItem[];
}

const useStyles = makeStyles({
  list: {
    marginTop: "10px",
    marginLeft: "-8px",
  },
  listItem: {
    paddingBottom: "5px",
    display: "flex",
  },
  icon: {
    marginRight: "5px",
  },
  itemText: {
    fontSize: tokens.fontSizeBase300,
    fontColor: tokens.colorNeutralBackgroundStatic,
  },
  welcome__main: {
    width: "100%",
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    backgroundColor: "#dae4f7",
  },
  content: {
    marginTop: "8px",
    marginLeft: "8px",
    marginRight: "8px",
    marginBottom: "8px",
    backgroundColor: "white",
    ...shorthands.border("1px", "solid", "#bbc7df"),
    ...shorthands.borderRadius("5px"),
  },
  message: {
    fontSize: tokens.fontSizeBase300,
    fontColor: tokens.colorNeutralBackgroundStatic,
    fontWeight: tokens.fontWeightRegular,
    paddingTop: "5px",
    paddingLeft: "10px",
    paddingRight: "5px",
  },
});

const HeroList = (props: HeroListProps) => {
  const { items, message } = props;
  const styles = useStyles();

  const listItems = items.map((item, index) => (
    <li className={styles.listItem} key={index}>
      <i className={styles.icon}>{item.icon}</i>
      <span className={styles.itemText}>{item.primaryText}</span>
    </li>
  ));
  return (
    <div className={styles.welcome__main}>
      <div className={styles.content}>
        <h2 className={styles.message}>{message}</h2>
        <ul className={styles.list}>{listItems}</ul>
      </div>
    </div>
  );
};

export default HeroList;
