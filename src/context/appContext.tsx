import React,{ createContext, useState } from "react";
import { AppContextType } from "../interfaces/AppContextType";

const AppContext = createContext<AppContextType>({
    aiTypes:[],
    isDrawerOpen:false,
    setAITypes:(_types:string[])=>{},
    drawerAction:(_isOpen:boolean)=>{}
    });

const AppProvider = ({children}) => {
    const [aITypes, setaiTypes] = useState([]);
    const [open, setOpen] = useState(false);

    const setAITypes = (_type:string[]) => {
        setaiTypes(_type);
    }

    const drawerAction =(_isOpen:boolean)=> {
        setOpen(_isOpen);
    }

    return <AppContext.Provider value={{aiTypes:aITypes, isDrawerOpen:open, setAITypes: setAITypes,drawerAction:drawerAction}}>{children}</AppContext.Provider>;
    }

export {AppContext, AppProvider}