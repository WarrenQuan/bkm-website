// components/ImageURLInput.js
import React, { useState, useEffect } from "react";
import { Button, LinearProgress } from "@mui/material";
import styles from "../styles/Home.module.css";

const ImageURLInput = ({ onSubmit, onUpload, model, prompt, isBkmEmployee }) => {
  const [apiKey, setApiKey] = useState("");
  const [loading, startLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [apiRoute, setApiRoute] = useState("");

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
    onUpload(event.target.value);
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
      {!isBkmEmployee && (
        <input
          type="text"
          placeholder="enter api key"
          className={styles.input}
          value={apiKey}
          onChange={handleApiKeyChange}
        />)}
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
