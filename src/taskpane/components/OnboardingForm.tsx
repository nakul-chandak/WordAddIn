import * as React from "react";
import { TextField, Stack, PrimaryButton, IconButton, ActionButton, IIconProps, Text, Dialog, DialogFooter, DialogType } from "@fluentui/react";
import { makeStyles, shorthands } from "@fluentui/react-components";

export interface Secret {
  key: string;
  value: string;
}

interface SecretFormProps {
  initialSecret?: Secret;
  onSave: (secret: Secret) => void;
}

const useStyles = makeStyles({
  formContainer: {
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "20px",
    marginTop: "20px",
    marginLeft: "10px",
    marginRight: "10px",
    ...shorthands.border("1px", "solid", "#bbc7df"),
    ...shorthands.borderRadius("5px"),
    backgroundColor: "#fff",
  },
  inputStyle: {
    width: "96%",
    marginTop: "10px",
    marginLeft: "8px",
    ...shorthands.border("1px", "solid", "#bbc7df"),
    ...shorthands.borderRadius("5px"),
  },
  icon: {
    marginRight: "10px",
    ...shorthands.textDecoration("white"),
    color: "white",
  },
  textStyle: {
    marginLeft: "10px",
    color: "#020917", // Change text color to blue
    fontSize: "16px", // Set font size to 16px
    fontWeight: "bold", // Set font weight to bold
  },
  iconButton: {
    backgroundColor: "#164195",
    fontSize: "14px",
    color: "#bbc7df",
    height: "30px",

    marginLeft: "5px",
    ...shorthands.border("1px", "solid", "#bbc7df"),
    ...shorthands.borderRadius("5px"),
  },
});

const OnboardingForm: React.FC = () => {
  const [secret, setSecret] = React.useState<Secret>({ key: "", value: "" });
  const [showValue, setShowValue] = React.useState<boolean>(false);
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = React.useState<string>('');

  const styles = useStyles();

  const saveIcon: IIconProps = {
    iconName: "Save",
    styles: {
      root: {
        color: "#d7dff0", // Change the color here
      },
    },
  };
  const clearIcon: IIconProps = {
    iconName: "Clear",
    styles: {
      root: {
        color: "#d7dff0", // Change the color here
      },
    },
  };
  const okIcon: IIconProps = {
    iconName: "CheckMark",
    styles: {
      root: {
        color: "#d7dff0", // Change the color here
      },
    },
  };
  // Load secrets from localStorage on component mount
  React.useEffect(() => {
    const savedSecret = localStorage.getItem("Onboarding");
    if (savedSecret) {
      setSecret(JSON.parse(savedSecret));
    }
  }, []);

  // Update secrets in localStorage whenever they change
  // React.useEffect(() => {
  //   localStorage.setItem("Onboarding", JSON.stringify(secret));
  // }, [secret]);

  const handleSave = () => {
    // onSave(secret);
    localStorage.setItem("Onboarding", JSON.stringify(secret));
    setShowDialog(true);
    setDialogMessage('Saved successfully!');
  };
  const handleClear = () => {
    let initialSecret = { key: "", value: "" };
    setSecret(initialSecret);
  };

  const handleKeyChange = (newValue: string) => {
    setSecret({ ...secret, key: newValue });
  };

  const handleValueChange = (newValue: string) => {
    setSecret({ ...secret, value: newValue });
  };

  const hideDialog = () => {
    setShowDialog(false);
  };

  const toggleShowValue = () => {
    setShowValue(!showValue);
  };

  const iconButtonStyles = {
    root: {
      width: "100px", // Set the desired width here
    },
  };


  return (
    <div style={{ minWidth: "100%", backgroundColor: "#dae4f7", top: "35px", left: "0px", position: "absolute" }}>
      {/* <Header logo="assets/logo-filled.png" title={"Guardrail"} message="Guardrail 1.0" /> */}
      <Stack className={styles.formContainer}>
        <Stack tokens={{ childrenGap: 8 }}>
          <Text className={styles.textStyle} variant="medium">
            Enter Organization Id
          </Text>
          <TextField
            className={styles.inputStyle}
            value={secret.key}
            onChange={(_, newValue) => handleKeyChange(newValue || "")}
          />
          <Text className={styles.textStyle} variant="medium">
            Enter Guardrail Api Key
          </Text>
          <Stack className={styles.inputStyle}>
            <Stack horizontal>
              <Stack.Item grow>
                <TextField
                  type={showValue ? "text" : "password"}
                  value={secret.value}
                  onChange={(_, newValue) => handleValueChange(newValue || "")}
                  borderless
                  styles={{ root: { marginLeft: "1px", borderRadius: "5px" } }}
                />
              </Stack.Item>
              <IconButton
                iconProps={{ iconName: showValue ? "Hide" : "RedEye" }}
                title={showValue ? "Hide Value" : "Show Value"}
                ariaLabel={showValue ? "Hide Value" : "Show Value"}
                onClick={toggleShowValue}
                styles={{
                  root: {
                    backgroundColor: "white",
                    marginRight: "1px",
                    borderRadius: "5px",
                  },
                }}
              />
            </Stack>
          </Stack>
          <div
            style={{
              display: "flex",
              marginBottom: "20px",
              marginTop: "10px",
              justifyContent: "right",
              paddingRight: "5px",
            }}
          >
            <ActionButton
              styles={iconButtonStyles}
              className={styles.iconButton}
              onClick={handleSave}
              iconProps={saveIcon}
              allowDisabledFocus
            >
              Save
            </ActionButton>
            <ActionButton
              styles={iconButtonStyles}
              className={styles.iconButton}
              onClick={handleClear}
              iconProps={clearIcon}
              allowDisabledFocus
            >
              Clear
            </ActionButton>
          </div>
        </Stack>
        <Dialog
        hidden={!showDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Save Confirmation',
          subText: dialogMessage,
        }}
        modalProps={{
          isBlocking: false,
          styles: { main: { maxWidth: 450, borderRadius:"5px" } },
        }}
      >
        <DialogFooter>          
          <ActionButton
              styles={iconButtonStyles}
              className={styles.iconButton}
              onClick={hideDialog}
              iconProps={okIcon}
              allowDisabledFocus
            >
              Ok
            </ActionButton>
        </DialogFooter>
      </Dialog>
      </Stack>
    </div>
  );
};

export default OnboardingForm;
