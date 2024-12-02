import { Dropdown, DropdownProps, makeStyles, typographyStyles, useId } from '@fluentui/react-components';
import React, { useEffect, useState } from 'react'
import { ReviewDetails } from './ReviewDetails';
import { LlmService } from '../../../common/services/llm/llm.service';
import { IReview } from '../../../interfaces/review';
import { useNavigate } from 'react-router-dom';


const useStyles = makeStyles({
  root: {

  },
  text: typographyStyles.title2,
});

function Review(props: any) {
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const loadPrompt = () => {    
    if (props != undefined && props.promptRequest != undefined 
      && props.promptRequest.prompt != undefined 
      && props.promptRequest.prompt != ''
      && props.promptRequest.prompt != null) {
      LlmService.getLlms(props.promptRequest).then(res => {
        setResult([]);
        console.log("result of Get llms API");
        console.log(res);
        Object.keys(res.output).map(function (key) {
          const data: IReview = { promptType: key, description: res.output[key], buttonCaption: "Fact Checker", isDisLike: !res.isFavorite, isLike: res.isFavorite };
          setResult(oldResult => [...oldResult, data]);
        });

        console.log(result);
      })
    }else{
      navigate('/');
    }
  }

  const onFactCheckClick = () => {
    props.onFactCheckClick(result);
  }

  useEffect(() => loadPrompt(), []);

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
      <div style={{ width: "100%" }}>
        <Dropdown style={{ marginLeft: "5px", minWidth: "100px" }}
          aria-labelledby={`${comboId}-small`}
          placeholder="Select"
          size="small"
          id="drop1"
          defaultValue={defaultValue}
          disabled="true"
          {...props}
        >
          {options.map((option) => (
            <option key={option}>
              <span>{option}</span>
            </option>))}
        </Dropdown>
        <Dropdown style={{ marginLeft: "5px", minWidth: "100px" }}
          aria-labelledby={`${comboId}-small`}
          placeholder="Select"
          size="small"
          id="drop2"
          disabled="true"
          defaultValue={defaultValue2}
          {...props}
        >
          {options2.map((option) => (
            <option key={option}>
              <span>{option}</span>
            </option>))}
        </Dropdown>
      </div>
      <ReviewDetails data={result} onFactCheckClick={onFactCheckClick} />
    </>


  )
}

export default Review
