import { CounterBadge } from "@fluentui/react-components";
import React from "react";
import { makeStyles, Image, Checkbox, Button, Textarea } from "@fluentui/react-components";
import log from "../../../../assets/logo.png";
import GuardrailLogo from "../../../../assets/icon-80.png";
import chatGPTLogo from "../../../../assets/chatgpt.png"
import CopilotLogo from "../../../../assets/Copilot.png"
import GeminiLogo from "../../../../assets/gemini.png"
import { useNavigate } from "react-router-dom";

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
        height: '365px',
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
            return GuardrailLogo;
        case "openai":
            return chatGPTLogo;
        case "copilot":
            return CopilotLogo;
        case "gemini":
            return GeminiLogo;
        default:
            return "";
    }
};
const logoArray = [
    { label: "Guardrail", id: "guardrail" },
    { label: "OpenAI", id: "openai" },
    { label: "Copilot", id: "copilot" },
    { label: "Gemini", id: "gemini" },
];


const OptimizedPromts = () => {
    const styles = useStyles();
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = React.useState<string[] | null>([]);
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
   
                </div>
            </form>
        </div>
    )
}
export default OptimizedPromts