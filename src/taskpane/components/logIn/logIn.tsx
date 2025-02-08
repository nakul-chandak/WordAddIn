import { Body1Strong, Button, Caption1, makeStyles } from '@fluentui/react-components'
import React, { useEffect } from 'react'
import backgroundIng from "../../../../assets/login-background.png"; 
import componyLogo from "../../../../assets/guardrail-ai.png"
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  header1:{
      height: "calc(100vh - 25vh)",
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${backgroundIng})`,
      padding: '20px'
  },
  landingLeft:{
    flex: 1,
    maxWidth: '80vh',
    textAlign: 'center',
    marginBottom: '10px'
  },
  landingRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  }
});


function LogIn() {
  const navigate = useNavigate();
  const styles = useStyles();

  function navigateSigInPage() {
    navigate('/signin');
  };

  useEffect(() => {
    // Simulate a load event    
    const isAuthenticated = window.localStorage.getItem("LoggedIn");
    if(isAuthenticated != undefined 
      && isAuthenticated != '' 
      && isAuthenticated != null 
      && isAuthenticated === 'true')
    {
      navigate('/home');
    }
  }, []);
  const navigateSignUpPage = () =>{
    navigate('/signup')
  }
  return (
<>
      <div className="ms-Grid">

        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12 ms-xl12">
            <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '10px' }}>
              <img style={{ width: '200px', height: '50px' }} src={componyLogo} />
            </div>
          </div>
        </div>

        <div className= {` "ms-Grid-row" ${styles.header1}`}>
        <div className="ms-Grid-col ms-sm12 ms-xl12">
        <div className= "ms-Grid-row">
          <div className="ms-Grid-col ms-sm12 ms-xl6">
              <div id="landing-left" className={styles.landingLeft}>
                <h1 style={{ lineHeight: '2rem' }}>
                  The most advanced integrated suite for AI productivity and protection
                </h1>
              </div>
          </div>

          <div className="ms-Grid-col ms-sm12 ms-xl6">
          <div id="landing-right" className={styles.landingRight}>
                <h1>Get Started</h1>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
              <Button appearance="primary" size='small' type="submit" name="login" onClick={navigateSigInPage}>
                Sign In
              </Button>
              <Button appearance="primary" size='small' type="submit" name="createAccount" onClick={navigateSignUpPage}>
                Create Account
              </Button>
            </div>
          </div>
          </div>
        </div>
      </div>
      </div>

  <div style={{ textAlign: 'center', marginTop: '10px', padding: '10px' }}>
    <Caption1>Guardrail Technologies Inc., ©2025</Caption1>
  </div>
</>

  )
}

export default LogIn