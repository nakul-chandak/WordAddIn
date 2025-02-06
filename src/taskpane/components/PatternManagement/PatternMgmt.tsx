import { makeStyles, Image, Checkbox, Button, SearchBox, Label, Link } from "@fluentui/react-components";

import * as React from "react";
import { InfoLabel } from "@fluentui/react-components";
import log from "../../../../assets/Guardrail_WithName.png";
import { useNavigate } from "react-router-dom";
import { useToaster } from "../../../hooks/useToast";
import { PatternMgmtService } from "../../../common/services/pattern-mgmt/pattern-mgmt.service";
import { SystemPattern } from "../../../common/services/pattern-mgmt/models/SystemPattern";
import {
    Edit12Regular,
    Info12Regular
} from "@fluentui/react-icons";
import { AuthContext } from "../../../context/authContext";
import SystemPatternDetails from "./SystemPaternDetails";

const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "0px 20px 50px 10px",
        rowGap: "20px",
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

    flexWrap: {
        flexWrap: "wrap"
    },
    flex: {
        display: 'flex'
    },
    w300px: {
        width: '300px'
    },

    checkboxWrapper: {
        display: "flex",
        alignItems: "center",
    },

    linecontainer: {
        paddingLeft: '1rem',
        paddingRight: '1rem'
    },
    line: {
        width: '100%',
        marginBottom: '1rem',
        marginTop: '1rem'
    },
    testboxStyle: {
        flexWrap: "wrap", display: 'flex', paddingBottom: '.5rem'
    },
    infoLabel: {
        position: 'relative',
        bottom: '4rem',
        left: '0.5rem'
    },
    delBtnContainer: {
        gap: '.5rem',
        justifyContent: 'center',
        alignContent: 'center',
        cursor: 'pointer',
        display: 'flex',
        color: 'rgb(192 152 206)',
        lineHeight: '1.25rem'
    }
});

function PatternMgmt() {
    const styles = useStyles();
    const navigate = useNavigate();
    const toaster = useToaster();
    const [textInput, setTextInput] = React.useState("");
    const [flag, setFlag] = React.useState(false)
    const [sysPatternData, setSysPatternData] = React.useState([]);
    const [custPatternData, setCustPatternData] = React.useState([]);
    const [activePatternData, setActivePatternData] = React.useState([]);
    const [selectedOptions, setSelectedOptions] = React.useState<string[] | null>([]);
    const [selectedCustOptions, setSelectedCustOptions] = React.useState<string[] | null>([]);
    const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
    const [sysData, setSysData] = React.useState([])
    const [custData, setCustData] = React.useState([])
    const [sysPattern, setSysPattern] = React.useState({});
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchCustQuery, setSearchCustQuery] = React.useState('');
    const [isHovered, setIsHovered] = React.useState(null);
    const [dialog, setDialog] = React.useState(false);
    const userContext = React.useContext(AuthContext);
    const [isProUser, setIsProUser] = React.useState(false);
    const [library, setLibrary] = React.useState([]);

    /// Search the system libraries
    const handleSearch = (event) => {
        if (event.target.value == undefined) {
            event.target.value = "";
        }

        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = sysData.filter(person =>
            person.libraryGroup.toLowerCase().includes(query)
        );
        const result = pipe(
            (data) => data.filter(pattern => pattern.libraryGroup.toLowerCase().includes(query)),
            (data) => data // Add any additional transformations if needed
        )(sysData);

        setSysPatternData(result);
    };

    /// Search the custom libraries
    const handleCustSearch = (event) => {
        if (event.target.value == undefined) {
            event.target.value = "";
        }

        const query = event.target.value.toLowerCase();
        setSearchCustQuery(query);
        const filtered = custData.filter(custPattern =>
            custPattern.libraryGroup.toLowerCase().includes(query)
        );
        const result = pipe(
            (data) => data.filter(pattern => pattern.libraryGroup.toLowerCase().includes(query)),
            (data) => data // Add any additional transformations if needed
        )(custData);

        setCustPatternData(result);
    };

    /// Fetch the Custom pattern libraries using API call
    const getCustomPatterns = async () => {
        PatternMgmtService.getCustomPatterns().then((res: any) => {
            setCustPatternData(res);
            setCustData(res);
            console.log(res);
        }, (error: any) => {
            toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
            console.log(error);
            //props.handleApiCall()
        });
    };

    const getSystemLibrary = (pattern) => {
        setLibrary([]);
        if (pattern.id != undefined || pattern.id != null) {
            PatternMgmtService.getSystemLibrary(pattern.id).then(async (res: any) => {
                setLibrary(res.patterns);
            }, (error: any) => {
                toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
                console.log(error);
                //props.handleApiCall()
            })
        }
    }

    /// Fetch the all active pattern libraries using API call
    const getActivePatterns = async () => {
        PatternMgmtService.getActivePatterns().then((custRes: any) => {
            setActivePatternData(custRes);
            const selected = custRes.filter(item => item.isEnabled).map(item => item.libraryId);
            setSelectedOptions(selected);
            setSelectedCustOptions(selected);
            console.log(custRes);
        }, (error: any) => {
            toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
            console.log(error);
            //props.handleApiCall()
        });
    };

    /// Fetch the all System pattern libraries using API call
    const getSysPatterns = async () => {
        PatternMgmtService.getSystemPatterns().then(async (res: any) => {
            setSysPatternData(res.data);
            setSysData(res.data)
            console.log(res);
        }, (error: any) => {
            toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
            console.log(error);
            //props.handleApiCall()
        });
    };

    /// On checked/uncheck of system pattern's library enabled/disabled library
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;

        let sysPattern = sysData.find(person => person.id === id);

        let patternObj: SystemPattern = {
            isEnabled: checked,
            libraryId: sysPattern.id,
            libraryName: sysPattern.libraryGroup,
            patternType: 'System'
        };

        PatternMgmtService.updateStatus(patternObj).then(async (res: any) => {
            setSelectedOptions((prev) =>
                checked ? [...prev, id] : prev.filter((option) => option !== id)
            );

            let message = !res.isEnabled ? "Pattern enabled successfully" : "Pattern disabled successfully";

            toaster.success(message)

        }, (error: any) => {

            toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
            console.log(error);
            //props.handleApiCall()
        });
    };

    /// On checked/uncheck of custom pattern's library enabled/disabled library
    const handleCustCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;

        let custPattern = custData.find(person => person.id === id);

        let patternObj: SystemPattern = {
            isEnabled: checked,
            libraryId: custPattern.id,
            libraryName: custPattern.libraryGroup,
            patternType: 'Custom'
        };

        PatternMgmtService.updateStatus(patternObj).then(async (res: any) => {
            let message = !res.isEnabled ? "Pattern enabled successfully" : "Pattern disabled successfully";

            toaster.success(message);
            setSelectedCustOptions((prev) =>
                checked ? [...prev, id] : prev.filter((option) => option !== id)
            );

        }, (error: any) => {
            toaster.error(error.message ? error.message : "The application has encountered an error. Please try again later.");
            console.log(error);
            //props.handleApiCall()
        });
    };

    /// On click on edit button of custom pattern library
    const editPattern = (id) => {
        navigate('edit-pattern/' + id);
    }

    /// On click on + Create New custom library pattern 
    const onCreateNewClick = () => {
        navigate('add-pattern');
    }

    const handleCloseDialog = (isClose) => {
        setDialog(isClose);
    }

    const handleOpenDialog = (value) => {
        setSysPattern(value)
        setDialog(true);
        getSystemLibrary(value);
    }
    /// Onloading of page need to call API
    React.useEffect(() => {
        if (userContext.subscriptionPlan === "pro") {
            setIsProUser(true);
            getSysPatterns();
        } else {
            setIsProUser(false);
        }

        getCustomPatterns();
        getActivePatterns();
    }, [userContext.subscriptionPlan]);

    return (
        <div style={{ margin: "auto", paddingTop: '3.5rem', minHeight: "93vh"  }}>
            {isProUser && <div style={{ padding: '0 1rem 0 1rem' }}>
                <h2 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '1rem' }}>System Pattern Libraries</h2>
                <p style={{ color: 'rgb(75 85 99)', fontSize: '.875rem', lineHeight: '1.25rem' }}>Patterns are libraries of terms that allow prompts to accurately detect labels and similar expressions related to specific compliance or information disclosure matters. <Link href="">Learn more</Link></p>
                <div className={styles.testboxStyle} >
                    <SearchBox placeholder="Search By Name" style={{
                        color: 'rgb(75 85 99)', fontSize: '.875rem', lineHeight: '1.25rem', WebkitAppearance: 'none'
                    }} value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <div style={{ flexWrap: "wrap", display: 'flex' }} >
                    {sysPatternData.map((item, index) => (
                        <div key={index} style={{ flexWrap: "wrap", display: 'flex', width: '300px' }}>
                            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start' }} className={styles.checkboxWrapper}>
                                <Checkbox id={item.id} value={item.libraryGroup} onChange={handleCheckboxChange} checked={selectedOptions.includes(item.id)}></Checkbox>
                                <Label size="small" style={{ padding: '.5rem' }}>{item.libraryGroup}</Label>
                                <Info12Regular
                                    style={{
                                        marginTop: '0.6rem', width: '15px', height: '15px',
                                        cursor: 'pointer'
                                    }} onClick={() => handleOpenDialog(item)}>
                                </Info12Regular>
                                <span style={{ marginTop: "0px", float: "right" }}></span>

                            </div>
                        </div>
                    ))}
                </div>
                <SystemPatternDetails
                    openDialog={dialog}
                    setDialog={setDialog} pattern={sysPattern} patterns={library} />
                <div >
                    <hr className={styles.line}></hr>
                </div>
            </div>}
            <div style={{ padding: '0 1rem 1rem 1rem' }}>
                <h2 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '1rem' }}>Custom Pattern Libraries</h2>
                <p style={{ color: 'rgb(75 85 99)', fontSize: '.875rem', lineHeight: '1.25rem' }}>Create your own pattern libraries. <Link href="">Learn more</Link></p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className={styles.testboxStyle}  >
                        <SearchBox placeholder="Search By Name" style={{ color: 'rgb(75 85 99)', fontSize: '.875rem', lineHeight: '1.25rem', WebkitAppearance: 'none' }}
                            value={searchCustQuery}
                            onChange={handleCustSearch}
                        />
                    </div>
                    <div>
                        <Button appearance="primary" style={{ fontSize: 'small' }} onClick={onCreateNewClick}>+ Create New</Button>
                    </div>
                </div>
                <div style={{ flexWrap: "wrap", display: 'flex' }} >
                    {custPatternData.map((item, index) => (
                        <div key={index} style={{ flexWrap: "wrap", display: 'flex', width: '300px' }}>
                            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start' }} className={styles.checkboxWrapper}
                            >
                                <Checkbox id={item.id} value={item.libraryGroup} onChange={handleCustCheckboxChange} checked={selectedCustOptions.includes(item.id)}></Checkbox>
                                <Label size="small" style={{ padding: '.5rem' }}>{item.libraryGroup}</Label>
                                {(<div >
                                    <Edit12Regular
                                        style={{
                                            height: '15px',
                                            width: '15px',
                                            marginTop: '0.6rem',
                                            marginLeft: '3rem',
                                            cursor: 'pointer'
                                        }} onClick={() => editPattern(item.id)}>
                                    </Edit12Regular>
                                </div>)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default PatternMgmt
