import React, { useState } from 'react';
import { Button } from '@mui/material';
import styles from "../styles/Home.module.css";
import axios from 'axios';

const UploadButton = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    // try {
    //   const response = await axios.post('https://your-api-endpoint.com/upload', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   console.log('File uploaded successfully', response.data);
    // } catch (error) {
    //   console.error('Error uploading file', error);
    // }
  };

  return (
    <div className={styles.inlineContainerButton}>
      <input
        accept="image/*"
        style={{ display: 'none'}}
        id="upload-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="upload-file">
        <Button variant="contained" color="primary" component="span">
          Select File
        </Button>
      </label>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpload}
        disabled={!selectedFile}
        style={{ marginLeft: '10px' }}
      >
        Upload
      </Button>
    </div>
  );
};

export default UploadButton;
