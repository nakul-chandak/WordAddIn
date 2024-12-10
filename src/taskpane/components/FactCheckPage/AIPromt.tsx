import { Button, makeStyles, SelectTabData, SelectTabEvent, Tab, TabList, TabValue, Image } from "@fluentui/react-components";
import { AddRegular, TextEditStyleRegular } from "@fluentui/react-icons";
import React from "react";
import icon32 from "../../../../assets/icon-32.png";
import chatGPT from "../../../../assets/chatgpt.png";
import copilot from "../../../../assets/copilot.png";

const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "0px 20px 50px 10px",
        rowGap: "20px",
    },
    panels: {
        padding: "0 10px",
        "& th": {
            textAlign: "left",
            padding: "0 30px 0 0",
        },
    },
    backButton: {
        top: "10px",
        right: "40px",
        position: "absolute",
    },
    wrapper: {
        columnGap: "15px",
        display: "flex",
        minWidth: "min-content",
    },
    buttonwrapper: {
        columnGap: "15px",
        display: "flex",
        minWidth: "min-content"
    },
    buttonwrapperleft: {
        columnGap: "15px",
        display: "flex",
        minWidth: "min-content",
        float: "left"
    },
    buttonwrapperright: {
        columnGap: "15px",
        display: "flex",
        minWidth: "min-content",
        float: "right"
    },
    contentborder:{
        paddingLeft: "5px",
        borderLeft: "1px solid #dcdcdc",
        borderBottom: "1px solid #dcdcdc",
        fontSize: "small"
    },
    contentstyle:{
        paddingLeft: "40px",
        paddingTop: "10px",
    }
});

function AIPromt() {
    const styles = useStyles();

    const Guardrail = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Guardrail">
            <div className={styles.buttonwrapperleft}>
                <Button shape="circular" id="insert-paragraph" icon={<AddRegular />} >Add Text To Document</Button>
            </div>
            <div className={styles.buttonwrapperright}>
                <Button shape="circular" icon={<TextEditStyleRegular />} >Edit Text</Button>
            </div>
            <br />
            <div className={styles.contentstyle}>
                <div className={styles.contentborder}>
                What is Lorem Ipsum?
                <br />
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </div>
            </div>
        </div>
    ));

    const ChatGPT = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Chat GPT">
            <div className={styles.buttonwrapperleft}>
                <Button shape="circular" icon={<AddRegular />} >Add Text To Document</Button>
            </div>
            <div className={styles.buttonwrapperright}>
                <Button shape="circular" icon={<TextEditStyleRegular />} >Edit Text</Button>
            </div>
            <br />
            <div className={styles.contentstyle}>
                <div className={styles.contentborder}>
                What is Lorem Ipsum?
                <br />
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </div>
            </div>
        </div>
    ));

    const Copilot = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Copilot">
            <div className={styles.buttonwrapperleft}>
                <Button shape="circular" icon={<AddRegular />} >Add Text To Document</Button>
            </div>
            <div className={styles.buttonwrapperright}>
                <Button shape="circular" icon={<TextEditStyleRegular />} >Edit Text</Button>
            </div>
            <br />
            <div className={styles.contentstyle}>
                <div className={styles.contentborder}>
                What is Lorem Ipsum?
                <br />
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </div>
            </div>
        </div>
    ));

    const [selectedValue, setSelectedValue] =
        React.useState<TabValue>("guardrail");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
        if (event.isTrusted) {
        }
    };

    const renderTabs = () => {
        return (
            <div className={styles.root}>
                <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                    <Tab value="guardrail" id="guardrail">
                        <Image
                            alt="Guardrail"
                            src={icon32}
                            height={32}
                            width={32}
                        />
                    </Tab>
                    <Tab value="chatGPT" id="chatGPT"><Image
                        alt="Chat GPT"
                        src={chatGPT}
                        height={30}
                        width={30}
                    /></Tab>
                    <Tab value="copilot" id="copilot">
                        <Image
                            alt="Copilot"
                            src={copilot}
                            height={32}
                            width={32}
                        />
                    </Tab>
                </TabList>
                <div className={styles.panels}>
                    {selectedValue === "guardrail" && <Guardrail />}
                    {selectedValue === "chatGPT" && <ChatGPT />}
                    {selectedValue === "copilot" && <Copilot />}
                </div>
            </div>
        );
    };

    const GetChatWindow = () => {
        return (
            <div >
                <TabList defaultSelectedValue="guardrail" selectTabOnFocus={true}>
                    {renderTabs()}
                </TabList>
            </div>
        );
    };
    
    const renderComponent = () => {
        return GetChatWindow();
    }
    
    return (
        <div>{renderComponent()}</div>
    );
}

export default AIPromt;

