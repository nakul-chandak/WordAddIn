import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, makeStyles, Textarea, tokens, typographyStyles } from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons';
import React  from 'react'

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
   
   
   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      settextAreaInput(e.target.value);
      setTotalCharacters(e.target.value.length);
    };

    const handleCloseDialog = (isClose) => {
      props.setDialog(isClose);
      settextAreaInput("");
      setTotalCharacters(0);
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
                      type="submit"
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
                      children: "Findings",
                      className: styles.subTitle,
                    }}>
                    <div style={{backgroundColor:"#F9FAFB", minWidth:"250px",height:"150px"}}></div>
                  </Field>  
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