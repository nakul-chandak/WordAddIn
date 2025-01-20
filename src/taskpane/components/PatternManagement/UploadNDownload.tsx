import {
    Button, Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle,
    DialogTrigger, makeStyles,
} from '@fluentui/react-components'
import { Dismiss24Regular, ImageAddRegular } from '@fluentui/react-icons';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import jsonData from './pattern-template.json';
import { DialogFooter } from '@fluentui/react';

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
    }
})

function UploadNDownload(props: any) {
    const [files, setFiles] = useState([]);
    const styles = useStyles();
    const [error, setError] = useState('');

    // Handle file drop
    const onDrop = React.useCallback((acceptedFiles) => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
        setError('');
    }, []);

    const onDropRejected = React.useCallback(() => {
        setError('Invalid file type. Only JSON files are allowed.');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        multiple: false, // Disallow multiple files
        maxSize: 10 * 1024 * 1024, // 10 MB
        accept: {
            "application/json": [".json"]
        }
    });

    // Render file previews (for image files)
    const previews = files.map(file => (
        <div key={file.name}>
            <p style={{ width: '200px', margin: '10px' }} >{file.name}</p>
        </div>
    ));

    const handleCloseDialog = (isClose) => {
        props.setDialog(isClose);
    }

    const downloadFile = async () => {
        if (!jsonData) return;

        const dataStr = JSON.stringify(jsonData, null, 2); // Convert JSON object to string
        const blob = new Blob([dataStr], { type: 'application/json' }); // Create a blob
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'pattern-template.json'; // Set the downloaded file name
        document.body.appendChild(link);
        link.click(); // Programmatically click the link to trigger download
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Cleanup
    }

    return (
        <Dialog open={props.openDialog} onOpenChange={(_event, data) => handleCloseDialog(data.open)} modalType="non-modal">
            <DialogSurface style={{ maxWidth: "40%" }}>
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
                        style={{ marginLeft: "8px" }}>
                        Import Pattern with JSON File
                    </DialogTitle>
                    <DialogContent>
                        <div style={{ marginLeft: '-25px', marginRight:'-25px'}}>
                            <div>
                            <div className={styles.previewContainerStyle}>
                                {previews}
                            </div>
                            <div {...getRootProps()} className={styles.dropZoneStyle}>
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Drop the file here...</p>
                                ) : (
                                    <div>
                                        <span style={{ display: "block" }}><ImageAddRegular style={{ height: '50px', width: '50px' }}></ImageAddRegular></span>
                                        <p style={{ display: 'inline', color: 'rgba(37, 99, 235)' }}>Upload a file </p><span>drag & drop</span>
                                        <p style={{ fontSize: '.7rem', lineHeight: '1rem' }}>JSON file up to 10MB</p>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'right', paddingTop: '1rem' }}>
                                <Button appearance="primary" onClick={() => handleCloseDialog(false)} >
                                    Load File
                                </Button>
                            </div>
                        </div>
                        </div>
                        <div>
                            <hr></hr>
                            <p onClick={downloadFile}>Download JSON template</p>
                            <div>
                                <p>{error}</p>
                            </div>
                        </div>
                    </DialogContent>
                </DialogBody>
                <DialogFooter>
                    <hr></hr>
                    <p onClick={downloadFile}>Download JSON template</p>
                </DialogFooter>
            </DialogSurface>
        </Dialog>
    );
}

export default UploadNDownload