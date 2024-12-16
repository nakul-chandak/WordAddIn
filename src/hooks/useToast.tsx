import { useContext } from "react"
import { ToastContext } from "../context/toastContext"
import { ToastIntent } from "@fluentui/react-components";

export const useToaster= () =>{
 const {addToast}= useContext(ToastContext);

 const showToaster = (message:string,intent:ToastIntent) => {
    addToast({message:message,intent:intent});
 }

    return {
        success(message:string) {
            showToaster(message,"success");
        },

        error(message:string) {
            showToaster(message,"error");
        },
        info(message:string) {
            showToaster(message,"info");
        },
        warning(message:string) {
            showToaster(message,"warning");
        }
    }
}