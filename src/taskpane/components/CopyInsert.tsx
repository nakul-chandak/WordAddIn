import React from "react";
import { ActionButton } from "@fluentui/react/lib/Button";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { IIconProps } from "@fluentui/react";
import { insertObjectIntoWord, insertObjectIntoWordDetail } from "../office-document";
import { NotificationComponent } from "./Notification";
import { stringifyObject } from "../../common/utils/stringifyObject";
const useStyles = makeStyles({
  iconButton: {
    backgroundColor: "white",
    height: "25px",
    marginLeft: "5px",
    ...shorthands.border("1px", "solid", "#bbc7df"),
    ...shorthands.borderRadius("5px"),
  },
});
export interface AcceptedTopRanks {
  assertionId: string;
  excerpt: string;
}
export function CopyInsert(props) {
  const [showNotification, setShowNotification] = React.useState(false);
  const copyIcon: IIconProps = { iconName: "Copy" };
  const insertIcon: IIconProps = { iconName: "Insert" };
  const selectedItems=props.selectedItems;
  const selectedValue=props.selectedTab;
  const styles = useStyles();
  const handleTextCopy = async (obj: any) => {
    setShowNotification(true);
    let outputText: string = stringifyObject(obj);
    await navigator.clipboard.writeText(outputText);
    setShowNotification(false);
  };

  const handleInsertObject = async (obj: any) => {
    try {
      await insertObjectIntoWord(obj,selectedItems,selectedValue);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleInsertObjectDetail = async (obj: any) => {
    try {
      await insertObjectIntoWordDetail(obj,selectedItems);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (<div >
    <ActionButton className={styles.iconButton} onClick={() => {
      handleTextCopy(props.item.messageObj);
    }} iconProps={copyIcon} allowDisabledFocus>
      Copy
    </ActionButton>
    <ActionButton className={styles.iconButton} onClick={() => {
      handleInsertObject(props.item.messageObj);
    }} iconProps={insertIcon} allowDisabledFocus>
      Insert
    </ActionButton>
    <ActionButton className={styles.iconButton} onClick={() => {
      handleInsertObjectDetail(props.item.messageObj);
    }} iconProps={insertIcon} allowDisabledFocus>
      InsertAll
    </ActionButton>
    {<NotificationComponent message="copied successfully to clipboard" notify={showNotification} />}
  </div>);
}
