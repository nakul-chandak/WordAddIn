import { makeStyles, Image, Checkbox, Button, CounterBadge, Textarea, useRestoreFocusTarget, Input, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, TableCellLayout, Select } from "@fluentui/react-components";
import * as React from "react";
import { useToaster } from "../../../hooks/useToast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PatternMgmtService } from "../../../common/services/pattern-mgmt/pattern-mgmt.service";
import log from "../../../../assets/logo.png";
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
    const [customPatternData, setCustomPatternData] = React.useState(new CustomLibrary("", "", "", "", []));
    const textareaRef = React.useRef(null);
    const [name, setName] = React.useState('');
    const [nameBeforeUpdate, setNameBeforeUpdate] = React.useState('');
    const [comment, setComment] = React.useState('');
    const [isUpdated, setIsUpdated] = React.useState(false);
    const [showForm, setShowForm] = React.useState(false);
    const [patternData, setPatternData] = React.useState(new Pattern("", "", "", "", ""))
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
            toaster.error(error.message);
            console.log(error);
            //props.handleApiCall()
        });
    };

    const isPatternNameAvailable = (pattern) => {
        return PatternMgmtService.checkIsLibraryNameAvailble(pattern).then(async (res: any) => {
            return res;
        }, (error: any) => {
            toaster.error(error.message);
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
            }
        },
            (error: any) => {
                toaster.error(error.message);
                console.log(error);
            });
    };

    const handleDeleteClick = (item) => {
        const patternData = customPatternData.patterns.filter(pattern => pattern.id !== item.id);
        customPatternData.patterns = patternData;

        PatternMgmtService.deletePattern(id, item.id).then(async (res: any) => {
            if (res) {
                getCustomPatternById(id);
            }
        },
            (error: any) => {
                toaster.error(error.message);
                console.log(error);
            });
    }

    const handleLibraryDeleteClick = () => {
        PatternMgmtService.deleteLibrary(id).then(async (res: any) => {
            if (res) {
                navigate('/patterns-management')
            }
        },
            (error: any) => {
                toaster.error(error.message);
                console.log(error);
            });
    }

    const handleAddClick = () => {
        setPatternData(new Pattern("", "", "", "", ""));
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
        setPatternData(new Pattern("", "", "", "", ""));
        setShowForm(false);
    }

    const submitFormData = () => {
        if(isUpdate){
            updateCustomLibraryDetails();
        }else{
            
        }
    }

    const updateCustomLibraryDetails = ()=>{
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
            }
        }, (error: any) => {
            toaster.error(error.message);
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
        <div style={{ margin: "auto" }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '1rem' }}>
                <Image
                    alt="Guardrail"
                    src={log}
                    height={70}
                    width={'200px'}
                    style={{ padding: '10px' }} />
            </div>
            <div className={styles.bigGray}>
                <div className={styles.headerContainer}>
                    <Link to="/patterns-management" className={styles.nounderline}>
                        <p > Existing patterns </p>
                    </Link>
                    <span className={styles.textSpan}> &gt;</span>
                    <span style={{ paddingLeft: '1rem' }}><p> {isUpdate ? 'Update' : 'Add'}  Custom Pattern Library</p></span>
                </div>
                <div className={styles.patternLBName}>
                    <h2 className={styles.h2PatternName}>Pattern Library Name</h2>
                </div>
                <div className={styles.ptbContainer}>
                    <div className={styles.libNameContainer}>
                        <div>
                            <Input placeholder="Enter library name" id="pattern-library-name" value={name} onChange={handleNameInputChange} />
                        </div>
                        <div>
                            <Input placeholder="Enter library description" id="pattern-library-name" value={comment}
                                onChange={handleCommentInputChange} />
                        </div>
                        {isUpdated && isUpdate &&
                            <div>
                                <Button appearance="primary" onClick={updateCustomLibrary} style={{ fontSize: 'small' }}>Update Library Details</Button>
                            </div>}
                    </div>
                    {isUpdate && <div className={styles.delBtnContainer} onClick={handleLibraryDeleteClick} style={{ fontSize: '.7rem', paddingTop: '.5rem' }}>
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
                <Table arial-label="Default table" style={{ minWidth: "510px", borderCollapse: 'separate', fontSize: '0.55rem', paddingLeft: '.5rem' }}>
                    <TableHeader className={styles.tblheader}>
                        <TableRow>
                            <TableHeaderCell >PATTERN LABEL </TableHeaderCell>
                            <TableHeaderCell >EXPRESSION TYPE</TableHeaderCell>
                            <TableHeaderCell >EXPRESSION VALUE</TableHeaderCell>
                            <TableHeaderCell >DESCRIPTION</TableHeaderCell>
                            <TableHeaderCell style={{ width: '65px' }}>ACTIONS</TableHeaderCell>
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
                                <TableCell tabIndex={index} role="gridcell">{item.label}</TableCell>
                                <TableCell tabIndex={index} role="gridcell">{item.expressionType}</TableCell>
                                <TableCell tabIndex={index} role="gridcell"><div ><span className={styles.patternBackground}>{item.pattern}</span></div></TableCell>
                                <TableCell tabIndex={index} role="gridcell">{item.description}</TableCell>
                                <TableCell tabIndex={index} role="gridcell">
                                    <TableCellLayout>
                                        <EditRegular style={{ fontSize: '1.2rem', paddingRight: '1rem' }} onClick={() => handleEditClick(item)} >  </EditRegular>
                                        <DeleteRegular style={{ fontSize: '1.2rem' }} onClick={() => !showForm ? handleDeleteClick(item) : null}>  </DeleteRegular>
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
