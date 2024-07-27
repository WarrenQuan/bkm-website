// components/ImageURLInput.js
import React, { useState } from "react";
import { Button } from "@mui/material";
import styles from "../styles/Home.module.css";

const ImageURLInput = ({ onSubmit, model }) => {
  const [apiKey, setApiKey] = useState(
    ""
  );
  const [imageUrl, setImageUrl] = useState(
    ""
  );
  const [response, setResponse] = useState(null);

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
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
    console.log("in handleSubmit");
    console.log(JSON.stringify({ imageUrl }));
    console.log(apiKey);

    const response = await fetch("/api/generate-description/" + apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    if (response.ok) {
      setResponse(data);
      onSubmit(data); // Pass the response data up to the parent
      console.log(data);
    } else {
      console.error(data.error);
    }
  };

  return (
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
  );
};

export default ImageURLInput;
