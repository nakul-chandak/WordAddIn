import React, { useEffect, useState } from "react";
import {
  Dropdown,
  makeStyles,
  typographyStyles,
  Spinner
} from "@fluentui/react-components";
import { ReviewDetails } from "./ReviewDetails";
import { LlmService } from "../../../common/services/llm/llm.service";
import { IReview } from "../../../interfaces/review";
import { useNavigate } from "react-router-dom";
import { useToaster } from "../../../hooks/useToast";

const useStyles = makeStyles({
  root: {},
  text: typographyStyles.title2,
});

function Review(props: any) {
  const [result, setResult] = useState<IReview[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Tracks overall loading state
  const [lazyLoading, setLazyLoading] = useState(false); // Tracks lazy loading state
  const navigate = useNavigate();
  const toaster = useToaster();

  const showErrorToast = (error: any) => {
    let msg = "An unexpected error occurred.";
    if (error?.statusCode === 400) {
      msg = "Bad Request: Please check your input.";
    } else if (error?.statusCode === 402) {
      msg = "Unauthorized: Please sign in.";
      //navigate("/signin");
    } else if (error?.statusCode === 404) {
      msg = "Request endpoint not found.";
    } else if (error?.statusCode === 500) {
      msg = "Server Error: Please try again later.";
    } else if (error?.statusCode === 429) {
      msg = "You have exceeded your daily limit.";
      //navigate('/signin');
    } else if (error?.message) {
      msg = error.message;
    }

    toaster.error(msg);
  };

  const loadPrompt = () => {
    if (props?.promptRequest?.prompt?.trim() !== "") {
      setLoading(true); // Show loading spinner
  
      // Fetch the prompts and articles in parallel
      LlmService.getLlms(props.promptRequest)
        .then((res) => {
          const promptResults = Object.keys(res.output).map((key) => ({
            promptType: key,
            description: res.output[key],
            buttonCaption: "Fact Check",
            isDisLike: !res.isFavorite,
            isLike: res.isFavorite,
            isDisable: true,
          }));
  
          setResult(promptResults); // Set results immediately
  
          // Start loading articles concurrently with lazy loading
          loadLazy(promptResults);
        })
        .catch((error) => {
          console.error("Error loading prompts:", error);
          showErrorToast(error);
        })
        .finally(() => setLoading(false)); // Hide loading spinner once done
    } else {
      navigate("/"); // Navigate to home if no prompt is found
    }
  };
  
  const loadLazy = (promptResults: IReview[]) => {
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
  
    // Use Promise.all to fire all the requests concurrently
    Promise.all(requests)
      .then((responses) => {
        const allArticles = responses.map((response, index) => ({
          promptType: promptResults[index].promptType,
          articles: response,
        }));
  
        setArticles(allArticles); // Store articles in the state
  
        // Efficiently merge the promptResults with articles
        const finalResults = promptResults.map((promptData, _index) => {
          const relatedArticles = allArticles.find(
            (article) => article.promptType === promptData.promptType
          );
          if (relatedArticles) {
            // Update isDisable for each prompt once the article is loaded
            return {
              ...promptData,
              articles: relatedArticles.articles,
              isDisable: false,
            };
          }
          return promptData;
        });
  
        setResult(finalResults); // Update results with articles and isDisable status
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        showErrorToast(error);
      })
      .finally(() => {
        // No need to set lazyLoading here since it's already handled in `loadPrompt`
      });
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

  const styles = useStyles();

  return (
    <>
      <div style={{ width: "100%", marginTop: "10px", display:props.disply?'block':'none'}} >
        {/* Show Spinner while loading */}
          <>
            
            {/* Render ReviewDetails */}
            {result.length > 0 && (
              <ReviewDetails
                data={result}
                onFactCheckClick={onFactCheckClick}
                articles={articles}
              />
            )}
          </>
      </div>
    </>
  );
}

export default Review;
