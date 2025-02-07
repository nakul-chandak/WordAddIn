import * as React from "react";
import { Image, tokens, makeStyles, Divider } from "@fluentui/react-components";
import { Stack } from "@fluentui/react";
import GuardrailLogo from "../../../assets/guardrail-ai.png";
import {
  ArrowCircleRight24Regular,
  CodeText20Regular,
  SignOut24Regular,
  TextAlignJustify24Filled,
  TextExpand24Regular,
} from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import AppDrawer from "./sharedComponent/Drawer";
import { HeaderProps } from "../../interfaces/HeaderProps";
import { useMediaPredicate } from "react-media-hook";

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
    backgroundColor: "#F6F6F6",
    color: "#fff",
    height: "50px",
    width: "100%",
    zIndex: "9",
    paddingTop:"10px"
  },
  message: {
    fontSize: tokens.fontSizeBase300,
    marginLeft: "50px",
    fontWeight: tokens.fontWeightRegular,
    fontColor: "#ffff",
  },
  icon: {
    marginRight: "5px",
    marginLeft: "5px",
    marginTop: "5px",
    "&:hover": { backgroundColor:"#E7EDF8" }
  }
});

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {

  const styles = useStyles();

  const navigate = useNavigate();
  const appContext = React.useContext(AppContext);
  const biggerThan520 = useMediaPredicate("(min-width: 520px)");
  const biggerThan300 = useMediaPredicate("(min-width: 300px)");

  function handleClick() {
    navigate('/');
  }

  function logoff() {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("LoggedIn");
    navigate('/login')
  }

  function handlePatternMgmtClick() {
    navigate('/patterns-management');
  }

  function handleDrawer () {
      appContext.drawerAction(true);
  } 


  return (
    <section className={styles.welcome__header}>
      <AppDrawer ShowMenu={props.ShowMenu} />

      <div className="ms-Grid" style={{ width: '100%' }}>
        <div className="ms-Grid-row">

          {biggerThan300 && <div className="ms-Grid-col ms-sm4 ms-xl4" style={{ float: "left" }}>
            <ul style={{ listStyleType: 'none', paddingLeft: "5px" }}>
              <Image style={{ marginTop: "7px", marginBottom: "7px" }} height={40} src={GuardrailLogo} />
            </ul>
          </div>}

          <div className="ms-Grid-col ms-sm8 ms-xl8" style={{ float: "right", textAlign: "right" }}>
            {!biggerThan520 ? <div>
              <ul style={{ color: 'black', listStyleType: 'none', display: "inline-flex", marginTop: "22px", marginRight: "7px" }}>
                <li style={{ color: 'black', cursor: 'pointer' }} className={styles.icon} onClick={handleDrawer}>
                  <Stack style={{ alignItems: "center" }}>
                    <TextAlignJustify24Filled width={24} height={24} style={{ marginLeft: "15px", width: 24, height: 24 }} />
                  </Stack>
                </li>
              </ul>
            </div> :
              <ul style={{ color: 'black', listStyleType: 'none', display: "inline-flex" }}>
                <li style={{ color: 'black', cursor: 'pointer' }} className={styles.icon} onClick={handlePatternMgmtClick}>
                  <Stack style={{ alignItems: "center" }}>
                    <TextExpand24Regular/>
                    <span style={{ fontSize: "10px" }}>Pattern Management</span>
                  </Stack>
                </li>
                <Divider vertical />

                {props.ShowMenu.indexOf("NewPrompt") > -1 ? (<><li style={{ color: 'black', cursor: 'pointer' }} className={styles.icon} onClick={handleClick}>
                  <Stack style={{ alignItems: "center" }}>
                    <ArrowCircleRight24Regular />
                    <span style={{ fontSize: "10px" }}>New Prompt</span>
                  </Stack>
                </li>  <Divider vertical /> </>) : null}

                {props.ShowMenu.indexOf("LogOut") > -1 ? (<><li style={{ color: 'black', cursor: 'pointer' }} className={styles.icon} onClick={logoff}>
                  <Stack style={{ alignItems: "center" }}>
                    <SignOut24Regular />
                    <span style={{ fontSize: "10px" }}>Log Off</span>
                  </Stack>
                </li>  <Divider vertical /> </>) : null}
              </ul>}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Header;
