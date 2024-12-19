import { makeStyles, Image } from "@fluentui/react-components";
import React from "react";
import log from "../../../../assets/logo.png";

const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "0px 20px 50px 10px",
        rowGap: "20px",
    }
});

function ChooseAIPrompt() {
    const styles = useStyles();
  
    return (        
        <div style={{ margin: "auto", width: "60%", padding: "10px" }}>
            <Image
                alt="Guardrail"
                src={log}
                height={100}
            />

            <div style={{ marginTop: "25px", backgroundColor: "#3977D1", padding: "15px", color: "white", textAlign: "center" }}>
                {/* Generate Better AI result with <br /> */}
                Prompt Protect and Fact <br />
                Checker in just 3 easy steps
            </div>
        </div>    
    )
  }
  
  export default ChooseAIPrompt
