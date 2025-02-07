import { Body1Strong, Button, Caption1 } from '@fluentui/react-components'
import React, { useEffect } from 'react'
import backgroundIng from "../../../../assets/login-background.png"; 
import componyLogo from "../../../../assets/guardrail-ai.png"
import { useNavigate } from 'react-router-dom';

function LogIn() {
  const navigate = useNavigate();
  
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
  <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '10px' }}>
    <img style={{ width: '200px', height: '50px' }} src={componyLogo} />
  </div>

  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${backgroundIng})`,
      padding: '20px',
    }}
  >
    <div
      id="landing-left"
      style={{
        flex: 1,
        maxWidth: '600px',
        textAlign: 'center',
        marginBottom: '10px',
      }}
    >
      <h1 style={{ lineHeight: '2rem' }}>
        The most advanced integrated suite for AI productivity and protection
      </h1>
    </div>
    <div
      id="landing-right"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h1>Get Started</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
        <Button appearance="primary" type="submit" name="login" onClick={navigateSigInPage}>
          Sign In
        </Button>
        <Button appearance="primary" type="submit" name="createAccount" onClick={navigateSignUpPage}>
          Create Account
        </Button>
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