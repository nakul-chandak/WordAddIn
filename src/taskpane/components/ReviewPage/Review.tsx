import React, { useEffect, useState } from "react";
import { Dropdown, makeStyles, typographyStyles, useId } from "@fluentui/react-components";
import { ReviewDetails } from "./ReviewDetails";
import { LlmService } from "../../../common/services/llm/llm.service";
import { IReview } from "../../../interfaces/review";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  root: {},
  text: typographyStyles.title2,
});

function Review(props: any) {
  const [result, setResult] = useState<IReview[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lazyLoading, setLazyLoading] = useState(false); // For tracking lazy loading state
  const response = props.data;
  const navigate = useNavigate();

  const loadPrompt = () => {
    if (
      props?.promptRequest?.prompt &&
      props.promptRequest.prompt.trim() !== ""
    ) {
      LlmService.getLlms(props.promptRequest).then((res) => {
        const promptResults = Object.keys(res.output).map((key) => ({
          promptType: key,
          description: res.output[key],
          buttonCaption: "Fact Checker",
          isDisLike: !res.isFavorite,
          isLike: res.isFavorite,
          isDisable: true
        }));
        setResult(promptResults);
        console.log("Prompt loaded:", promptResults);
        loadLazy(promptResults, promptResults); // Continue with lazy loading
      });
    } else {
      navigate("/");
    }
  };

  const loadLazy = (promptResults: IReview[], res:any) => {
    setLazyLoading(true);
    const requests = promptResults.map((data) => {
      const request = {
        article: data.description,
        checkForSimilarity: true,
        recursion_level: 3,
        sourceType: data.promptType,
        top_k: 10,
        top_n: 5,
      };
      return LlmService.getArticles(request);
    });
  
    Promise.all(requests)
      .then((responses) => {
        const allArticles = responses.map((response, index) => ({
          promptType: promptResults[index].promptType,
          articles: response,
        }));
        
        // Update articles state
        setArticles(allArticles);
        
        // Adjust 'isDisable' based on which prompts received data
        // let updatedResult = res.map((_rs, _index) => {
        //   const isReceivedData = responses[_index]?.length > 0; // Check if data was received
        //   return {
        //     ..._rs,
        //     isDisable: !isReceivedData, // Disable if no data received
        //   };
        // });
        // Create a Map from res to allow for O(1) lookups by promptType
        const resultMap = new Map(res.map((r: any) => [r.promptType, r]));
        let finalRes = [];
        allArticles.forEach((article: any) => {
          const r:any = resultMap.get(article.promptType);
          r.isDisable = false;
          if (r) {
            //setResult(r);
            finalRes.push(r)
            //navigate('review')
          }
        });

        setResult(finalRes);
        //setResult(updatedResult); // Update the results accordingly
        console.log("Articles loaded:", allArticles);
      })
      .catch((error) => console.error("Error fetching articles:", error))
      .finally(() => setLazyLoading(false));
  };
  

  const onFactCheckClick = (promptType: string) => {
    const finalResult = {
      result: articles,
      promptType: promptType,
    };
    props.onFactCheckClick(finalResult);
  };

  useEffect(() => {
    loadPrompt();
  }, []); // Load prompt on mount

  const options = ["Change Tone"];
  const options2 = ["Make it concise"];
  const styles = useStyles();
  const comboId = useId("combobox");
  const defaultValue = options[0];
  const defaultValue2 = options2[0];

  return (
    <>
      <div style={{ width: "100%" }}>
        <Dropdown
          style={{ marginLeft: "5px", minWidth: "100px" }}
          aria-labelledby={`${comboId}-small`}
          placeholder="Select"
          size="small"
          id="drop1"
          defaultValue={defaultValue}
          disabled
          {...props}
        >
          {options.map((option) => (
            <option key={option}>
              <span>{option}</span>
            </option>
          ))}
        </Dropdown>
        <Dropdown
          style={{ marginLeft: "5px", minWidth: "100px" }}
          aria-labelledby={`${comboId}-small`}
          placeholder="Select"
          size="small"
          id="drop2"
          disabled
          defaultValue={defaultValue2}
          {...props}
        >
          {options2.map((option) => (
            <option key={option}>
              <span>{option}</span>
            </option>
          ))}
        </Dropdown>
      </div>

      {/* Render ReviewDetails immediately after loadPrompt */}
      {result.length > 0 && (
        <ReviewDetails
          data={result}
          onFactCheckClick={onFactCheckClick}
          articles={articles} // Pass articles so child can update dynamically
        />
      )}

      {/* Optionally display a loading indicator for lazy loading */}
      {lazyLoading && <p>Loading additional data...</p>}
    </>
  );
}

export default Review;