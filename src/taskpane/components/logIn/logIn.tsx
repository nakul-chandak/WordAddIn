import { Body1Strong, Button, Caption1 } from '@fluentui/react-components'
import React, { useEffect } from 'react'
import backgroundIng from "../../../../assets/login-background.png"; 
import componyLogo from "../../../../assets/logo.png"
import { useNavigate } from 'react-router-dom';

function LogIn() {
  const navigate = useNavigate();
  
  function navigateSigInPage() {
    navigate('/signin');
  };

  useEffect(() => {
    // Simulate a load event
    const isAuthenticated = window.sessionStorage.getItem("LoggedIn");
    if(isAuthenticated != undefined 
      && isAuthenticated != '' 
      && isAuthenticated != null 
      && isAuthenticated === 'true')
    {
      navigate('/home');
      console.log("isAuthenticated :: " + isAuthenticated);
    }
  }, []);

  return (
    <>
          <div style={{marginTop :"10px", marginLeft:"10px", marginBottom:"5px"}}>
            <img style={{marginTop :"10px", width:"200px", height:"50px"}} src={componyLogo}/>            
          </div>

          <div style={{ minHeight: "85vh", alignItems: "center", display: "flex", backgroundImage: "url(" + backgroundIng + ")" }}>
            <div id='landing-left' style={{ marginLeft: "3.5rem", alignItems: "center", textAlign: "left", flexGrow: 1, flexShrink: 1, justifyContent: "center", width: "50%" }}>
              <h1 style={{lineHeight:"2rem"}}>Take control of AI Generated Content</h1>
              <div style={{ display: "grid" }}>
                    <Body1Strong>What is the original source ?</Body1Strong>
                    <Body1Strong>Is it a source you trust ?</Body1Strong>
                    <Body1Strong>Is There harmful or risky content ?</Body1Strong>
                    <Body1Strong>Can you assume responsibility for the content ?</Body1Strong>
              </div>
            </div>
            <div id='landing-right' style={{ textAlign: "center", flexGrow: 1, flexShrink: 1, justifyContent: "center" }}>
              <h1> Get Started</h1>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button appearance="primary" type="submit" name="login" onClick={navigateSigInPage}> Sign In </Button>
                <Button style={{ marginLeft: "15px", marginRight: "20px" }} appearance="primary" type="submit" name="createAccount"> Create Account </Button>
              </div>
            </div>
          </div>

          <div style={{textAlign:"center", marginTop:"5px"}}>
              <Caption1>Guardrail Technologies Inc., ©2024</Caption1>
          </div>
    </>
  )
}

export default LogIn
