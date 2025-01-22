// AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import { UserService } from '../common/services/user/user.service';
import { useToaster } from '../hooks/useToast';
import { UserContextType } from '../interfaces/UserContextType';


const AuthContext = createContext<UserContextType> ({
  isAuthenticated:false,
  subscriptionPlan:"free",
  setAuthenticated : (_token:string) =>{},
  setSubscriptionPlan:() => {} 
});

const AuthProvider = ({ children }) => {
   const toaster = useToaster();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriptionPlan, setSubPlan] = useState(null);

  const getSubscriptionPlan = () => {
    UserService.me().then(res =>{
       setSubPlan(res.subscription.planName.toLowerCase());
    },(error)=>{
      toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
    })
  }

  const setSubscriptionPlan = () => {
    getSubscriptionPlan();
  }

  const setAuthenticated = (token) => {
    if(token) {
      sessionStorage.setItem("token",token);
      sessionStorage.setItem("LoggedIn","true");
      setIsAuthenticated(true);
    }
    else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("LoggedIn");
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if(token && !subscriptionPlan){
      getSubscriptionPlan();
    }
    }, [subscriptionPlan]);

  return <AuthContext.Provider value={{isAuthenticated:isAuthenticated, subscriptionPlan:subscriptionPlan, setAuthenticated,setSubscriptionPlan}}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };