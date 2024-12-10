import { makeStyles, typographyStyles } from '@fluentui/react-components';
import React from 'react'
import AIPromt from './AIPromt';

const useStyles = makeStyles({
    root :{
       
    },
    text: typographyStyles.title2,
});

function FactCheck() {
    const styles = useStyles();
  return (
    <div className={styles.root+ '' + styles.text}><AIPromt/></div>
  )
}

export default FactCheck