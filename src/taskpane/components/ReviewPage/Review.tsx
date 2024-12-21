import React, { useEffect, useState } from "react";
import {
  Dropdown,
  makeStyles,
  ToastBody,
  typographyStyles,
  useId,
  Spinner,
  Toaster,
  useToastController,
  Toast,
} from "@fluentui/react-components";
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
  const [loading, setLoading] = useState(false); // Tracks overall loading state
  const [lazyLoading, setLazyLoading] = useState(false); // Tracks lazy loading state
  const navigate = useNavigate();
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

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

    dispatchToast(
      <Toast>
        <ToastBody>{msg}</ToastBody>
      </Toast>,
      { intent: "error" }
    );
  };

  const loadPrompt = () => {
    if (
      props?.promptRequest?.prompt &&
      props.promptRequest.prompt.trim() !== ""
    ) {
      setLoading(true); // Show loading spinner
      LlmService.getLlms(props.promptRequest)
        .then((res) => {
          const promptResults = Object.keys(res.output).map((key) => ({
            promptType: key,
            description: res.output[key],
            buttonCaption: "Fact Checker",
            isDisLike: !res.isFavorite,
            isLike: res.isFavorite,
            isDisable: true,
          }));
          setResult(promptResults);
          console.log("Prompt loaded:", promptResults);
          loadLazy(promptResults, promptResults); // Continue with lazy loading
        })
        .catch((error) => {
          console.error("Error loading prompts:", error);
          if (error.response) {
            console.log("Error response status:", error.response.status);
            console.log("Error response data:", error.response.data);
          }
          showErrorToast(error);
        })
        .finally(() => setLoading(false)); // Hide loading spinner
    } else {
      navigate("/");
    }
  };

  const loadLazy = (promptResults: IReview[], res: any) => {
    setLazyLoading(true); // Show lazy loading spinner
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

        setArticles(allArticles);

        const resultMap = new Map(res.map((r: any) => [r.promptType, r]));
        let finalRes = [];
        allArticles.forEach((article: any) => {
          const r: any = resultMap.get(article.promptType);
          if (r) {
            r.isDisable = false;
            finalRes.push(r);
          }
        });

        setResult(finalRes);
        console.log("Articles loaded:", allArticles);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        if (error.response) {
          console.log("Error response status:", error.response.status);
          console.log("Error response data:", error.response.data);
        }
        showErrorToast(error);
      })
      .finally(() => setLazyLoading(false)); // Hide lazy loading spinner
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
      <Toaster toasterId={toasterId} />
      <div style={{ width: "100%", marginTop: "10px" }}>
        {/* Show Spinner while loading */}
        {(loading || lazyLoading) ? (
          <div className="spinner-container">
            <Spinner size="medium" label="Loading..." />
          </div>
        ) : (
          <>
            <Dropdown
              style={{ marginLeft: "5px", minWidth: "100px" }}
              placeholder="Select"
              size="small"
              id="drop1"
              disabled
              defaultValue="Change Tone"
            >
              <option>Change Tone</option>
            </Dropdown>
            <Dropdown
              style={{ marginLeft: "5px", minWidth: "100px" }}
              placeholder="Select"
              size="small"
              id="drop2"
              disabled
              defaultValue="Make it concise"
            >
              <option>Make it concise</option>
            </Dropdown>
            {/* Render ReviewDetails */}
            {result.length > 0 && (
              <ReviewDetails
                data={result}
                onFactCheckClick={onFactCheckClick}
                articles={articles}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Review;
