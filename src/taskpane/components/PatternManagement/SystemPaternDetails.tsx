import {
    Button, Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle,
    DialogTrigger, makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons';
import React, { useState } from 'react';
import jsonData from './pattern-template.json';
import { DialogFooter, SearchBox, initializeIcons } from '@fluentui/react';
import { useToaster } from "../../../hooks/useToast";
import { PatternMgmtService } from '../../../common/services/pattern-mgmt/pattern-mgmt.service';

const useStyles = makeStyles({
    dropZoneStyle: {
        border: '2px dashed #cccccc',
        borderRadius: '5px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
        marginTop: '20px'
    },

    previewContainerStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '10px'
    },
    testboxStyle: {
        flexWrap: "wrap", display: 'flex', paddingBottom: '.5rem'
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
    tableContainer: {
        maxHeight: '350px', // Restrict height for scrolling
        overflowY: 'auto', // Enable vertical scrolling
        border: '1px solid #ddd', // Optional: Add a border for clarity
        position: 'relative', // Needed for sticky headers
    },
    headerCell: {
        position: 'sticky', // Sticky position to keep header fixed
        top: 0, // Pin header to the top
        backgroundColor: '#f3f2f1', // Header background color
        zIndex: 1, // Ensure header stays above the body
    }
})

function SystemPatternDetails(props: any) {
    const [files, setFiles] = useState([]);
    const styles = useStyles();
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isFocused, setIsFocused] = useState(false);
    const toaster = useToaster();
    const [paterns, setPatterns] = React.useState([]);
    const [data, setData] = React.useState([]);
    const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

    const handleCloseDialog = (isClose) => {
        props.setDialog(isClose);
    }

    const handleSearch = (event) => {
        let query = "";
        if (event === undefined) {
            query = "";
        } else {
            query = event.target.value.toLowerCase();
        }

        setSearchQuery(query);

        const result = pipe(
            (data) => data.filter(pattern => pattern.label.toLowerCase().includes(query) || pattern.pattern.toLowerCase().includes(query) || pattern.description.toLowerCase().includes(query)),
            (data) => data
        )(data);

        setPatterns(result);
    };

    React.useEffect(() => {
        initializeIcons();
        setPatterns(props.patterns);
        setData(props.patterns);
        //getSystemLibrary()
    }, [props])


    return (
        <Dialog open={props.openDialog} onOpenChange={(_event, data) => handleCloseDialog(data.open)} modalType='non-modal'>
            <DialogSurface style={{ maxWidth: "90%", minHeight: '400px', paddingTop: '8px', paddingRight: '14px' }}>
                <DialogBody>
                    <DialogTitle
                        action={
                            <DialogTrigger disableButtonEnhancement action="close">
                                <Button
                                    appearance="subtle"
                                    aria-label="close"
                                    icon={<Dismiss24Regular />}
                                />
                            </DialogTrigger>
                        }
                       >
                        <span style={{ fontSize: 'small' }}>{props.pattern.libraryGroup}</span>
                        <span style={{ fontSize: 'x-small', fontWeight: 400, display: 'block' }}>{props.pattern.comment}</span>
                        <div style={{ width: '220px' }}>
                            <SearchBox
                                placeholder="Search"
                                disableAnimation
                                value={searchQuery}
                                style={{
                                    border: '1px solid rgb(50, 49, 48)'
                                }}
                                styles={{
                                    root: {
                                        selectors: {
                                            ':focus-within .ms-SearchBox-iconContainer': {
                                                display: 'flex !important',
                                                alignItems: 'center !important'// Ensure icon container is always visible
                                            },
                                            ':hover .ms-SearchBox-iconContainer': {
                                                width: '32px',
                                                opacity: '1'
                                            },
                                            ':hover .ms-SearchBox-icon': {
                                                opacity: '1'
                                            },
                                            '.ms-SearchBox-clearButton': {
                                                display: 'none'
                                            },
                                            '.ms-SearchBox .is-active':{
                                                border: '1px solid rgb(50, 49, 48) !important'
                                            },
                                            '.root-123.root-123::after': {
                                                border: '1px solid rgb(50, 49, 48) !important'
                                            },

                                            '.root-126::after': {
                                                position: 'absolute',
                                                border: '1px solid rgb(50, 49, 48) !important'
                                            }, '& input:focus': {
                                                outline: 'none', // Remove the default focus outline
                                                border: '2px solid #000', // Optional: Add a custom border on focus
                                                boxShadow: 'none', // Remove the default box shadow
                                            },
                                            // ':focus-within .ms-SearchBox-icon': {
                                            //     visibility: 'visible !important', // Force visibility on focus
                                            //     opacity: '1 !important',         // Prevent icon from disappearing
                                            // },
                                            '.root115 .ms-SearchBox-field': {
                                                paddingLeft: '0px !important',
                                                marginLeft: '-30px'
                                            },
                                            '.ms-SearchBox:focus-within .ms-SearchBox-iconContainer': {
                                                display: 'flex !important' /* Prevent icon from hiding */
                                            },
                                            '.ms-SearchBox:focus-within .ms-SearchBox-field::placeholder': {
                                                color: 'transparent' /* Hide placeholder when typing */
                                            },

                                            '.ms-SearchBox-field': {
                                                border: 'rgb(50, 49, 48) !important'
                                            },
                                            '.ms-SearchBox-iconContainer': {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                fontSize: '16px',
                                                width: '32px',
                                                textAlign: 'center',
                                                cursor: 'text'
                                            },
                                        },
                                    },
                                    iconContainer: {
                                        display: 'flex', // Ensure it's displayed
                                    },
                                    icon: {
                                        visibility: 'visible', // Always make sure the icon is visible
                                        opacity: '1',
                                        width: '32px',
                                        paddingRight: '2px',
                                        position: 'fixed',
                                        left: '32px',
                                        transform: 'scaleX(-1)',
                                        color: 'gray'
                                    },
                                    field: {
                                        width: '220px'
                                    }
                                }} onChange={handleSearch}
                            />
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ scrollbarWidth: 'none' }}>
                        <div className={styles.testboxStyle} >

                            <div className={styles.tableContainer} style={{ scrollbarWidth: 'none' }}>
                                <Table arial-label="Default table" style={{ minWidth: "510px", borderCollapse: 'separate', fontSize: '0.55rem' }}>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHeaderCell className={styles.headerCell} style={{ fontWeight: 500 }} >PATTERN LABEL </TableHeaderCell>
                                            <TableHeaderCell className={styles.headerCell} style={{ fontWeight: 500 }}>REGULAR EXPRESSION</TableHeaderCell>
                                            <TableHeaderCell className={styles.headerCell} style={{ fontWeight: 500 }}>DESCRIPTION</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paterns.map((item, index) =>
                                            <TableRow key={item.id}>
                                                <TableCell style={{ fontWeight: 600 }} tabIndex={index} role="gridcell">{item.label}</TableCell>
                                                <TableCell tabIndex={index} role="gridcell"><div ><span className={styles.patternBackground}>{item.pattern}</span></div></TableCell>
                                                <TableCell style={{ fontWeight: 500, color: 'gray' }} tabIndex={index} role="gridcell">{item.description}</TableCell>
                                            </TableRow>)}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}

export default SystemPatternDetails
