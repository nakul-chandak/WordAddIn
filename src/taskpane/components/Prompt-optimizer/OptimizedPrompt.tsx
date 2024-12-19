import { CounterBadge, Field, InfoLabel, Radio, RadioGroup } from "@fluentui/react-components";
import React from "react";
import { makeStyles, Image, Checkbox, Button } from "@fluentui/react-components";
import log from "../../../../assets/logo.png";
import guardraiLogo from "../../../../assets/AI_Logos/guardrail.png";
import chatgpt3Logo from "../../../../assets/AI_Logos/chatgpt3.png";
import chatgpt4Logo from "../../../../assets/AI_Logos/chatgpt4.png";
import geminiLogo from "../../../../assets/AI_Logos/gemini1.png";
import copilotLogo from "../../../../assets/AI_Logos/copilot.png";
import { useLocation, useNavigate } from "react-router-dom";
import { promptRequest } from "../../../common/services/llm/models/promptRequest";

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
    },
    bottomPortion: {
        height: 'auto',
        background: 'rgb(247,247,247)'
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
        position: 'unset',
        bottom: '4rem',
        left: '0.5rem',
        marginTop: '8px'
    },
    bottomDiv: {
        padding: '15px',
        position: 'relative',
        bottom: '4.5rem',
        color: 'black',
        height: '380px',

    },
    innerDiv: {
        height: 'auto',
        width: '100%',
        marginTop: '1rem',
        border: 'solid grey 1px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgb(241,225, 227)'
    },
    btn: {
        borderRadius: '10px',
    },
    originalPrompt: {
        height: 'auto',
        wordBreak: 'break-all'
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




const OptimizedPromts = () => {
    const styles = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedOptions, setSelectedOptions] = React.useState<string[] | null>([]);
    const [originalPrompt, setOriginalPrompt] = React.useState<string>('');
    const [optimizedPrompt, setOptimizedPrompt] = React.useState<string>('');

    //test
    const [value, setValue] = React.useState("banana");
    const handleSubmit = (event: any) => {
        //throw new Error("Function not implemented.");
        console.log(event);
    };
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setSelectedOptions((prev) =>
            checked ? [...prev, value] : prev.filter((option) => option !== value)
        );
    };
    const handleClick = () => {
        let prompt = originalPrompt || optimizedPrompt;
        let selectedOptions = location.state.selectedOptions;
        const data: promptRequest = {
            prompt: prompt,
            optimisedResponse: false,
            sourceTypes: selectedOptions
        };
        navigate('/information', { state: data, replace:true })
    };
    const setPrompt1 = (_e: any, data: { value: string }) => {
        setOriginalPrompt(data.value);
        setOptimizedPrompt(''); // Reset the other radio group
    };

    const setPrompt2 = (_e: any, data: { value: string }) => {
        setOptimizedPrompt(data.value);
        setOriginalPrompt(''); // Reset the other radio group
    };
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
                                    checked={location.state.selectedOptions.includes(id)}
                                    onChange={handleCheckboxChange}
                                    disabled={id === 'guardrail' ? true : false}
                                />
                                <img style={{ marginTop: "-1px", float: "left", marginLeft: id === 'guardrail' ? '-0.7x' : '0px' }} height={id === 'guardrail' ? '22' : '20'} src={getLogo(id)} alt={`${label} logo`} />
                            </div>
                        ))}
                    </div>
                    <div className={styles.bottomDiv}>
                        <span style={{ fontWeight: 'bolder' }}>Optimize Prompt - get better AI results</span>
                        <div className={styles.innerDiv}>
                            <div style={{ flex: '1', borderRadius: '10px' }}>
                                <div style={{ padding: '10px' }}>
                                    <p style={{ fontWeight: 'bold' }}>ORIGINAL PROMPT</p>
                                    <Field label="">
                                        <RadioGroup value={originalPrompt} onChange={setPrompt1}>
                                            <Radio value={location.state.originalInput} label={location.state.originalInput}></Radio>
                                        </RadioGroup>
                                    </Field>
                                </div>
                            </div>

                            <div style={{ flex: '2', backgroundColor: 'white', borderRadius: '0 0 10px 10px' }}>
                                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ fontWeight: 'bold' }}>SUGGESTED PROMPT</p>
                                    <Field label="">
                                        <RadioGroup value={optimizedPrompt} onChange={setPrompt2}>
                                            <Radio value={location.state.optimized_prompt} label={location.state.optimized_prompt}></Radio>
                                        </RadioGroup>
                                    </Field>

                                    <div style={{
                                        // display: 'flex',
                                        // justifyContent: 'flex-start',
                                        // alignItems: 'center',
                                        gap: '1rem',
                                        marginTop: '10px',
                                        float: 'right'
                                    }}>
                                        <div
                                            style={{                                                
                                                float: 'right'
                                            }}
                                        ><span style={{
                                            fontSize: '11px',
                                            color: 'grey',
                                            float: 'left',
                                            marginTop: '7px',
                                            marginRight: '10px'
                                        }}>Select one optimal prompt and continue</span>
                                        <div style={{                                                
                                                float: 'right'
                                            }}>
                                        <Button appearance="primary"
                                            type="submit" disabled={originalPrompt === '' && optimizedPrompt === ''} onClick={handleClick} className={styles.btn}>Next</Button>
                                            </div>
                                        </div>
                                        
                                        {/* <Button
                                            disabled={textInput.length === 0 || selectedOptions.length === 0}
                                            appearance="primary"
                                            type="submit"
                                            name="checkBoxButton"
                                            className={styles.button}
                                        >
                                            Submit
                                        </Button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "119px" }}>
                            <div className={styles.infoLabel}>
                                <InfoLabel
                                    info={
                                        <>
                                            This is example information for prompting.
                                        </>
                                    }
                                >
                                </InfoLabel>
                                <span style={{ marginTop: "0px", float: "right" }}>Prompting Tips</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default OptimizedPromts