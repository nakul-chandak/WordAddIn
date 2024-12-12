import { makeStyles, typographyStyles } from '@fluentui/react-components';
import React from 'react'
import AIPromt from './AIPromt';

const useStyles = makeStyles({
    root :{
       
    },
    text: typographyStyles.title2,
});

function FactCheck(props:any) {
  const styles = useStyles();
  //const state = props.state;
  const [state, setState] = React.useState(props.state)
  const promptType = props.promptType;
  //const [promptType, setPromptType] = React.useState(props.promptType)
    //const data = props.response;
    const [data, setData] = React.useState(props.response)
  React.useEffect(()=>{
    
  })
  return (
    <div  className={styles.root+ '' + styles.text}><AIPromt state={state} promptType={promptType} data={data}/></div>
  )
}

export default FactCheck