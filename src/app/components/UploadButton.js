import React, { useState, useEffect} from 'react';
import { Button, LinearProgress } from '@mui/material';
import { FileUploader } from "react-drag-drop-files";
import styles from "../styles/Home.module.css";
import Alert from '@mui/material/Alert';
import axios from 'axios';


const UploadButton = ({ onSubmit, onUpload, model, prompt, isBkmEmployee }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("")
  const [apiRoute, setApiRoute] = useState("");

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };
  useEffect(() => {
    let route = "gpt-4-turbo"; // default route
    let key = apiKey; // default key

    switch (model) {
      case "gpt4":
        route = "gpt-4o";
        key = isBkmEmployee ? process.env.NEXT_PUBLIC_OPENAI_API_KEY : key;
        break;
      case "gemini":
        route = "gemini-1.5-flash";
        key = isBkmEmployee ? process.env.NEXT_PUBLIC_GOOGLE_API_KEY : key;
        break;
      case "claude":
        route = "claude-3";
        key = isBkmEmployee ? process.env.NEXT_PUBLIC_CLAUDE_API_KEY : key;
        break;
      default:
        key = isBkmEmployee ? process.env.NEXT_PUBLIC_OPENAI_API_KEY : key;
    }

    setApiRoute(route);
    setApiKey(key);
  }, [model, isBkmEmployee]);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    onUpload(file);
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
        { base64: base64File, prompt: prompt },
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
      <div className={styles.inlineContainer}>
      {!isBkmEmployee && (
      <input
          type="password"
          placeholder="enter api key"
          className={styles.input}
          value={apiKey}
          onChange={handleApiKeyChange}
        />
      )}
        <FileUploader 
               multiple={false}
         id="upload-file"
                handleChange={handleFileChange} 
                name="file" 
        
                 />
        {/* <input
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
        </label> */}
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
