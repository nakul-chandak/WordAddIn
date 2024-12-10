import { makeStyles, typographyStyles } from '@fluentui/react-components'
import React from 'react'
import ChooseAIPrompt from './ChooseAIPrompt';

const useStyles = makeStyles({
    root :{
    },
    text: typographyStyles.title2,
});
function Propmt() {
    const styles = useStyles();

  return (
    <div className={styles.root+ '' + styles.text}><ChooseAIPrompt/></div>
  )
}

export default Propmt