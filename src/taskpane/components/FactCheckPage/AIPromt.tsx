import {
    Button,
    makeStyles,
    Tab,
    TabList,
    TabValue,
    Image,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableCellLayout,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from "@fluentui/react-components";
import { AddRegular, TextEditStyleRegular } from "@fluentui/react-icons";
import React, { useState, useEffect } from "react";
import icon32 from "../../../../assets/icon-32.png";
import chatGPT from "../../../../assets/chatgpt.png";
import chatGPT4 from "../../../../assets/AI_Logos/chatgpt4.png";
import copilot from "../../../../assets/copilot.png";
import gemini from "../../../../assets/gemini.png";

// Styles for Tabs with custom border logic
const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        padding: "0 20px 50px 10px",
        rowGap: "20px",
    },
    panels: {
        padding: "0 10px",
        "& th": {
            textAlign: "center",
            padding: "0 30px 0 0",
        },
    },
    buttonWrapper: {
        display: "flex",
        columnGap: "15px",
    },
    contentBorder: {
        paddingLeft: "5px",
        borderLeft: "1px solid #dcdcdc",
        borderBottom: "1px solid #dcdcdc",
        fontSize: "small",
    },
    contentStyle: {
        marginTop: "1rem",
        border: "solid 1px",
        borderRadius: "5px",
        padding: "10px",
    },
    tabList: {
        display: 'flex',
        borderBottom: '1px solid #dcdcdc', // All tabs will have a bottom border
    },
    tab: {
        flex: '1',
        padding: '10px',
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        borderRight: '1px solid #dcdcdc',
        borderTop: '1px solid #dcdcdc', // All tabs have a border top
    },
    selectedTab: {
        borderBottom: 'none', // No border for the selected tab
    },
    tabIndicator: {
        height: '2px',
        background: 'black',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    }
});

const ContentPanel = (props: any) => {
    const styles = useStyles();
    const [uniqueColor, setUniqueColor] = useState('');
    const [colors, setColors] = useState<string[]>([]);
    const [selectedChildTab, setChildTab] = useState('tab-0');
    const [checkedItems, setCheckedItems] = useState<any[]>([]);
    
    // Safely check and set the articles based on props.data
    const [articles, setArticles] = React.useState(
        props?.data && props?.data[0]?.articles ? props?.data[0].articles : { assertions: [] }
    );

    useEffect(() => {
        // Ensure that props?.data is available and contains articles
        if (props?.data && props?.data[0]?.articles) {
            setArticles(props?.data[0].articles);
        } else {
            setArticles({ assertions: [] }); // Fallback if no data or articles exist
        }
        
        // Generate random colors based on the number of assertions
        const generateColors = () => articles.assertions.map(() => getRandomLightColor());
        setColors(generateColors());
        setChildTab('tab-0');
    }, [articles]);

    const getRandomLightColor = () => {
        const letters = "89ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    };

    const handleCheckboxChange = (item: any) => {
        setCheckedItems((prev) => {
            if (prev.includes(item)) {
                return prev.filter((i) => i !== item);
            }
            return [...prev, item];
        });
    };
    const onChildTabSelect = (value: any) => {
        setChildTab(value.currentTarget.value);
    };

    const addTextToDocument = async () => {
        if (checkedItems.length > 0) {
            try {
                await Word.run(async (context) => {
                    // Get the current selection in the Word document
                    const range = context.document.getSelection();
                    
                    // A set to track items that have already been inserted
                    let previouslyInsertedItems: Set<any> = new Set();
    
                    // Add selected content (for each selected item, you can customize what to add)
                    checkedItems.forEach((item: any) => {
                        // Check if this item has already been inserted
                        if (!previouslyInsertedItems.has(item)) {
                            // Find the article corresponding to this item
                            let article = articles.assertions.find((assertion: any) => assertion.id === item);
    
                            // If an article is found, insert its content
                            if (article) {
                                const textToInsert = article.articleName; // Customize this based on what you need (e.g., `article.articleName` or `article.excerpt`)
                                range.insertText(textToInsert, Word.InsertLocation.end); // Insert at the end of the document
                                previouslyInsertedItems.add(item); // Mark this item as inserted
                            }
                        }
                    });
    
                    // Sync to apply changes
                    await context.sync();
                });
            } catch (error) {
                console.error('Error inserting content into Word:', error);
            }
        }
    };
    



//    function addTextToDocument(){
//     if (checkedItems.length > 0) {
//         try {
//              Word.run(async (context) => {
//                 // Get the current selection in the Word document
//                 const range = context.document.getSelection();

//                 // Add selected content (for each selected item, you can customize what to add)
//                 checkedItems.forEach((item:any) => {
//                     // Assuming `item` is an object with `articleName` and `excerpt` properties
//                     const textToInsert = `Article`;
//                     range.insertText(textToInsert, Word.InsertLocation.end);
//                 });

//                 // Sync to apply changes
//                 await context.sync();
//             });
//         } catch (error) {
//             console.error('Error inserting content into Word:', error);
//         }
//     }
//     }

    return (
        <div>
            <div className={styles.buttonWrapper} style={{ display: "flex", justifyContent: "space-around" }}>
                <Button shape="circular" icon={<AddRegular/>} onClick={addTextToDocument}>Add Text To Document</Button>
                <Button shape="circular" icon={<TextEditStyleRegular />}>Edit Text</Button>
            </div>
            <div style={{ display: "flex", padding: "0.5rem" }}>
                <div style={{ width: "10%" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {articles.assertions.map((art:any, index: any) => (
                            <Checkbox
                                label=""
                                id={`checkbox-${index}`}
                                key={`checkbox-${index}`}
                                checked={checkedItems.includes(art.id)}
                                onChange={() => handleCheckboxChange(art.id)}
                            />
                        ))}
                    </div>
                </div>
                <div style={{ width: "90%", borderRadius: "5px", borderRight: '0', borderTop: '0', border: "solid 1px grey", fontSize: "small", padding: "1rem" }}>
                    <div style={{ marginBottom: "1rem" }}>
                        {articles.assertions.map((assertion, index) => {
                            const color = colors[index] || '#FFFFFF'; // Default color if undefined
                            return (
                                <span
                                    key={`span-${index}`}
                                    style={{
                                        margin: "0 0.5rem",
                                        backgroundColor: color,
                                        padding: "5px",
                                    }}
                                >
                                    {assertion.articleName}
                                    &nbsp;&nbsp;
                                    <sup
                                        style={{
                                            position: "relative",
                                            background: color,
                                            display: "inline-block",
                                            padding: "0 9px",
                                            left: "0.3rem",
                                        }}
                                    >
                                        {index + 1}
                                    </sup>
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", padding: "0.5rem", flexDirection: "column", fontSize: "small" }}>
                <TabList className={styles.tabList} selectedValue={selectedChildTab} onTabSelect={onChildTabSelect}>
                    {articles.assertions.map((_, index) => {
                        const color = colors[index] || '#FFFFFF'; // Default color if undefined
                        const isSelected = selectedChildTab === `tab-${index}`;
                        return (
                            <Tab key={index} value={`tab-${index}`} className={`${styles.tab} ${isSelected ? styles.selectedTab : ''}`}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span
                                        style={{
                                            height: "15px",
                                            width: "15px",
                                            borderRadius: "10px",
                                            backgroundColor: color,
                                            display: "inline-block",
                                            marginRight: "5px",
                                        }}
                                    ></span>
                                    <span>{index + 1}</span>
                                    {isSelected && <div className={styles.tabIndicator}></div>}
                                </div>
                            </Tab>
                        );
                    })}
                </TabList>
                <TablePanel data={articles.assertions} selectedChildTab={selectedChildTab} />
            </div>
        </div>
    );
};


const TablePanel = (props: any) => {
    const [checkedItems, setCheckedItems] = useState<any[]>([]);
    const [topRanks, setTopRanks] = useState<any[]>([]);
    const [childTab, setChildTab] = useState(0);

    // Initialize topRanks when data changes
    useEffect(() => {
        const currentTopRanks = props.data[childTab]?.topRanks || [];
        setTopRanks(currentTopRanks); // Only update topRanks if it changes
    }, [childTab]);

    const tRanks = props.data[childTab]?.topRanks || [];

    // Update childTab based on selectedChildTab prop
    useEffect(() => {
        const selectedChildTab = props.selectedChildTab ? Number(props.selectedChildTab.split('-')[1]) : 0;
        setChildTab(selectedChildTab); // Only update childTab if it changes
    }, [props.selectedChildTab]);

    const handleCheckboxChange = (item: any) => {
        setCheckedItems((prev) => {
            if (prev.includes(item)) {
                return prev.filter((i) => i !== item);
            }
            return [...prev, item];
        });
    };

    const columns = [
        { columnKey: "checkbox", label: "SELECT", width: "10%" },
        { columnKey: "link", label: "LINK", width: "40%" },
        { columnKey: "excerpt", label: "EXCERPT", width: "40%" },
        { columnKey: "score", label: "SCORE", width: "10%" },
    ];

    return (
        <Table role="grid" aria-label="Table with grid keyboard navigation" style={{ width: '100%', tableLayout: 'fixed' }}>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHeaderCell
                            key={column.columnKey}
                            style={{
                                padding: '8px',
                                width: column.width,
                                textAlign: 'left',
                                backgroundColor: '#f4f4f4',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis', // Apply ellipsis for overflowing content
                            }}
                        >
                            {column.label}
                        </TableHeaderCell>
                    ))}
                    <TableHeaderCell />
                </TableRow>
            </TableHeader>
            <TableBody>
                {tRanks.map((rank: any, index: number) => (
                    <TableRow key={rank.id || index} style={{ height: '50px' }}> {/* Fixed height for rows */}
                        <TableCell style={{ textAlign: 'center', padding: '8px' }}>
                            <Checkbox
                                label=""
                                checked={checkedItems.includes(rank.id)}
                                onChange={() => handleCheckboxChange(rank.id)}
                            />
                        </TableCell>
                        <TableCell
                            style={{
                                padding: '8px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis', // Apply ellipsis for overflowing content
                            }}
                            title={rank.source} // Show full text on hover
                        >
                            <TableCellLayout>
                                <a href={rank.source} target="_blank" rel="noopener noreferrer">
                                    {rank.source || 'Link'}
                                </a>
                            </TableCellLayout>
                        </TableCell>
                        <TableCell
                            style={{
                                padding: '8px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis', // Apply ellipsis for overflowing content
                            }}
                            title={rank.excerpt} // Show full text on hover
                        >
                            {rank.excerpt || 'No Excerpt'}
                        </TableCell>
                        <TableCell
                            style={{
                                padding: '8px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis', // Apply ellipsis for overflowing content
                            }}
                            title={rank.score ? `${(rank.score * 100).toFixed(2)}%` : 'N/A'} // Show full text on hover
                        >
                            {rank.score ? (rank.score * 100).toFixed(2) + '%' : 'N/A'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};



function AIPrompt(props: any) {
    const styles = useStyles();
    const selectedPromptType = props.promptType;
    const [data, setData] = React.useState([]);
    console.log('data in AIPrompt component', data);
    const [selectedValue, setSelectedValue] = useState<TabValue>(props.promptType === 'gpt3' ? 'chatGPT' : props.promptType === 'gpt4' ? 'chatGPT4': props.promptType);
    const [selectedGPT, setSelectedGPT] =useState('')

    const tabConfig = [
        { value: "guardrail", promptType: "guardrail", label: "Guardrail", icon: icon32 },
        { value: "chatGPT", promptType: "gpt3", label: "Chat GPT", icon: chatGPT },
        { value: "chatGPT4", promptType: "gpt4", label: "Chat GPT4", icon: chatGPT4 },
        { value: "copilot", promptType: "copilot", label: "Copilot", icon: copilot },
        { value: "gemini", promptType: "gemini", label: "Gemini", icon: gemini },
    ];

    useEffect(() => {
        const defaultTab = tabConfig.find((tab) => selectedPromptType === tab.promptType)?.value;
        if (defaultTab) {
            setSelectedValue(defaultTab);
            //onTabSelect(defaultTab)
            setData(props.data.result);
        }
    }, [props.state.sourceTypes, selectedPromptType]);

    const onTabSelect = (value: any) => {
        let finalValue = value.currentTarget.value === 'chatGPT' ? 'gpt3' : value.currentTarget.value === 'chatGPT4' ? 'gpt4':value.currentTarget.value;
        setSelectedGPT(finalValue);
        setSelectedValue(value.currentTarget.value);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
                <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                    {props.state.sourceTypes.includes("guardrail") && (
                        <Tab value="guardrail" id="guardrail">
                            <Image alt="Guardrail" src={icon32} height={32} width={32} />
                        </Tab>
                    )}  
                    {props.state.sourceTypes.includes("gpt3") && (
                        <Tab value="chatGPT" id="chatGPT">
                            <Image alt="Chat GPT" src={chatGPT} height={30} width={30} />
                        </Tab>
                    )}
                    {props.state.sourceTypes.includes("copilot") && (
                        <Tab value="copilot" id="copilot">
                            <Image alt="Copilot" src={copilot} height={32} width={32} />
                        </Tab>
                    )}
                    {props.state.sourceTypes.includes("gemini") && (
                        <Tab value="gemini" id="gemini">
                            <Image alt="Gemini" src={gemini} height={32} width={32} />
                        </Tab>
                    )}
                    {props.state.sourceTypes.includes("gpt4") && (
                        <Tab value="chatGPT4" id="chatGPT4">
                            <Image alt="chatGPT4" src={chatGPT4} height={32} width={32} />
                        </Tab>
                    )}
                </TabList>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
                <div className={styles.panels}>
                    {selectedValue === "guardrail" && props.state.sourceTypes.includes("guardrail") && (
                        <ContentPanel title="Guardrail Content" data={ data && data.filter((d:any) => d.promptType === selectedGPT)} />
                    )}
                    {selectedValue === "chatGPT" && props.state.sourceTypes.includes("gpt3") && (
                        <ContentPanel title="Chat GPT Content" data={ data && data.filter((d:any) => d.promptType === selectedGPT)} />
                    )}
                    {selectedValue === "chatGPT4" && props.state.sourceTypes.includes("gpt4") && (
                        <ContentPanel title="Chat GPT4 Content" data={ data && data.filter((d:any) => d.promptType === selectedGPT)} />
                    )}
                    {selectedValue === "copilot" && props.state.sourceTypes.includes("copilot") && (
                        <ContentPanel title="Copilot Content" data={ data && data.filter((d:any) => d.promptType === selectedGPT)} />
                    )}
                    {selectedValue === "gemini" && props.state.sourceTypes.includes("gemini") && (
                        <ContentPanel title="Gemini Content" data={ data && data.filter((d:any) => d.promptType === selectedGPT)} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AIPrompt;