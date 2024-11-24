import { makeStyles, Image, Checkbox, Button, CounterBadge, Textarea } from "@fluentui/react-components";
import * as React from "react";
import log from "../../../../assets/logo.png";
import guardraiLogo from "../../../../assets/AI_Logos/guardrail.png";
import chatgpt3Logo from "../../../../assets/AI_Logos/chatgpt3.png";
import chatgpt4Logo from "../../../../assets/AI_Logos/chatgpt4.png";
import geminiLogo from "../../../../assets/AI_Logos/gemini1.png";
import copilotLogo from "../../../../assets/AI_Logos/copilot.png";
import { InfoLabel, InfoLabelProps } from "@fluentui/react-components";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { promptRequest } from "../../../common/services/llm/models/promptRequest";
import { LlmService } from "../../../common/services/llm/llm.service";
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
    { label: "Guardrail LLM", id: "guardrail" },
    { label: "Microsoft Copilot", id: "copilot" }
];

function HomePage() {
    const styles = useStyles();
    const navigate = useNavigate();

    const [selectedOptions, setSelectedOptions] = React.useState<string[] | null>([]);
    const [textInput, setTextInput] = React.useState("");

    const handleApiCall = async () => {
        LlmService.getOptimizedPrompts({ initial_prompt: textInput }).then((res: any) => {
            const data = res;
            data.originalInput = textInput;
            data.selectedOptions = selectedOptions;
            navigate('/optimized-prompt', { state: data });
            console.log("API Response:", data);
        })
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted");
        console.log("Selected Options:", selectedOptions);
        console.log("Textarea Input:", textInput);
        handleApiCall();
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

    return (
        <div style={{ margin: "auto" }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '1rem' }}>
                <Image
                    alt="Guardrail"
                    src={log}
                    height={80}
                    width={'400px'}
                    style={{ padding: '10px' }}
                />
            </div>

            <div style={{ marginTop: "50px", backgroundColor: "#3977D1", padding: "40px", color: "white", textAlign: "center" }}>
                Generate Better AI result with <br />
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
                                />
                                <img height={id === 'guardrail' ? '25' : '20'} src={getLogo(id)} alt={`${label} logo`} />
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
                        <Button
                        disabled={textInput.length === 0 || selectedOptions.length === 0}
                            appearance="primary"
                            type="submit"
                            name="checkBoxButton"
                            className={styles.button}
                        >
                            Submit
                        </Button>
                    </div>
                    <div>
                        <div className={styles.infoLabel}>
                            <InfoLabel
                                info={
                                    <>
                                        This is example information for prompting .
                                    </>
                                }
                            >
                            </InfoLabel>Prompting Tips
                        </div>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default HomePage