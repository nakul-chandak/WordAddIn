import { makeStyles, Image, Checkbox, Button, CounterBadge, Textarea, useRestoreFocusTarget, Input, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, TableCellLayout, Select } from "@fluentui/react-components";
import * as React from "react";
import { useToaster } from "../../../hooks/useToast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PatternMgmtService } from "../../../common/services/pattern-mgmt/pattern-mgmt.service";
import log from "../../../../assets/Guardrail_WithName.png";
import { CustomLibrary, Pattern } from "../../../common/services/pattern-mgmt/models/CustomLibrary";
import { bool, reach } from "yup";
import { DeleteRegular, Edit12Regular, EditRegular } from "@fluentui/react-icons";
const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "0px 20px 50px 10px",
        rowGap: "20px",
    },

    bigGray: {
        backgroundColor: 'rgb(228 231 237)',
        //padding:'1.5rem',
        marginTop: '1rem'
    },
    nounderline: {
        textDecorationLine: 'none',
        color: 'rgba(59,130,246)'
    },
    textSpan: {
        paddingLeft: '.5rem',
        paddingTop: '.8rem',
        color: 'gray'
    },
    headerContainer: {
        padding: '1rem',
        display: 'flex',
        paddingBottom: 0,
        paddingTop: 0
    },
    patternLBName: {
        padding: '1rem',
        paddingBottom: 0,
        paddingTop: 0,
        marginTop: '-.7rem'
    },
    h2PatternName: {
        fontWeight: 600,
        fontSize: '0.8rem',
        marginBottom: '1rem'
    },
    ptbContainer: {
        justifyContent: 'space-between',
        width: '100%',
        display: 'flex'
    },
    libNameContainer: {
        flexDirection: 'row',
        display: 'flex',
        gap: '.5rem',
        padding: '1rem',
        paddingBottom: '1.5rem'
    },

    delBtnContainer: {
        gap: '.5rem',
        justifyContent: 'center',
        alignContent: 'center',
        cursor: 'pointer',
        display: 'flex',
        color: 'rgb(192 152 206)',
        lineHeight: '1.25rem',
        paddingRight: '1rem'
    },
    tblheader: {
        fontSize: '0.55rem',
        textTransform: 'uppercase',
        background: 'rgb(249 250 251)',
        fontWeight: 'bold'
    },
    textarea: {
        width: '100%',
        resize: "unset"
    },
    patternBackground: {
        textTransform: 'capitalize',
        backgroundColor: '#f6ebff',
        borderRadius: '5px',
        paddingLeft: '7px',
        paddingRight: '7px',
        paddingTop: '4px',
        paddingBottom: '5px'
    },
    errormgsContainer: {
        padding: '1rem',
        paddingTop:'0',
        marginTop: '-2rem',
        fontSize: '0.65rem',
        color: 'red'
    }
});

function EditPattern() {
    const { id } = useParams();
    const styles = useStyles();
    const navigate = useNavigate();
    const toaster = useToaster();
    const [customPatternData, setCustomPatternData] = React.useState(new CustomLibrary("", "", "", "Custom", []));
    const textareaRef = React.useRef(null);
    const [name, setName] = React.useState('');
    const [nameBeforeUpdate, setNameBeforeUpdate] = React.useState('');
    const [comment, setComment] = React.useState('');
    const [isUpdated, setIsUpdated] = React.useState(false);
    const [showForm, setShowForm] = React.useState(false);
    const [patternData, setPatternData] = React.useState(new Pattern("", "", "", "fuzzy-match", ""))
    const timerRef = React.useRef(null);
    const [showError, setShowError] = React.useState(true);
    const [isUpdate, setIsUpdate] = React.useState(true);

    const getCustomPatternById = async (id) => {
        PatternMgmtService.getCustomPatternById(id).then(async (res: CustomLibrary) => {
            setCustomPatternData(res);
            setName(res.libraryGroup);
            setNameBeforeUpdate(res.libraryGroup)
            setComment(res.libraryComment);
            console.log(res);
        }, (error: any) => {
            toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
            console.log(error);
            //props.handleApiCall()
        });
    };

    const isPatternNameAvailable = (pattern) => {
        return PatternMgmtService.checkIsLibraryNameAvailble(pattern).then(async (res: any) => {
            return res;
        }, (error: any) => {
            toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
            console.log(error);
        });
    }

    const fetchResults = async (searchQuery) => {
        if (searchQuery != "" && nameBeforeUpdate != searchQuery) {
            try {
                const response = await isPatternNameAvailable({ "name": searchQuery });
                setShowError(response);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    };

    const handleCommentInputChange = (e) => {
        setComment(e.target.value);
        if (e.target.value.length == 0) {
            setIsUpdated(false);
        } else {
            setIsUpdated(true);
        }
    };

    const handleNameInputChange = (e) => {
        setName(e.target.value);
        const value = e.target.value;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Set a delay before making the fetch call
        timerRef.current = setTimeout(() => {
            fetchResults(value);
        }, 500); // 500ms delay

        if (e.target.value.length == 0) {
            setIsUpdated(false);
        } else {
            setIsUpdated(true);
        }
    };

    const updateCustomLibrary = () => {
        let custdata: CustomLibrary = new CustomLibrary(id, name, comment, "Custom", []);
        custdata.id = id;
        custdata.libraryComment = comment;
        custdata.libraryGroup = name;
        custdata.libraryType = "Custom";
        PatternMgmtService.updateCustomPattern(custdata).then(async (res: any) => {
            if (res) {
                getCustomPatternById(id);
                setIsUpdated(false);
                toaster.success("Pattern library updated successfully");
            }
        },
            (error: any) => {
                toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
                console.log(error);
            });
    };

    const handleDeleteClick = (item) => {
        const patternData = customPatternData.patterns.filter(pattern => pattern.id !== item.id);
        customPatternData.patterns = patternData;

        PatternMgmtService.deletePattern(id, item.id).then(async (res: any) => {
            if (res) {
                getCustomPatternById(id);
                toaster.success("Term deleted successfully");
            }
        },
            (error: any) => {
                toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
                console.log(error);
            });
    }

    const handleLibraryDeleteClick = () => {
        PatternMgmtService.deleteLibrary(id).then(async (res: any) => {
            if (res) {
                navigate('/patterns-management');
                toaster.success("Pattern library deleted successfully");
            }
        },
            (error: any) => {
                toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
                console.log(error);
            });
    }

    const handleAddClick = () => {
        setPatternData(new Pattern("", "", "", "fuzzy-match", ""));
        setShowForm(true);
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.style.resize = 'vertical'
            }
        }, 500);
    }

    const handleEditClick = (item) => {
        let pattern = customPatternData.patterns.find(pattern => pattern.id === item.id);
        setPatternData(pattern);
        setShowForm(true);
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.style.resize = 'vertical'
            }
        }, 500);

        console.log(pattern);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatternData({ ...patternData, [name]: value });
    };

    const resetPatternData = () => {
        setPatternData(new Pattern("", "", "", "fuzzy-match", ""));
        setShowForm(false);
    }

    const submitFormData = () => {
        if (isUpdate) {
            updateCustomLibraryDetails();
        } else {
            addCustomLibraryDetails();
        }
    }

    const addCustomLibraryDetails = () => {
        customPatternData.patterns.push(patternData);
        customPatternData.libraryGroup = name;
        customPatternData.libraryComment = comment;
        customPatternData.id = null;
        customPatternData.libraryType = "Custom";
        PatternMgmtService.AddLibraryNPattern(customPatternData).then(async (res: CustomLibrary) => {
            if (res != null) {
                navigate('/patterns-management/edit-pattern/' + res.id);
                getCustomPatternById(res.id);
                setIsUpdate(true);
                setShowForm(false);
                setIsUpdated(false);
                toaster.success("Pattern library added successfully");
            }
        }, (error: any) => {
            toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
            console.log(error);
        });
    }

    const updateCustomLibraryDetails = () => {
        if (patternData.id === "") {
            customPatternData.patterns.push(patternData);
        } else {
            const updatedItems = customPatternData.patterns.map(pattern => {
                if (pattern.id == patternData.id) {
                    return patternData
                } else {
                    return pattern;
                }
            });

            customPatternData.patterns = updatedItems;
        }

        customPatternData.libraryGroup = name;
        customPatternData.libraryComment = comment;
        PatternMgmtService.updateLibraryNPattern(customPatternData).then(async (res: any) => {
            if (res) {
                getCustomPatternById(id);
                setIsUpdated(false);
                setCustomPatternData(customPatternData);
                setShowForm(false);
                if (patternData.id != null) {
                    toaster.success("Pattern term updated successfully");
                } else { 
                    toaster.success("Pattern term added successfully");
                }
            }
        }, (error: any) => {
            toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
            console.log(error);
        });
    }

    React.useEffect(() => {
        if (id !== undefined) {
            getCustomPatternById(id);
            setIsUpdate(true);
        } else {
            setIsUpdate(false);
        }
    }, []);

    return (
        <div style={{ margin: "auto", paddingTop: '2.47rem',minHeight: "93vh" }}>
            <div className={styles.bigGray}>
                <div className={styles.headerContainer}>
                    <Link to="/patterns-management" className={styles.nounderline}>
                        <p > Existing patterns </p>
                    </Link>
                    <span className={styles.textSpan}> &gt;</span>
                    <span style={{ paddingLeft: '0.5rem' }}><p> {isUpdate ? 'Edit' : 'New'}  Custom Pattern Library</p></span>
                </div>
                <div className={styles.patternLBName}>
                    <h2 className={styles.h2PatternName} style={{marginBottom:'0rem'}}>Pattern Library Name</h2>
                </div>
                <div className={styles.ptbContainer}>
                    <div className={styles.libNameContainer} style={{ display: "flex", flexWrap: 'wrap' }}>
                        <div style={{ display: "flex", flexWrap: 'wrap', width: '190px' }}>
                            <Input placeholder="Enter library name" id="pattern-library-name" value={name} onChange={handleNameInputChange} />
                        </div>
                        <div style={{ display: "flex", flexWrap: 'wrap', width: '190px' }}>
                            <Input placeholder="Enter library description" id="pattern-library-name" value={comment}
                                onChange={handleCommentInputChange} />
                        </div>
                        {isUpdated && isUpdate &&
                            <div style={{ display: "flex", flexWrap: 'wrap', width: '190px' }}>
                                <Button appearance="primary" onClick={updateCustomLibrary} style={{ fontSize: 'small', minWidth: '190px' }} disabled={!showError}>Update Library Details</Button>
                            </div>}
                    </div>
                    {isUpdate && <div className={styles.delBtnContainer} onClick={handleLibraryDeleteClick} style={{ fontSize: '.7rem', paddingTop: '.5rem', display: "flex", flexWrap: 'wrap', justifyContent:'right', paddingRight:'1.5rem', height:'17px', marginTop:'17px',width:'110px' }}>
                        <DeleteRegular style={{ fontSize: '.9rem', paddingTop: '.9rem' }}>
                        </DeleteRegular>
                        <p>Delete Pattern</p>
                    </div>
                    }
                </div>
                {!showError && <div className={styles.errormgsContainer}>
                    <p>Library name already exists</p>
                </div>}
            </div>
            <div>
                <div className={styles.ptbContainer}>
                    <div className={styles.libNameContainer}>
                        <div className={styles.patternLBName} style={{ marginTop: '0', paddingLeft: '0' }}>
                            <h2 className={styles.h2PatternName}>Patterns</h2>
                        </div>
                    </div>
                    <div className={styles.delBtnContainer} style={{ padding: '1rem', paddingTop: '1.9rem' }}>
                        <div>
                            <Button appearance="primary" style={{ fontSize: 'small' }} onClick={handleAddClick}> + Add Term </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Table arial-label="Default table" style={{  borderCollapse: 'separate', fontSize: '0.55rem', paddingLeft: '.5rem' }}>
                    <TableHeader className={styles.tblheader}>
                        <TableRow>
                            <TableHeaderCell style={{fontWeight: 500}} >PATTERN LABEL </TableHeaderCell>
                            <TableHeaderCell style={{fontWeight: 500}}>EXPRESSION TYPE</TableHeaderCell>
                            <TableHeaderCell style={{fontWeight: 500}}>EXPRESSION VALUE</TableHeaderCell>
                            <TableHeaderCell style={{fontWeight: 500}}>DESCRIPTION</TableHeaderCell>
                            <TableHeaderCell style={{ width: '65px',fontWeight: 500 }}>ACTIONS</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {showForm &&
                            <TableRow>
                                <TableCell role="gridcell">
                                    <Input placeholder="Enter label" id="pattern-library-name" value={patternData.label} onChange={handleInputChange} name="label" style={{ width: '100%' }} />
                                </TableCell>
                                <TableCell role="gridcell">
                                    <Select value={patternData.expressionType} onChange={handleInputChange} name='expressionType'>
                                        <option value="fuzzy-match"> Fuzzy Match </option>
                                        <option value="inline-regex"> Regular Expression </option>
                                        <option value="string-array"> String List </option>
                                    </Select>
                                </TableCell>
                                <TableCell role="gridcell">
                                    <Input placeholder="Add regular expression" id="pattern-library-pattern" value={patternData.pattern} onChange={handleInputChange} name="pattern" style={{ width: '100%' }} />
                                </TableCell>
                                <TableCell role="gridcell" style={{ resize: 'vertical' }}>
                                    <Textarea
                                        placeholder="Add description"
                                        value={patternData.description}
                                        onChange={handleInputChange} name='description'
                                        className={styles.textarea} style={{ resize: 'vertical' }} ref={textareaRef} />
                                </TableCell>
                            </TableRow>
                        }{showForm &&
                            <TableRow>
                                <TableCell align="right" role="gridcell" colSpan={4} style={{ textAlign: "right" }}>
                                    <div style={{ paddingRight: '1rem', display: 'inline' }}>
                                        <Button appearance="secondary" onClick={resetPatternData}>Cancel</Button>
                                    </div>
                                    <div style={{ display: 'inline' }}>
                                        <Button appearance="primary" disabled={patternData.label.length == 0 || patternData.pattern.length == 0 || name.length == 0 || comment.length == 0 || !showError} onClick={submitFormData}>Save</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        }
                        {customPatternData.patterns.map((item, index) =>
                            <TableRow key={item.id}>
                                <TableCell style={{fontWeight: 600}} tabIndex={index} role="gridcell">{item.label}</TableCell>
                                <TableCell style={{fontWeight: 500, color: 'gray'}} tabIndex={index} role="gridcell">{item.expressionType}</TableCell>
                                <TableCell tabIndex={index} role="gridcell"><div ><span className={styles.patternBackground}>{item.pattern}</span></div></TableCell>
                                <TableCell style={{fontWeight: 500, color: 'gray'}} tabIndex={index} role="gridcell">{item.description}</TableCell>
                                <TableCell tabIndex={index} role="gridcell">
                                    <TableCellLayout>
                                        <EditRegular style={{ fontSize: '1.2rem', paddingRight: '5px',cursor:'pointer' }} onClick={() => handleEditClick(item)} >  </EditRegular>
                                        <DeleteRegular style={{ fontSize: '1.2rem',cursor:'pointer' }} onClick={() => !showForm ? handleDeleteClick(item) : null}>  </DeleteRegular>
                                    </TableCellLayout>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div >
    )
}
export default EditPattern
