import { makeStyles, Image, Checkbox, Button, CounterBadge, Textarea, useRestoreFocusTarget } from "@fluentui/react-components";
import * as React from "react";
import log from "../../../../assets/logo.png";
import guardraiLogo from "../../../../assets/AI_Logos/guardrail.png";
import chatgpt3Logo from "../../../../assets/AI_Logos/chatgpt3.png";
import chatgpt4Logo from "../../../../assets/AI_Logos/chatgpt4.png";
import geminiLogo from "../../../../assets/AI_Logos/gemini1.png";
import copilotLogo from "../../../../assets/AI_Logos/copilot.png";
import { InfoLabel } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import { LlmService } from "../../../common/services/llm/llm.service";
import { useToaster } from "../../../hooks/useToast";
import PromptProtect from "./PromptProtect";

const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "0px 20px 50px 10px",
        rowGap: "20px",
    },
    backButton: {
        top: "10px",
        right: "40px",
        position: "absolute",
    },
    headerBar: {
        height: "50px",
        background: "white",
        padding: "10px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    badge: {
        backgroundColor: "#8647D6",
        color: "white",
        fontSize: "16px",
        marginRight: "10px",
        height: "23px !important",
        width: "23px !important"
    },
    bottomPortion: {
        height: '350px',
        background: 'rgb(247,247,247)',
        overflowX:'hidden'
    },
    checkboxContainer: {
        display: "flex",
        justifyContent: "flex-start",
        flexGrow: '1',
        height: "100px",
        padding: "10px",
        position: 'relative',
        bottom: '2rem',
    },
    checkboxWrapper: {
        display: "flex",
        alignItems: "center",
    },
    checkboxLabel: {
        marginLeft: "5px",
        fontSize: "14px",
    },
    textareaWrapper: {
        marginTop: "10px",
    },
    container: {
        //position: "relative",
        //width: "300px", // Adjust based on your layout
        display: "flex",
        alignItems: "center",
        position: 'relative',
        justifyContent: 'center',
        bottom: '4rem',
        padding: '10px',
    },
    textarea: {
        width: "100%",
        padding: "0, 40px", // Add space for the button
        height: '100px',
        borderRadius: '10px'
    },
    button: {
        position: "absolute",
        right: "2rem",
        top: '4rem',
        //bottom: "40px",
        zIndex: 1,
    },
    infoLabel: {
        position: 'relative',
        bottom: '4rem',
        left: '0.5rem'
    }
});

const getLogo = (id: string) => {
    switch (id) {
        case "guardrail":
            return guardraiLogo;
        case "gpt3":
            return chatgpt3Logo;
        case "gpt4":
            return chatgpt4Logo;
        case "copilot":
            return copilotLogo;
        case "gemini":
            return geminiLogo;
        default:
            return "";
    }
};
const logoArray = [
    
    { label: "GPT 3", id: "gpt3" },
    { label: "GPT 4", id: "gpt4" },
    { label: "Gemini", id: "gemini" },
    { label: "Guardrail LLM", id: "guardrail" }
];

function HomePage() {
    const styles = useStyles();
    const navigate = useNavigate();
    const toaster = useToaster();
    const state = {
        button: 1
      };
    const [selectedOptions, setSelectedOptions] = React.useState<string[] | null>([]);
    const [textInput, setTextInput] = React.useState("");
    const [dialog,setDialog] = React.useState(false);
    const [warmPromptList,setWarmPromptList] =React.useState([]);

    //this flag is for setting up the content on FINDINGS on protected prompt screen
    const [flag, setFlag] = React.useState(false)

    const handleChange = (newValue)  => {
        setTextInput(newValue);
        handleApiCall(newValue);
     };

    const handleApiCall = async (newValue:string) => {
        LlmService.getOptimizedPrompts({ initial_prompt: newValue }).then((res: any) => {
            const data = res;
            data.originalInput = newValue;
            data.selectedOptions = selectedOptions;
            navigate('/optimized-prompt', { state: data });
            console.log("API Response:", data);
        },(error:any)=>{
            toaster.error("The application has encountered an error. Please try again later.");
            console.log(error);
        })
    };

    const callPromptProtectApi = async () => {
        setWarmPromptList([]);
        const request:any = {
            check_for_profanity:true,
            prompt: textInput
        }
        LlmService.getProtectedPrompt(request)
        .then((res:any)=>{
            if(!res.promptsInfoResponseDto.map (y=>y.profanityCheckResponseDto.length > 0)[0]) { 
                toaster.info('No warnings found');
                setFlag(true);
                setDialog(false)
                handleApiCall(textInput)
            }
            else {
                setFlag(false);
                setDialog(true);
                findWarningPropmtWords(res);
            }
        },(error:any)=>{
            toaster.error(error.message);
            //handleApiCall();
            console.log(error);
        }
    )
    }

    const findWarningPropmtWords = (promptResponse:any) => {
        const result = promptResponse.promptsInfoResponseDto.map(x=>Array.from(new Set(x.profanityCheckResponseDto.map(y=>y.profanity))));
        setWarmPromptList(result.filter((item,idx)=>result.findIndex(x=>x[0] == item[0]) == idx));
       }
   
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted");
        console.log("Selected Options:", selectedOptions);
        console.log("Textarea Input:", textInput);
        if(state.button === 1)
        {
            handleApiCall(textInput);
        }
        else if(state.button === 2) {
            callPromptProtectApi()
            //setDialog(true);
            //navigate('/prompt-protect', { state: textInput });
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;
        setSelectedOptions((prev) =>
            checked ? [...prev, id] : prev.filter((option) => option !== id)
        );
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextInput(e.target.value);
    };

    const handleUseEdited = (value:any) =>{
        setTextInput(value)
    }

    return (
        <div style={{ margin: "auto" }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '1rem' }}>
                <Image
                    alt="Guardrail"
                    src={log}
                    height={70}
                    width={'200px'}
                    style={{ padding: '10px' }}
                />
            </div>

            <div style={{ marginTop: "25px", backgroundColor: "#3977D1", padding: "15px", color: "white", textAlign: "center" }}>
                {/* Generate Better AI result with <br /> */}
                Prompt Protect and Fact <br />
                Checker in just 3 easy steps
            </div>

            <div className={styles.headerBar}>
                <CounterBadge
                    appearance="filled"
                    className={styles.badge}
                    count={1}
                />
                Choose AI's To Prompt
            </div>
            <form id="aiPromptForm" onSubmit={handleSubmit}>
                <div className={styles.bottomPortion}>
                    <div className={styles.checkboxContainer}>
                        {logoArray.map(({ label, id }) => (
                            <div key={id} className={styles.checkboxWrapper}>
                                <Checkbox
                                    id={id}
                                    name="checkboxOptions"
                                    value={label}
                                    onChange={handleCheckboxChange}
                                    disabled={id === 'guardrail' ? true : false}
                                />
                                <img style={{ marginTop: "-1px", float: "left", marginLeft:id === 'guardrail' ? '-0.7x' : '0px' }} height={id === 'guardrail' ? '22' : '20'} src={getLogo(id)} alt={`${label} logo`} />
                            </div>
                        ))}
                    </div>
                    <div className={styles.container}>
                        <Textarea
                            placeholder="Type your text here..."
                            className={styles.textarea}
                            value={textInput}
                            onChange={handleTextareaChange}
                        />
                        <div>
                            <Button
                                disabled={textInput.length === 0 || selectedOptions.length === 0}
                                appearance="primary"
                                type="submit"
                                name="promtProtectButton"
                                onClick={() => state.button = 2}
                                className={styles.button}
                                style={{right:"2rem"}}
                            >
                                Prompt Protect
                            </Button>
                            <PromptProtect 
                                textInput={textInput} warmPromptList={warmPromptList} openDialog ={dialog} 
                                setDialog={setDialog} handleUseEdited={handleUseEdited} 
                                flag={flag} handleChange={handleChange}/>
                            {/* <Button
                                disabled={textInput.length === 0 || selectedOptions.length === 0}
                                appearance="primary"
                                type="submit"
                                name="checkBoxButton"
                                onClick={() => state.button = 1}
                                className={styles.button}
                            >
                                Submit
                            </Button> */}
                        </div>
                    </div>
                    <div style={{width: "119px"}}>
                        <div className={styles.infoLabel}>
                            <InfoLabel
                                info={
                                    <>
                                        This is example information for prompting.
                                    </>
                                }
                            >
                            </InfoLabel>
                            <span style={{marginTop: "0px", float: "right"}}>Prompting Tips</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default HomePage