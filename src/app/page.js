"use client";
import React from "react";
import styles from "./styles/Home.module.css";
import FallingImages from "./components/FallingImages";
import BasicSelect from "./components/Dropdown";
import UploadButton from "./components/UploadButton";
import ImageURLInput from "./components/ImageUrlInput";
import Head from "next/head";

const colorOptionsGenerate = [
  { value: "#03a9f4", label: "metadata" },
  { value: "#00bcd4", label: "sentiment analysis" },
  { value: "#009688", label: "tag" },
];

const colorOptionsLLM = [
  { value: "#000000", label: "gpt4" },
  { value: "#5a8cd9", label: "gemini" },
  { value: "#BE987b", label: "claude" },
];

const colorOptionsType = [
  { value: "#d32f2f", label: "image url" },
  { value: "#c2185b", label: "image file" },
  { value: "#7b1fa2", label: "csv" },
];

export default function Home() {
  const [generateItem, setGenerate] = React.useState("metadata");
  const [LLM, setLLMLabel] = React.useState("gpt4");
  const [type, setTypeLabel] = React.useState("image url");
  const [file, setFile] = React.useState();
  const [description, setDescription] = React.useState(null);

  const handleFile = (files) => {
    setFile(files);
    console.log("selected option", file);
  };
  const handleImageURLSubmit = (data) => {
    setDescription(data); // Update the parent state with the response data
  };
  const handleFileSubmit = (data) => {
    // Process the form data here
    console.log("API Key:", data.apiKey);
    console.log("Image URL:", data.imageUrl);
  };

  const handleOptionGenerateChange = (label) => {
    console.log("selected option", label);
    setGenerate(label);
  };
  const handleOptionLLMChange = (label) => {
    console.log("selected option", label);
    setLLMLabel(label);
  };
  const handleOptionTypeChange = (label) => {
    console.log("selected option", label);
    setTypeLabel(label);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Brooklyn Museum Metadata Generator</title>

        <meta
          name="description"
          content="A simple Next.js app with centered title and form"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.inlineContainer}>
          <h1 className={styles.title}>
            <span className="font-bold">generate </span>
          </h1>
          <BasicSelect
            colorOptions={colorOptionsGenerate}
            onOptionChange={handleOptionGenerateChange}
          />
          <h1 className={styles.title}>
            <span className="font-bold">using </span>
          </h1>
          <BasicSelect
            colorOptions={colorOptionsLLM}
            onOptionChange={handleOptionLLMChange}
          />
          <h1 className={styles.title}>
            <span className="font-bold">for </span>
          </h1>
          <BasicSelect
            colorOptions={colorOptionsType}
            onOptionChange={handleOptionTypeChange}
          />
        </div>
        {/* conditional rendering baesd on input */}
        {type === "image url" && (
          <ImageURLInput onSubmit={handleImageURLSubmit} model={LLM} />
        )}
        {type === "image file" && (
          <div className={styles.inlineContainer}>
            <input
              type="text"
              placeholder="enter api key"
              className={styles.input}
            />
            <UploadButton onSubmit={handleFileSubmit} />
          </div>
        )}
        {type === "csv" && (
          <div className={styles.inlineContainer}>
            <input
              type="text"
              placeholder="enter api key"
              className={styles.input}
            />
            <UploadButton onSubmit={handleFileSubmit} />
          </div>
        )}
        {description &&
        <p className={styles.centeredParagraph}>
         {JSON.stringify(description, null, 2)}
        </p>
}
      </main>
      <FallingImages />
    </div>
  );
}
