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
    Radio,
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
            //padding: "0 30px 0 0",
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
    const [selectedChildTab, setChildTab] = useState('');
    const [checkedItems, setCheckedItems] = useState<any[]>([]);
    const [topRanks, setTopRanks] = useState<any[]>([]);

    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const handleRadioChange = (itemId: string) => {
      let index = articles.assertions.findIndex((art) => art.id === itemId);
      setChildTab(`tab-${index}`);
      setSelectedItem(itemId);
      sendRanksDetails([itemId]); // Sending only the selected item
    };


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
        //setChildTab('tab-0');
    }, [articles]);

    const getRandomLightColor = () => {
        const letters = "89ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    };

    const onChildTabSelect = () => {
        return ;
        // setChildTab(value.currentTarget.value);
        // sendRanksDetails([])
    };

    const sendRanksDetails = (value: any) => {
        // value = value.map((v:any) => v.split('_')[1])
        setTopRanks(value);
    }


    let previouslyInsertedItems: Set<string> = new Set(); // Global state to track inserted items
    const addTextToDocumentFooter = async () => {
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
                    if (topRanks.length > 0) {
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
                                    //topRanks.splice(i, 1); // Remove the inserted item from topRanks
                                    i--; // Adjust loop index
                                }
                            }
                        }
                    }
                  }else{
                    const id = selectedChildTab.split("-")[1]
                    const article = articles.assertions[id];
                    const textToInsert = article.articleName;
                    const textId = article.id;
                    // Insert into body
                    if (!articleIds.includes(textId)) {
                      articleIds.push(textId);

                      // Insert article text and superscript in the body
                      const bodyParagraph = body.insertHtml("<br>" + textToInsert, Word.InsertLocation.end);
                      bodyParagraph.insertHtml(``, Word.InsertLocation.end);
                    } else {
                      body.insertHtml(``, Word.InsertLocation.end);
                    }
                  }
                  // Sync changes to Word
                    await context.sync();
                });
            } catch (error) {
                console.error("Error inserting content into Word document and footer:", error);
            }
    };
    

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", padding: "0.5rem" }}>
          <div style={{ display: "flex", padding: "0.5rem" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {
              articles.assertions && articles.assertions.length > 0 &&
              articles.assertions.map((art: any, index: any) => {
                const color = colors[index] || "#FFFFFF"; // Default color if undefined
                return (
                  <div key={`item-${index}`} style={{ display: "flex", alignItems: "center" }}>
                    <Radio
                      label=""
                      id={`radio-${index}`}
                      checked={selectedItem === art.id}
                      onChange={() => handleRadioChange(art.id)}
                    />
                    <span
                      style={{
                        backgroundColor: color,
                        padding: "5px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "small",
                        lineHeight: "1.1rem",
                        fontWeight: "normal",
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
        <div className={styles.buttonWrapper} style={{ position: "relative", left: "1rem" }}>
          {(articles.assertions || articles.assertions.length > 0) && (
            <Button
              disabled={!selectedItem && topRanks.length === 0}
              shape="circular"
              icon={<AddRegular />}
              onClick={() => {
                addTextToDocumentFooter();
              }}
            >
              Add Text To Document
            </Button>
          )}
        </div>
        <div style={{ display: "flex", padding: "0.5rem", flexDirection: "column", fontSize: "small" }}>
          <TabList className={styles.tabList} selectedValue={selectedChildTab} onTabSelect={onChildTabSelect}>
            {!articles.assertions || articles.assertions.length === 0 ? (
              <div style={{position:'relative', left:'0.8rem'}}>No Data Available</div>
            ) : (
              articles.assertions.map((_: any, index: any) => {
                const color = colors[index] || "#FFFFFF"; // Default color if undefined
                const tabValue = `tab-${index}`;
                const isSelected = selectedChildTab === tabValue;

                // Only render the selected tab
                if (!isSelected) return null;

                return (
                  <Tab key={index} value={tabValue} className={`${styles.tab} ${isSelected ? styles.selectedTab : ""}`}>
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                      {(isSelected || index === 0) && !(index > 0) && <div className={styles.tabIndicator}></div>}
                    </div>
                  </Tab>
                );
              })
            )}
          </TabList>
          {selectedChildTab && (
            <TablePanel
              data={articles.assertions}
              selectedChildTab={selectedChildTab}
              sendRanksDetails={sendRanksDetails}
              selectedItem={selectedItem}
            />
          )}
        </div>
      </div>
    );
};

  const TablePanel = (props: any) => {
      const [checkedItemsLower, setCheckedItemsLower] = useState<any[]>([]);
      const [topRanks, setTopRanks] = useState<any[]>([]);
      const [childTab, setChildTab] = useState(0);
      const [selectAllChecked, setSelectAllChecked] = useState(false); // Track Select All state
      const [radioSelection, setRadioSelection] = useState(props.selectedItem)
      let useMockData = false;
      const mockData = [
        {
          id: '1',
          topRanks: [
            {
              id: '1_1',
              source: 'https://example.com/1',
              excerpt: 'This is the first rank excerpt for rank 1.',
              score: 0.85,
            },
            {
              id: '2_1',
              source: 'https://example.com/2',
              excerpt: 'This is the second rank excerpt for rank 2.',
              score: 0.92,
            },
            {
              id: '3_1',
              source: 'https://example.com/3',
              excerpt: 'This is the third rank excerpt for rank 3.',
              score: 0.76,
            },
          ],
        },
        {
          id: '2',
          topRanks: [
            {
              id: '1_2',
              source: 'https://anotherlink.com/1',
              excerpt: 'This is the first rank excerpt for rank 1 in child tab 2This is the first rank excerpt for rank 1 in child tab 2This is the first rank excerpt for rank 1 in child tab 2This is the first rank excerpt for rank 1 in child tab 2This is the first rank excerpt for rank 1 in child tab 2This is the first rank excerpt for rank 1 in child tab 2This is the first rank excerpt for rank 1 in child tab 2This is the first rank excerpt for rank 1 in child tab 2This is the first rank excerpt for rank 1 in child tab 2.',
              score: 0.91,
            },
            {
              id: '2_2',
              source: 'https://anotherlink.com/2',
              excerpt: 'This is the second rank excerpt for rank 2 in child tab 2.',
              score: 0.88,
            },
            {
              id: '3_2',
              source: 'https://anotherlink.com/3',
              excerpt: 'This is the third rank excerpt for rank 3 in child tab 2.',
              score: 0.72,
            },
          ],
        },
      ];

    useEffect(() => {
        
        console.log(radioSelection)
        // Extract child tab index from props
        const selectedChildTab = props.selectedChildTab ? Number(props.selectedChildTab.split('-')[1]) : 0;
        // Update childTab state
        setChildTab(selectedChildTab);
        setSelectAllChecked(false)
        // Reset selected checkboxes
        setCheckedItemsLower([]);
        
        // Fetch topRanks for the selected tab
        const currentTopRanks = useMockData ? mockData[selectedChildTab]?.topRanks || [] : props.data[selectedChildTab]?.topRanks || [];
         //const currentTopRanks = props.data[selectedChildTab]?.topRanks || [];
        setTopRanks(currentTopRanks);
      
        // Optional: Auto-click the "Select All" checkbox (if needed)
        setTimeout(() => {
             //let tRanks = props.data[childTab]?.topRanks || [];
            let tRanks = useMockData ?  mockData[childTab]?.topRanks || [] : props.data[childTab]?.topRanks || [];
        //   props.selectedItem && tRanks.length > 0 && document.getElementById('selectAll')?.click();
          if(props.selectedItem && tRanks.length > 0){
            document.getElementById('selectAll')?.click();
          }else{
            if(tRanks.length === 0){
                setSelectAllChecked(true);
                document.getElementById('selectAll')?.click();
            }
          }
        }, 100);
      }, [props.selectedChildTab]);
      


      //let tRanks = props.data[childTab]?.topRanks || [];
      let tRanks = useMockData ?  mockData[childTab]?.topRanks || [] : props.data[childTab]?.topRanks || [];
      tRanks = tRanks.map((_item, _index) => ({
          ..._item,
           //id: _index + '_' + props.data[childTab]?.id
          id: useMockData ?  _index + '_' + mockData[childTab]?.id : _index + '_' + props.data[childTab]?.id
      }));
  
      const handleCheckboxChange = (itemId: string) => {
          setCheckedItemsLower((prev) => {
              const updatedItems = prev.includes(itemId)
                  ? prev.filter((id) => id !== itemId)
                  : [...prev, itemId];
              // Update Select All checkbox state
              setSelectAllChecked(updatedItems.length === tRanks.length);
              props.sendRanksDetails(updatedItems);
              return updatedItems;
          });
      };
      const handleSelectAllChange = () => {
          const newSelectAllState = !selectAllChecked && !(topRanks.length === 0);
          setSelectAllChecked(newSelectAllState);
  
          const allItemIds = newSelectAllState ? tRanks.map((rank) => rank.id) : [];
          setCheckedItemsLower(allItemIds);
          props.sendRanksDetails(allItemIds);
      };
  
      const columns = [
          { columnKey: "checkbox", label: "SELECT", width: "1%" },
          { columnKey: "link", label: "Select All", width: "40%" },
        //   { columnKey: "excerpt", label: "EXCERPT", width: "55%" },
        //   { columnKey: "score", label: "SCORE", width: "4%" },
      ];

      const gridStyles = {
        display: "grid",
        gridTemplateColumns: "2rem auto", // Fixed width for headers, flexible content
        gap: "8px",
        width: "100%",
        alignItems: "start",
      
        // Responsive layout for smaller screens
        "@media (max-width: 600px)": {
          gridTemplateColumns: "1fr", // Switch to single-column layout on mobile
        }
      };
  
      return (
        <Table
          role="grid"
          aria-label="Table with grid keyboard navigation"
          style={{ width: "100%", tableLayout: "fixed" }}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: "1rem" }}>
                <Checkbox id="selectAll" checked={selectAllChecked} onChange={handleSelectAllChange} />
              </TableHeaderCell>
              {columns.slice(1).map((column) => (
                <TableHeaderCell key={column.columnKey} style={{ width: "10rem" }}>
                  {column.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tRanks.map((rank: any, index: number) => (
              <TableRow key={rank.id || index} style={{ height: "50px", display: "flex !important" }}>
                <TableCell style={{ width: "50px", flex: "1" }}>
                  <Checkbox
                    id={rank.id}
                    checked={checkedItemsLower.includes(rank.id)}
                    onChange={() => handleCheckboxChange(rank.id)}
                  />
                </TableCell>
                <TableCell
                  style={{
                    flex: "10",
                    padding: "8px",
                    overflow: "hidden",
                    textAlign: "justify",
                    textOverflow: "ellipsis",
                    lineHeight: "normal",
                    whiteSpace: "nowrap",
                    wordBreak: "break-all",
                    width: "100%",
                  }}
                  title={rank.source}
                >
                  <TableCellLayout style={{ whiteSpace: "normal" }}>
                    <div style={gridStyles}>
                      {/* Title Section */}
                      <div style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Title:</div>
                      <div style={{ fontWeight: "normal", wordBreak: "break-word" }}>{rank.title}</div>

                      {/* Link Section */}
                      <div style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Link:</div>
                      <div style={{ fontWeight: "normal", wordBreak: "break-word" }}>
                        <a href={rank.source} target="_blank" rel="noopener noreferrer">
                          {rank.source || "Link"}
                        </a>
                      </div>

                      {/* Excerpt & Score on the Same Line */}
                      <div style={{ display: "flex", gap: "16px" }}>
                        <div style={{display:'grid', gridTemplateColumns: "100px 10rem", }}>
                          <span style={{ fontWeight: "bold" }}>Excerpt:</span>
                          <div style={{position:'relative', left:'0.5rem', display:'flex', gap:'1rem'}}>
                            <span style={{ fontWeight: "bold" }}>Score:</span>
                            <span title={rank.score ? `${(rank.score * 100).toFixed(2)}%` : "N/A"}>
                              {rank.score ? (rank.score * 100).toFixed(2) + "%" : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Excerpt Content (Full Row) */}
                      <div
                        style={{ gridColumn: "1 / -1", fontWeight: "normal", wordBreak: "break-word" }}
                        title={rank.excerpt}
                      >
                        {rank.excerpt || "No Excerpt"}
                      </div>
                    </div>
                  </TableCellLayout>
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
          <TabList style={{flexFlow:'wrap'}} selectedValue={selectedValue} onTabSelect={onTabSelect}>
            {props.state.sourceTypes.includes("guardrail") && (
              <Tab value="guardrail" id="guardrail">
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", width:'5rem' }}>
                  <Image alt="Guardrail" src={icon32} height={30} width={30} />
                  <span style={{position:'relative', left:'1rem'}}>Guardrail AI</span>
                </div>
              </Tab>
            )}
            {props.state.sourceTypes.includes("gpt3") && (
              <Tab value="chatGPT" id="chatGPT">
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center",width:'6rem' }}>
                  <Image alt="Chat GPT" src={chatGPT} height={30} width={30} />
                  <span>GPT 3</span>
                </div>
              </Tab>
            )}
            {props.state.sourceTypes.includes("copilot") && (
              <Tab value="copilot" id="copilot">
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", width:'6rem' }}>
                  <Image alt="Copilot" src={copilot} height={30} width={30} />
                  <span>Copilot</span>
                </div>
              </Tab>
            )}
            {props.state.sourceTypes.includes("gemini") && (
              <Tab value="gemini" id="gemini">
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", width:'6rem' }}>
                  <Image alt="Gemini" src={gemini} height={30} width={30} />
                  <span>Gemini</span>
                </div>
              </Tab>
            )}
            {props.state.sourceTypes.includes("gpt4") && (
              <Tab value="chatGPT4" id="chatGPT4">
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", width:'6rem' }}>
                  <Image alt="chatGPT4" src={chatGPT4} height={30} width={30} />
                  <span>GPT 4</span>
                </div>
              </Tab>
            )}
          </TabList>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
          <div className={styles.panels}>
            {selectedValue === "guardrail" && props.state.sourceTypes.includes("guardrail") && (
              <ContentPanel
                title="Guardrail Content"
                data={data && data.filter((d: any) => d.promptType === selectedGPT)}
              />
            )}
            {selectedValue === "chatGPT" && props.state.sourceTypes.includes("gpt3") && (
              <ContentPanel
                title="Chat GPT Content"
                data={data && data.filter((d: any) => d.promptType === selectedGPT)}
              />
            )}
            {selectedValue === "chatGPT4" && props.state.sourceTypes.includes("gpt4") && (
              <ContentPanel
                title="Chat GPT4 Content"
                data={data && data.filter((d: any) => d.promptType === selectedGPT)}
              />
            )}
            {selectedValue === "copilot" && props.state.sourceTypes.includes("copilot") && (
              <ContentPanel
                title="Copilot Content"
                data={data && data.filter((d: any) => d.promptType === selectedGPT)}
              />
            )}
            {selectedValue === "gemini" && props.state.sourceTypes.includes("gemini") && (
              <ContentPanel
                title="Gemini Content"
                data={data && data.filter((d: any) => d.promptType === selectedGPT)}
              />
            )}
          </div>
        </div>
      </div>
    );
}

export default AIPrompt;