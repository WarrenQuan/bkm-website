// components/ImageURLInput.js
import React, { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import styles from "../styles/Home.module.css";

const ImageURLInput = ({ onSubmit, onUpload, model, prompt }) => {
  const [apiKey, setApiKey] = useState("");
  const [loading, startLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [response, setResponse] = useState(null);

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
    onUpload(event.target.value);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    startLoading(true)
    console.log("in handleSubmit");
    console.log(JSON.stringify({ imageUrl }));
    console.log(apiKey);
    console.log(apiRoute);
    const response = await fetch(
      "/api/generate-description/" + apiRoute + "/image-url",
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
      startLoading(false)
      setResponse(data);
      onSubmit(data); // Pass the response data up to the parent
      console.log(data);
    } else {
      startLoading(false)
      console.log(data.error);
      // <Alert severity="error">{data.error}</Alert>
    }
  };

  return (
    <div>
     
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inlineContainer}>
        <input
          type="text"
          placeholder="enter api key"
          className={styles.input}
          value={apiKey}
          onChange={handleApiKeyChange}
        />
        <input
          type="text"
          placeholder="enter image url"
          className={styles.input}
          value={imageUrl}
          onChange={handleImageUrlChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </form>
    {loading &&
    <LinearProgress style={{margin: "5% 5% 5% 5%"}}/>
    }
    </div>
  );
};

export default ImageURLInput;
