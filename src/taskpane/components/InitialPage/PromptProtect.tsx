import { Button,Image, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, makeStyles, Textarea, tokens, typographyStyles, Divider } from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons';
import React, { useEffect, useState }  from 'react'
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
  fontSize:"14px"
}
})


function PromptProtect(props: any) {
  const styles = useStyles();
   const [textAreaInput, settextAreaInput] = React.useState("");
   const [totalCharacters, setTotalCharacters] = React.useState(0);
   const [apiFlagForPromptProtection, setApiProtectedPrompt]= React.useState(props.flag);
   const [warningPrompt, setWarningPrompt] = useState([]);
   const toaster = useToaster();
   
  React.useEffect(() => {
    settextAreaInput(props.textInput);
    setTotalCharacters(props.textInput?.length);
    setWarningPrompt(props.warmPromptList);
    setApiProtectedPrompt(props.flag)
  }, [props.flag, props.warmPromptList,props.textInput]);
   
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
        setWarningPrompt([]);
          console.log(res)
          if(!res.promptsInfoResponseDto.map (y=>y.profanityCheckResponseDto.length > 0)[0]) {
            toaster.info('No warnings found');
            setApiProtectedPrompt(true)
            setTimeout(()=>{
              props.handleApiCall()
            }, 3000);
          }
          else {
                findWarningPropmtWords(res);
                 setApiProtectedPrompt(false);
          }
      },(error:any)=>{
          setWarningPrompt([]);
          toaster.error(error.message);
          console.log(error);
          //props.handleApiCall()
      })
    }

    const findWarningPropmtWords = (promptResponse:any) => {
     const result = promptResponse.promptsInfoResponseDto.map(x=>Array.from(new Set(x.profanityCheckResponseDto.map(y=>y.profanity))));
     setWarningPrompt(result.filter((item,idx)=>result.findIndex(x=>x[0] == item[0]) == idx));
    }

  return (
 
  <Dialog  open={props.openDialog} onOpenChange={(_event, data) => handleCloseDialog(data.open)}>
  <DialogSurface style={{maxWidth:"60%"}}>
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
      style={{marginLeft:"8px"}}>
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
                  <div>
                   <span className={styles.subTitle}>FINDINGS</span>
                   {warningPrompt[0]?.length > 0 ? <span className={styles.subTitle} style={{float:"right", color:"#c098ce"}}> {warningPrompt[0].length} Warnings Found</span>:null }
                   </div>
                  <Field>
                    <div style={{ 
                      backgroundColor: "#F9FAFB", 
                      minWidth: "250px", 
                      height: "150px", 
                      justifyContent: "center", 
                      alignItems: "center",
                      fontSize:"16px",
                      fontWeight:"500",
                      marginTop:"5px"
                    }}>
                      {!apiFlagForPromptProtection && warningPrompt[0]?.length > 0 ? <div style={{marginTop:"10px"}}> <span style={{marginLeft:"10px"}}>Sensitive Text Found:</span> <span style={{backgroundColor:"#FEE2E2",padding:"0px 4px 4px 4px"}}> {warningPrompt.toString()} </span>
                      <Divider style={{marginTop:"10px"}} />
                      </div>
                           : null}
                      {apiFlagForPromptProtection? <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'1rem', marginTop:"8%"}}><div><Image alt="thumbsup" src={thumbsUp} height={32} width={32} /></div><div style={{marginTop:"-10px"}}>Prompt is good to go</div></div> : null}
                    </div>

                  </Field>

                  <div style={{float:"right", display:"flex", marginTop:"15px"}}>
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
    </DialogBody>
  </DialogSurface>
</Dialog>
  )
}

export default PromptProtect