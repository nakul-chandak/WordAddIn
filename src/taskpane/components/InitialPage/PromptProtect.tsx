import { Button,Image, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, makeStyles, Textarea, tokens, typographyStyles } from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons';
import React, { useEffect }  from 'react'
import { LlmService } from '../../../common/services/llm/llm.service';
import { useToaster } from '../../../hooks/useToast';
import  thumbsUp from '../../../../assets/thumbsup.png';
const useStyles = makeStyles({
  flex:{
    display:"flex"
  },
  justifyBetween: {
    justifyContent: "space-between"
},
itemStart: {
 alignItems:"flex-start"
},
flexWrap:{
  flexWrap:"wrap"
},
itemCenter:{
  alignItems:"center"
},
inputActionItem:{
  alignItems:"center",
  borderRadius:"4px",
  display:"flex",
  gap:"8px",
  left:"212px",
  padding:"8px 12px"
  
},
subTitle: {
  ...typographyStyles.title3,
  fontWeight: tokens.fontWeightBold,
}
})


function PromptProtect(props: any) {
  const styles = useStyles();
   const [textAreaInput, settextAreaInput] = React.useState("");
   const [totalCharacters, setTotalCharacters] = React.useState(0);
   const [apiFlagForPromptProtection, setApiProtectedPrompt]= React.useState(props.flag);
   const toaster = useToaster();
   React.useEffect(() => {
    // Check if location.state is available
    if (props.textInput) {
      settextAreaInput(props.textInput);
    }
  }, [props.textInput]);

  React.useEffect(() => {
    // Check if location.state is available
    // if (props.flag) {
    //   setApiProtectedPrompt(props.flag);
    // }
    setApiProtectedPrompt(props.flag)
  }, [props.flag]);
   
   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      settextAreaInput(e.target.value);
      setTotalCharacters(e.target.value.length);
    };

    const handleCloseDialog = (isClose) => {
      props.setDialog(isClose);
      //settextAreaInput("");
      //setTotalCharacters(0);
    }

    const handleUseEdited = () =>{
      props.handleUseEdited(textAreaInput)
      props.setDialog(false);
    }

    const rerunProtectedPrompt = () =>{
      const request:any = {
        check_for_profanity:true,
        prompt: textAreaInput
    }
      LlmService.getProtectedPrompt(request)
      .then((res:any)=>{
          console.log(res)
          res.promptsInfoResponseDto.forEach((promptResponse:any)=>{
              if(promptResponse.profanityCheckResponseDto.length == 0){
                  toaster.info('No warnings found');
                  setApiProtectedPrompt(true)
                  setTimeout(()=>{
                    props.handleApiCall()
                  }, 3000)
              }else{
                setApiProtectedPrompt(false)
              }
          })

      },(error:any)=>{
          toaster.error(error.message);
          console.log(error);
          //props.handleApiCall()
      })
    }

  return (
 
  <Dialog open={props.openDialog} onOpenChange={(_event, data) => handleCloseDialog(data.open)}>
  <DialogSurface>
    <DialogBody>
      <DialogTitle
        action={
          <DialogTrigger disableButtonEnhancement action="close">
            <Button 
              appearance="subtle"
              aria-label="close"
              icon={<Dismiss24Regular />}
            />
          </DialogTrigger>
        }
      >
       Prompt Protect
      </DialogTitle>
      <DialogContent>
            <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-xl6">
                  <Field
                    label={{
                      children: "INPUT",
                      className: styles.subTitle,
                    }}>
                    <Textarea style={{minWidth:"250px",height:"150px"}}  
                      size='large' appearance="outline"
                      value={textAreaInput} 
                      onChange={handleTextareaChange} />
                  </Field>
                  <div style={{marginTop:"10px"}}>
                    <Button
                      disabled={textAreaInput.length === 0}
                      appearance="primary"
                      onClick={rerunProtectedPrompt}
                      name="promtProtectButton1"
                      style={{ right: "9rem" }}
                      size="small"
                    >
                      Run Prompt Protect
                    </Button>
                    <span style={{float:"right",fontWeight:600}}>{totalCharacters} characters</span>

                  </div>
                  
            </div>
            <div className="ms-Grid-col ms-sm12 ms-xl6">
                  <Field
                    label={{
                      children: "FINDINGS",
                      className: styles.subTitle,
                    }}>
                    <div style={{ 
                      backgroundColor: "#F9FAFB", 
                      minWidth: "250px", 
                      height: "150px", 
                      display: "flex", 
                      justifyContent: "center", 
                      alignItems: "center"
                    }}>
                      {apiFlagForPromptProtection ? <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'1rem'}}><div><Image alt="thumbsup" src={thumbsUp} height={32} width={32} /></div><div>Prompt is good to go</div></div> : <span>Please edit content</span>}
                    </div>

                  </Field>  
                  <div style={{display:"flex", marginTop:"10px"}}>
                    <Button
                      appearance="secondary"
                      onClick={()=>{
                        handleCloseDialog(false)
                      }}
                      name="cancel"
                      style={{  marginRight:'10px' }}
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      appearance="primary"
                      name="Use Edited"
                      style={{ right: "9rem" }}
                      size="small"
                      onClick={()=>{
                        handleUseEdited()
                      }}
                    >
                      Use Edited
                    </Button>
                    </div>
            </div>
            </div>
            </div>
      </DialogContent>
      {/* <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
            <Button appearance="primary">Do Something</Button>
          </DialogActions> */}
    </DialogBody>
  </DialogSurface>
</Dialog>
  )
}

export default PromptProtect