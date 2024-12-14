import React, { useEffect, useState } from "react";
import { Dropdown, makeStyles, ToastBody, typographyStyles, useId } from "@fluentui/react-components";
import { ReviewDetails } from "./ReviewDetails";
import { LlmService } from "../../../common/services/llm/llm.service";
import { IReview } from "../../../interfaces/review";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Field,
  RadioGroup,
  Radio,
  Spinner,
  Avatar,
  Toaster,
  useToastController,
  ToastTitle,
  Toast,
  ToastIntent,
} from "@fluentui/react-components";

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
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  const showErrorToast = (error: any) => {
    let msg = "An unexpected error occurred.";
    let route = '';
    if (error?.statusCode === 400) {
      msg = "Bad Request: Please check your input.";
    } else if (error?.statusCode === 404) {
      msg = "Unauthorized: Please singup.";
      route = '/signin';
    } else if (error?.statusCode === 500) {
      msg = "Server Error: Please try again later.";
      route = '/signin';
    } else if (error?.statusCode === 429) {
      msg = "You have exceeded your daily limit.";
      route = '/signin';
    } else if (error?.message) {
      msg = error.message;
    }
    dispatchToast(
      <Toast>
        {/* <ToastTitle action={<Link>Undo</Link>}>Email sent</ToastTitle> */}
        <ToastBody>{msg}</ToastBody>
        {/* <ToastFooter>
          <Link>Action</Link>
          <Link>Action</Link>
        </ToastFooter> */}
      </Toast>,
      { intent: "error" }
    );
    navigate(route);
  };

  const loadPrompt = () => {
    if (
      props?.promptRequest?.prompt &&
      props.promptRequest.prompt.trim() !== ""
    ) {
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
        // Log detailed error information for debugging
        if (error.response) {
          console.log("Error response status:", error.response.status);
          console.log("Error response data:", error.response.data);
        }

        showErrorToast(error);
        });
    } else {
      navigate("/");
    }
  };

  const loadLazy = (promptResults: IReview[], res: any) => {
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
        // Log detailed error information for debugging
        if (error.response) {
          console.log("Error response status:", error.response.status);
          console.log("Error response data:", error.response.data);
        }

        showErrorToast(error);
      })
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
      <Toaster toasterId={toasterId} />
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

      {result.length > 0 && (
        <ReviewDetails
          data={result}
          onFactCheckClick={onFactCheckClick}
          articles={articles} // Pass articles so child can update dynamically
        />
      )}

      {lazyLoading && <p>Loading additional data...</p>}
    </>
  );
}

export default Review;
