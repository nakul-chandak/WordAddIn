import { makeStyles, typographyStyles } from '@fluentui/react-components'
import React from 'react'
const ChooseAIPrompt = React.lazy(() => import("./ChooseAIPrompt"));
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const useStyles = makeStyles({
  root: {
  },
  text: typographyStyles.title2,
});
function Propmt() {
  const styles = useStyles();

  return (
    <div className={styles.root + '' + styles.text}><React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}><ChooseAIPrompt /></React.Suspense></div>
  )
}

export default Propmt