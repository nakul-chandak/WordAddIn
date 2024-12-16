import React, { useState } from "react";
import { createContext } from "react";
import ToastMsg from "../taskpane/components/sharedComponent/Toaster";
import { ToasterType } from "../common/types/toasterTypes";

// 1st step create context
export const ToastContext = createContext<{ addToast: (toaster:ToasterType) =>void }>(null);

export const ToastProvider = ({children}) => {
   
    const[toasts,setToasts]= useState<ToasterType[]>([]); 
    return (
        <ToastContext.Provider value={{addToast(toast) { setToasts((arr)=> {
            return [...arr, toast];
        })},}}>
            {children}
            {toasts.map((t,index:number)=>(
                <ToastMsg  key={index} toast={t} />
            ))}
            
        </ToastContext.Provider>
        )   
}