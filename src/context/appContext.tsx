import React,{ createContext, useState } from "react";
import { AppContextType } from "../interfaces/AppContextType";

const AppContext = createContext<AppContextType>({
    aiTypes:[],
    setAITypes:(_types:string[])=>{}});

const AppProvider = ({children}) => {
    const [aITypes, setaiTypes] = useState([]);

    const setAITypes = (_type:string[]) => {
        setaiTypes(_type);
    }

    return <AppContext.Provider value={{aiTypes:aITypes, setAITypes: setAITypes}}>{children}</AppContext.Provider>;
    }

export {AppContext, AppProvider}