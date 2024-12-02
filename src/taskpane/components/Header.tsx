import * as React from "react";
import { Image, tokens, makeStyles, Divider } from "@fluentui/react-components";
import { Stack } from "@fluentui/react";
import GuardrailLogo from "../../../assets/logo.png";
import {
  ArrowCircleRight24Regular,
  ArrowSync24Regular,
  DocumentOnePageSparkle24Regular,
  DocumentSave24Regular,
} from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";

export interface HeaderProps {
  title: string;
  logo: string;
  message: string;
}

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
    zIndex: "9"
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
  },
});

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { title, logo, message } = props;
  const styles = useStyles();

  const navigate = useNavigate();

  function handleClick() {
    navigate('/');
  }

  function handleRegenerateClick() {
    window.location.reload(); 
  }

  return (
    <section className={styles.welcome__header}>
      <div style={{ width: '100%' }}>
        <div style={{ marginTop: "10px", float: 'left' }}>
          <ul style={{ listStyleType: 'none', paddingLeft: "5px" }}>
            <Image style={{ marginTop: "7px" }} height={40} src={GuardrailLogo} />
          </ul>
        </div>

        <div style={{ marginTop: "10px", float: 'right', marginRight: "15px" }}>
          <ul style={{ color: 'black', listStyleType: 'none', display: "inline-flex" }}>

            <li style={{ color: 'black', cursor: 'pointer' }} className={styles.icon} onClick={handleClick}>
              <Stack>
                <ArrowCircleRight24Regular style={{ marginLeft: "15px" }} />
                <span style={{ fontSize: "10px" }}>New Prompt</span>
              </Stack>
            </li>
            <Divider vertical />
            <li className={styles.icon} onClick={handleRegenerateClick} style={{ cursor: 'pointer' }}>
              <Stack>
                <ArrowSync24Regular style={{ marginLeft: "15px" }} />
                <span style={{ fontSize: "10px" }}>Regenerate</span>
              </Stack>
            </li>
            {/* <Divider vertical/>
          <li className={styles.icon}>
            <Stack>
            <DocumentOnePageSparkle24Regular style={{marginLeft:"5px"}}/>
            <span style={{fontSize: "10px"}}>New AI</span>
            </Stack>
            </li>
            <Divider vertical/>
          <li className={styles.icon}>
            <Stack>
            <DocumentSave24Regular style={{marginLeft:"15px"}}/>
            <span style={{fontSize: "10px"}}>Save Propmt</span>
            </Stack>
          </li> */}
          </ul>
        </div>
      </div>

    </section>
  );
};

export default Header;
