import React, { useState } from 'react';
import { Button, LinearProgress } from '@mui/material';
import styles from "../styles/Home.module.css";
import axios from 'axios';

const UploadButton = ({ onSubmit, model, prompt }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("")
  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  let apiRoute;
  switch (model) {
    case "gpt4":
      apiRoute = "gpt-4o";
      break;
    case "gemini":
      apiRoute = "gemini-1.5-flash";
      break;
    case "claude":
      apiRoute = "claude-3";
      break;
    default:
      apiRoute = "gpt-4-turbo";
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    setLoading(true);
    console.log("in handleUpload");

    try {
      const base64File = await getBase64(selectedFile);
      console.log("base64")
      console.log({base64File})
      const response = await axios.post(
        `/api/generate-description/${apiRoute}/image`,
        { image: base64File, prompt },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
        }
      );

      if (response.status === 200) {
        onSubmit(response.data); // Pass the response data up to the parent
        console.log(response.data);
      } else {
        console.error(response.data.error);
        // You can add an alert or some error handling UI here
      }
    } catch (error) {
      console.error(error);
      // You can add an alert or some error handling UI here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.inlineContainerButton}>
      <input
          type="text"
          placeholder="enter api key"
          className={styles.input}
          value={apiKey}
          onChange={handleApiKeyChange}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
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
      {loading && <LinearProgress style={{ margin: '5%' }} />}
    </div>
  );
};

export default UploadButton;
