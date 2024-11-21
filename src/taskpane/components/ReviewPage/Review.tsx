import { Dropdown, DropdownProps, makeStyles, typographyStyles, useId } from '@fluentui/react-components';
import React from 'react'
import { ReviewDetails } from './ReviewDetails';


const useStyles = makeStyles({
  root :{
    
  },
  text: typographyStyles.title2,
});

function Review(props: Partial<DropdownProps>) {
  const options = [
    "Change Tone"
  ]
  const options2 = [
    "Make it concise"
  ]
  const styles = useStyles();
  const comboId = useId("combobox");
  const defaultValue = options[0];
  const defaultValue2 = options2[0];
  return (
    <>
    <div>
      <Dropdown style={{marginLeft:"5px",minWidth:"100px"}}
          aria-labelledby={`${comboId}-small`}
          placeholder="Select"
          size="small"
          id="drop1"
          defaultValue={defaultValue}
          {...props}
        >
        {options.map((option) => (
          <option key={option}>
            <span>{option}</span>
          </option>  ))}
        </Dropdown>
      <Dropdown style={{marginLeft:"5px",minWidth:"100px"}}
          aria-labelledby={`${comboId}-small`}
          placeholder="Select"
          size="small"
          id="drop2"
          defaultValue={defaultValue2}
          {...props}
        >
        {options2.map((option) => (
          <option key={option}>
            <span>{option}</span>
          </option>  ))}
        </Dropdown>
      </div>
    <ReviewDetails/>
    </>
    

  )
}

export default Review
