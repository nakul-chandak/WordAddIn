import { Button, Toast, Toaster,  ToastTitle, ToastTrigger, useId, useToastController } from '@fluentui/react-components'
import React, { useEffect }  from 'react'
import { ToasterType } from '../../../common/types/toasterTypes';
import { Dismiss24Regular } from '@fluentui/react-icons';

export type ToasterProps = {
    toast: ToasterType
}
function ToastMsg(props:ToasterProps) {
const toasterId = useId("toaster");
const { dispatchToast } = useToastController(toasterId);

useEffect(() => notify(), []);

const notify = () =>
    dispatchToast(
        <Toast>
          <ToastTitle 
          
          action={
            <ToastTrigger>
                <Button  style={{border:"transparent",marginTop:"-5px"}} icon={<Dismiss24Regular />} />
            </ToastTrigger>
          }
          >{props.toast.message}</ToastTitle>
        </Toast>,
        { intent:props.toast.intent }
      );

return (
    <>
    <Toaster toasterId={toasterId} position='top-end' offset={{horizontal:3,vertical:0}} />
    </>
  )
}

export default ToastMsg