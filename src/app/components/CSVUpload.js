import React, { useState } from 'react';
import { Button, LinearProgressWithLabel } from '@mui/material';
import { FileUploader } from "react-drag-drop-files";
import styles from "../styles/Home.module.css";
import Papa from 'papaparse'; // CSV parsing library
import { saveAs } from 'file-saver'; // Library to save files

const CSVUpload = ({ onSubmit, onUpload, model, prompt }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [progress, setProgress] = useState("0");

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleLoading = (progress) => {
    setProgress(progress);
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

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    setLoading(true);

    Papa.parse(selectedFile, {
      header: true,
      complete: async (result) => {
        try {
          const updatedData = [];
          let progressTracker = 0;
          for (const row of result.data) {
            const { imageUrl, ...rest } = row;

            // Make API call for each imageUrl
            const response = await fetch(
              `/api/generate-description/${apiRoute}/image-url`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": apiKey,
                },
                body: JSON.stringify({ imageUrl: imageUrl, prompt: prompt }),
              }
            );

            const data = await response.json();
            if (response.ok) {
              // Add the response to the row
              updatedData.push({ ...rest, imageUrl, generatedResponse: data.toString()});
              onUpload(imageUrl);
              let completionString;
              if(progress === result.data.length)
                completionString = "Completed! "
              else completionString = ((progressTracker + 1 / result.data.length) * 100) + "% complete! "
              onSubmit(completionString + "Most Recent Generation:" + data); // Pass the response data up to the parent
              console.log(data);
            } else {
              console.log(data.error);
              // Handle API error if needed
              updatedData.push({ ...rest, imageUrl, generatedResponse: 'Error: ' + data.error });
            }
            progressTracker += 1;
            handleLoading((progressTracker / result.data.length) * 100)
          }

          // Convert updated data to CSV
          const csv = Papa.unparse(updatedData);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, 'updated_data.csv');

        } catch (error) {
          console.error(error);
          // You can add an alert or some error handling UI here
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div>
      <div className={styles.inlineContainer}>
        <input
          type="text"
          placeholder="Enter API key"
          className={styles.input}
          value={apiKey}
          onChange={handleApiKeyChange}
        />
        <FileUploader 
          types={["CSV"]}
          multiple={false}
          id="upload-file"
          handleChange={handleFileChange} 
          name="file" 
        />
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
      {loading && <LinearProgressWithLabel style={{ margin: '5%' }} variant="determinate" value={progress} />}
    </div>
  );
};

export default CSVUpload;
