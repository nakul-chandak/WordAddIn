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
import { AddRegular } from "@fluentui/react-icons";
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
        //borderBottom: '1px solid #dcdcdc', // All tabs will have a bottom border
        marginBottom:'1rem',
        gap:'0.5rem'
    },
    tab: {
        flex: '1',
        //padding: '10px',
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        borderRight: '1px solid #dcdcdc',
        borderTop: '1px solid #dcdcdc', // All tabs have a border top
        borderLeft: '1px solid #dcdcdc',
        borderBottom:'1px solid #dcdcdc'

    },
    selectedTab: {
        //borderBottom: 'none', // No border for the selected tab
    },
    tabIndicator: {
        //height: '2px',
        background: 'white',
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
    const [topRanks, setTopRanks] = useState<any[]>([]);
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
        //props.sendRanksDetails();
    };
    const onChildTabSelect = (value: any) => {
        setChildTab(value.currentTarget.value);
        sendRanksDetails([])
    };

    const sendRanksDetails = (value: any) => {
        // value = value.map((v:any) => v.split('_')[1])
        setTopRanks(value);
        console.log('top ranks details as ', value)
    }


    let previouslyInsertedItems: Set<string> = new Set(); // Global state to track inserted items
    let footerCount = 0;
    let docuementCount =0;
    const addTextToDocumentFooter = async () => {
        if (topRanks.length > 0) {
            try {
                await Word.run(async (context) => {
                    // Get the footer and the body of the document
                    const footer = context.document.sections.getFirst().getFooter("Primary");
                    const body = context.document.body;
    
                    // Load all paragraphs in the document body and footer
                    const bodyParagraphs = body.paragraphs;
                    const footerParagraphs = footer.paragraphs;
                    bodyParagraphs.load("text");
                    footerParagraphs.load("text");
    
                    await context.sync(); // Sync to load text
    
                    // Extract existing superscripts from body and footer
                    const extractSuperscripts = (textArray) => {
                        const superscriptRegex = /\[(\d+)]/g;
                        const indices = [];
                        textArray.forEach((paragraph) => {
                            let match;
                            while ((match = superscriptRegex.exec(paragraph.text)) !== null) {
                                indices.push(parseInt(match[1], 10));
                            }
                        });
                        return indices;
                    };
    
                    const existingBodyIndices = extractSuperscripts(bodyParagraphs.items);
                    const existingFooterIndices = extractSuperscripts(footerParagraphs.items);
    
                    // Find the maximum superscript index in the document
                    let currentIndex = Math.max(
                        existingBodyIndices.length ? Math.max(...existingBodyIndices) : 0,
                        existingFooterIndices.length ? Math.max(...existingFooterIndices) : 0
                    );
    
                    let articleIds = []; // To track inserted article IDs
    
                    for (let i = 0; i < topRanks.length; i++) {
                        const item = topRanks[i];
    
                        // Ensure item has not been previously inserted
                        if (!previouslyInsertedItems.has(item)) {
                            const [index, artId] = item.split("_");
                            const article = articles.assertions.find((a) => a.id === artId);
    
                            if (article) {
                                const textToInsert = article.articleName;
                                const textId = article.id;
    
                                // Insert into body
                                if (!articleIds.includes(textId)) {
                                    articleIds.push(textId);
    
                                    // Increment the superscript index
                                    currentIndex += 1;
    
                                    // Insert article text and superscript in the body
                                    const bodyParagraph = body.insertHtml('<br>' + textToInsert, Word.InsertLocation.end);
                                    bodyParagraph.insertHtml(`<sup>[${currentIndex}]</sup>`, Word.InsertLocation.end);
                                } else {
                                    currentIndex += 1;
                                    body.insertHtml(`<sup>[${currentIndex}]</sup>`, Word.InsertLocation.end);
                                }
    
                                // Insert into footer
                                const topRankArticle = article.topRanks[parseInt(index, 10)];
                                if (topRankArticle) {
                                    const sourceLink = topRankArticle.source;
    
                                    // Insert the source link in the footer
                                    //existing solution --> working 
                                    const footerParagraph = footer.insertHtml(
                                        '<br>' + currentIndex + '.' + `<a href="${sourceLink}">${sourceLink}</a>`, Word.InsertLocation.end
                                    );

                                    // Set footer font size for consistency
                                    footerParagraph.font.size = 8;
    
                                    // Mark the item as inserted
                                    previouslyInsertedItems.add(item);
                                    topRanks.splice(i, 1); // Remove the inserted item from topRanks
                                    i--; // Adjust loop index
                                }
                            }
                        }
                    }
    
                    // Update state for topRanks after processing
                    setTopRanks([...topRanks]);
    
                    // Sync changes to Word
                    await context.sync();
                });
            } catch (error) {
                console.error("Error inserting content into Word document and footer:", error);
            }
        }
    };
    
    
    
    
    
    


    return (
        <div>
            <div className={styles.buttonWrapper} style={{ position: 'relative', left: '1rem' }}>
                <Button disabled={checkedItems.length === 0 && topRanks.length === 0} shape="circular" icon={<AddRegular />} onClick={() => { addTextToDocumentFooter(); }}>Add Text To Document</Button>
            </div>
            <div style={{ display: "flex", padding: "0.5rem" }}>
                <div style={{ display: "flex", padding: "0.5rem" }}>
                    {/* Single loop for both checkbox and article name */}
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {articles.assertions.map((art: any, index: any) => {
                            const color = colors[index] || '#FFFFFF'; // Default color if undefined
                            return (
                                <div key={`item-${index}`} style={{ display: "flex", alignItems: "center" }}>
                                    {/* <Checkbox
                                        label=""
                                        id={`checkbox-${index}`}
                                        checked={checkedItems.includes(art.id)}
                                        onChange={() => handleCheckboxChange(art.id)}
                                        style={{
                                            //marginRight: "0.5rem", // Ensure space between checkbox and article name
                                        }}
                                    /> */}
                                    {/* Article name with corresponding style */}
                                    <span
                                        style={{
                                            backgroundColor: color,
                                            padding: "5px",
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: 'small',
                                            lineHeight:'1.1rem',
                                            fontWeight:'normal'
                                        }}
                                    >
                                        {art.articleName}
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
                                </div>
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
                <TablePanel data={articles.assertions} selectedChildTab={selectedChildTab} sendRanksDetails={sendRanksDetails} />
            </div>
        </div>
    );
};


const TablePanel = (props: any) => {
    const [checkedItemsLower, setCheckedItemsLower] = useState<any[]>([]);
    const [topRanks, setTopRanks] = useState<any[]>([]);
    const [childTab, setChildTab] = useState(0);

    // Initialize topRanks when data changes
    useEffect(() => {
        const currentTopRanks = props.data[childTab]?.topRanks || [];
        setTopRanks(currentTopRanks); // Only update topRanks if it changes
    }, [childTab]);

    let tRanks = props.data[childTab]?.topRanks || [];
    tRanks = tRanks.map((_item, _index) => ({
        ..._item,
        id: _index + '_' + props.data[childTab]?.id
    }));

    // Update childTab based on selectedChildTab prop
    useEffect(() => {
        const selectedChildTab = props.selectedChildTab ? Number(props.selectedChildTab.split('-')[1]) : 0;
        setChildTab(selectedChildTab); // Only update childTab if it changes
    }, [props.selectedChildTab]);

    const handleCheckboxChange = (item: any) => {
        setCheckedItemsLower((prev) => {
            const updatedItems = prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item];
            props.sendRanksDetails(updatedItems);
            console.log(updatedItems);

            return updatedItems;
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
                                id={rank.id}
                                checked={checkedItemsLower.includes(rank.id)}
                                onChange={() => handleCheckboxChange(rank.id)}
                            />
                        </TableCell> 
                        <TableCell
                            style={{
                                padding: '8px',
                                overflow: 'hidden',
                                textAlign: 'justify',
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
                                textAlign: 'justify',
                                textOverflow: 'ellipsis', // Apply ellipsis for overflowing content
                                fontWeight:'normal'
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
                                fontWeight:'normal'
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
    const [selectedValue, setSelectedValue] = useState<TabValue>(props.promptType === 'gpt3' ? 'chatGPT' : props.promptType === 'gpt4' ? 'chatGPT4' : props.promptType);
    const [selectedGPT, setSelectedGPT] = useState('')

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
            setSelectedGPT(defaultTab === 'chatGPT' ? 'gpt3' : defaultTab === 'chatGPT4' ? 'gpt4' : defaultTab);
            setData(props.data.result);
        }
    }, [props.state.sourceTypes, selectedPromptType]);

    const onTabSelect = (value: any) => {
        let finalValue = value.currentTarget.value === 'chatGPT' ? 'gpt3' : value.currentTarget.value === 'chatGPT4' ? 'gpt4' : value.currentTarget.value;
        setSelectedGPT(finalValue === 'chatGPT' ? 'gpt3' : finalValue === 'chatGPT4' ? 'gpt4' : finalValue);
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
                        <ContentPanel title="Guardrail Content" data={data && data.filter((d: any) => d.promptType === selectedGPT)} />
                    )}
                    {selectedValue === "chatGPT" && props.state.sourceTypes.includes("gpt3") && (
                        <ContentPanel title="Chat GPT Content" data={data && data.filter((d: any) => d.promptType === selectedGPT)} />
                    )}
                    {selectedValue === "chatGPT4" && props.state.sourceTypes.includes("gpt4") && (
                        <ContentPanel title="Chat GPT4 Content" data={data && data.filter((d: any) => d.promptType === selectedGPT)} />
                    )}
                    {selectedValue === "copilot" && props.state.sourceTypes.includes("copilot") && (
                        <ContentPanel title="Copilot Content" data={data && data.filter((d: any) => d.promptType === selectedGPT)} />
                    )}
                    {selectedValue === "gemini" && props.state.sourceTypes.includes("gemini") && (
                        <ContentPanel title="Gemini Content" data={data && data.filter((d: any) => d.promptType === selectedGPT)} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AIPrompt;