import { makeStyles, typographyStyles } from '@fluentui/react-components';
import React from 'react'
const AIPromt = React.lazy(() => import("./AIPromt"));
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const useStyles = makeStyles({
  root: {

  },
  text: typographyStyles.title2,
});

function FactCheck(props: any) {
  const styles = useStyles();
  //const state = props.state;
  const [state, setState] = React.useState(props.state)
  const promptType = props.promptType;
  //const [promptType, setPromptType] = React.useState(props.promptType)
  //const data = props.response;
  const [data, setData] = React.useState(props.response)
  React.useEffect(() => {

  })
  return (
    <div className={styles.root + '' + styles.text}>
      <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
        <AIPromt state={state} promptType={promptType} data={data} />
      </React.Suspense>
    </div>
  )
}

export default FactCheck