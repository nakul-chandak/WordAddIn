import * as React from "react";
import { Image, tokens, makeStyles, shorthands } from "@fluentui/react-components";

import { IIconProps, IconButton, PrimaryButton } from "@fluentui/react";
export interface NotificationProps {
  // title: string;
  // logo: string;
  message: string;
  notify: boolean;
}

const useStyles = makeStyles({
  notification_bar: {
    top: "38px",
    opacity: 0.9,
    display: "flex",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: "20px",
    ...shorthands.borderRadius("5px"),
    // paddingLeft: "15px",
    paddingBottom: "10px",
    backgroundColor: "#f24747",
    color: "#fff",
    height: "30px",
    width: "94%",
  },
  message: {
    fontSize: tokens.fontSizeBase400,
    marginLeft: "5px",
    fontWeight: tokens.fontWeightRegular,
    fontColor: "#ffff",
  },
  icon: {
    marginRight: "5px",
    marginLeft: "5px",
    marginTop: "5px",
  },
});

export const NotificationComponent = (props: NotificationProps) => {
  const styles = useStyles();
  const [showNotification, setShowNotification] = React.useState(false);
  const closeIcon: IIconProps = { iconName: "Cancel" };

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000); // Hide notification after 5 seconds
  };

  React.useEffect(() => {
    if (props.notify) handleShowNotification();
  }, [props.notify]);

  return (
    <div>
      {showNotification && (
        <div className={styles.notification_bar}>
          <h1 className={styles.message}>{props.message}</h1>

          <IconButton
            iconProps={closeIcon}
            aria-label="Close"
            onClick={() => setShowNotification(false)}
            styles={{
              root: {
                marginRight: "1px",
                marginTop: "2px",
                borderRadius: "5px",
                color: "white",
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
