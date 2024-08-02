import React, { useState, useEffect } from "react";
import { Button, LinearProgress } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import styles from "../styles/Home.module.css";
import Papa from "papaparse"; // CSV parsing library
import { saveAs } from "file-saver"; // Library to save files

const CSVUpload = ({ onSubmit, onUpload, model, prompt, isBkmEmployee }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [progress, setProgress] = useState("0");
  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };
  const [apiRoute, setApiRoute] = useState("");

  const handleLoading = (progress) => {
    setProgress(progress);
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
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);

    Papa.parse(selectedFile, {
      header: true,
      complete: async (result) => {
        try {
          const updatedData = [];
          let progressTracker = 1;
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
              updatedData.push({
                ...rest,
                imageUrl,
                [prompt]: JSON.stringify(data, null, 2),
              });
              onUpload(imageUrl);
              let completionString;
              if (progress >= result.data.length)
                completionString = "Completed! ";
              else
                completionString =
                  (progressTracker / result.data.length) * 100 + "% complete! ";
              onSubmit(completionString + "Most Recent Generation:" + JSON.stringify(data, null, 2)); // Pass the response data up to the parent
              console.log(data);
            } else {
              console.log(data.error);
              // Handle API error if needed
              updatedData.push({
                ...rest,
                imageUrl,
                [prompt]: "Error: " + data.error,
              });
            }
            handleLoading((progressTracker / result.data.length) * 100);
            progressTracker += 1;
          }

          // Convert updated data to CSV
          const csv = Papa.unparse(updatedData);
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          saveAs(blob, "updated_data.csv");
        } catch (error) {
          console.error(error);
          // You can add an alert or some error handling UI here
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div>
      <div className={styles.inlineContainer}>
        {!isBkmEmployee && (
          <input
            type="password"
            placeholder="Enter API key"
            className={styles.input}
            value={apiKey}
            onChange={handleApiKeyChange}
          />
        )}
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
          style={{ marginLeft: "10px" }}
        >
          Upload
        </Button>
      </div>
      <p className="font-bold" style={{ textAlign: "center" }}>
        ensure there is an &quot;imageUrl&quot; column
      </p>
      {loading && (
        <LinearProgress
          style={{ margin: "5%" }}
          variant="determinate"
          value={progress}
        />
      )}
    </div>
  );
};

export default CSVUpload;
