import { makeStyles, Image, Checkbox, Button, CounterBadge, Textarea } from "@fluentui/react-components";
import * as React from "react";
import log from "../../../../assets/guardrail-ai.png";
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
import { AppContext } from "../../../context/appContext";

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
        padding: "0px 10px 10px 10px",
        position: 'relative',
        bottom: '1rem',
        marginTop:"1rem",
        marginBottom:"2rem"
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
    
    { label: "GPT 3", id: "gpt3", disable:false },
    { label: "GPT 4", id: "gpt4",  disable:false },
    { label: "Gemini", id: "gemini",  disable:false },
    { label: "Guardrail AI", id: "guardrail",  disable:true }
];

function HomePage() {
    const styles = useStyles();
    const navigate = useNavigate();
    const toaster = useToaster();
    const appContext = React.useContext(AppContext);

    const state = {
        button: 1
      };
    const [selectedOptions, setSelectedOptions] = React.useState<string[] | null>(["gpt3"]);
    const [textInput, setTextInput] = React.useState("");
    const [dialog,setDialog] = React.useState(false);
    const [warmPromptList,setWarmPromptList] =React.useState([]);
    const [checkedAll,setCheckedAll] = React.useState(false);

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
            appContext.setAITypes(selectedOptions);
            navigate('/optimized-prompt', { state: data });
        },(_error:any)=>{
            toaster.error("The application has encountered an error. Please try again later.");
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
        }
    )
    }

    const findWarningPropmtWords = (promptResponse:any) => {
        const result = promptResponse.promptsInfoResponseDto.map(x=>Array.from(new Set(x.profanityCheckResponseDto.map(y=>y.profanity))));
        setWarmPromptList(result.filter((item,idx)=>result.findIndex(x=>x[0] == item[0]) == idx));
       }
   
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(state.button === 1)
        {
            handleApiCall(textInput);
        }
        else if(state.button === 2) {
            callPromptProtectApi()
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

    const handleSelectAll =(e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        if(checked) {
            const result = logoArray.filter(aiType=> !aiType.disable).map (aiType=> aiType.id);
            setSelectedOptions(result);
        }
        else {
            appContext.setAITypes([]);
            setSelectedOptions([]);
        }
    }

    React.useEffect(() => {
        if(appContext.aiTypes.length == 0) {
            setSelectedOptions(["gpt3"]);
        }
        else{
            setSelectedOptions(appContext.aiTypes);
        }
        const allSelected = appContext.aiTypes.length >=3 ? true : false;
        setCheckedAll(allSelected);
    },[])

    React.useEffect(() => {
        const allSelected = selectedOptions.length >=3 ? true : false;
        setCheckedAll(allSelected);
        },[selectedOptions])

    return (
        <div style={{ marginTop: "3.5rem" }}>
            <div className={styles.headerBar}>
                <CounterBadge
                    appearance="filled"
                    className={styles.badge}
                    count={1}
                />
                Prompt
            </div>
            <form id="aiPromptForm" onSubmit={handleSubmit}>

                <div className={styles.bottomPortion}>
                <div style={{ display: "inline-flex", marginLeft: "10px", fontWeight: 600,marginTop:"5px" }}>
                    <Checkbox key="selectAll" id="selectAll" name="selectAllCheckBox" value="SelectAll" checked ={checkedAll} onChange={handleSelectAll} />
                    <span style={{ marginTop: "5px" }}>Select All</span>
                </div>
                    <div className={styles.checkboxContainer}>
                        {logoArray.map(({ label, id, disable }) => (
                            <div key={id} className={styles.checkboxWrapper}>
                                <Checkbox
                                    id={id}
                                    name="checkboxOptions"
                                    value={label}
                                    onChange={handleCheckboxChange}
                                    disabled={disable}
                                    checked= {selectedOptions.includes(id)}
                                />
                                <img style={{ marginTop: "-1px", float: "left", marginLeft:id === 'guardrail' ? '-0.7x' : '0px' }} height={id === 'guardrail' ? '22' : '20'} src={getLogo(id)} alt={`${label} logo`} />
                                <span style={{paddingLeft: "5px", paddingRight: "5px"}}>{label}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.container}>
                        <Textarea style={{maxHeight:"12rem"}}
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
                                style={{right:"1.2rem", top:"4.2rem"}}
                            >
                                Prompt Protect
                            </Button>
                            <PromptProtect 
                                textInput={textInput} warmPromptList={warmPromptList} openDialog ={dialog} 
                                setDialog={setDialog} handleUseEdited={handleUseEdited} 
                                flag={flag} handleChange={handleChange}/>
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