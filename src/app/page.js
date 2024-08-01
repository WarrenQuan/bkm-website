"use client";
import React, { useEffect } from "react";
import styles from "./styles/Home.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import Background from "./components/Background";
import BasicSelect from "./components/Dropdown";
import UploadButton from "./components/UploadButton";
import ImageURLInput from "./components/ImageUrlInput";
import CSVUpload from "./components/CSVUpload";
import Head from "next/head";
import { Button, Alert, Fade } from "@mui/material";
const axios = require("axios");
require("dotenv").config();

const colorOptionsGenerate = [
  { value: "#03a9f4", label: "metadata" },
  { value: "#00bcd4", label: "sentiment analysis" },
  { value: "#009688", label: "tags" },
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
  const [open, setOpen] = React.useState(true);
  const [prompt, setPrompt] = React.useState("metadata");
  const [LLM, setLLMLabel] = React.useState("gpt4");
  const [type, setTypeLabel] = React.useState("image url");
  const [file, setFile] = React.useState();
  const [preview, setPreview] = React.useState();
  const [description, setDescription] = React.useState("");
  const [isBkmEmployee, setisEmployee] = React.useState(false);

  const { data: session } = useSession();

  const handlePreview = async (file) => {
    if (typeof file === "string" || file instanceof String) {
      console.log("IS A STRING");
      if (await checkImage(file)) setPreview(file);
      else setPreview("");
    } else setPreview(URL.createObjectURL(file));
  };

  const handleImageURLSubmit = (data) => {
    setDescription(data); // Update the parent state with the response data
  };
  const handleFileSubmit = (data) => {
    // Process the form data here
    console.log("API Key:", data.apiKey);
    console.log("Image URL:", data.imageUrl);
    setDescription(data);
  };

  const handleOptionPromptChange = (label) => {
    console.log("selected option", label);
    setPrompt(label);
  };
  const handleOptionLLMChange = (label) => {
    console.log("selected option", label);
    setLLMLabel(label);
  };
  const handleOptionTypeChange = (label) => {
    console.log("selected option", label);
    setTypeLabel(label);
  };

  const handleSessionUser = () => {
    const allowedDomain = "brooklynmuseum.org"; // Replace with the organization's domain
    const userDomain = session.user.email.split("@")[1];
    setisEmployee(userDomain === allowedDomain);
  };

  useEffect(() => {
    if (session?.user) {
      handleSessionUser();
    }
  }, [session]);

  async function checkImage(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true); // Image loaded successfully
      img.onerror = () => resolve(false); // Image failed to load
      img.src = imageUrl;
    });
  }

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
      <div>
        {!session ? (
          <>
            {open && (
              <Alert
                open={open}
                onClose={() => setOpen(false)}
                severity="info"
                style={{
                  margin: "20px",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  float: "left",
                }}
              >
                Log in to BkM account to access preloaded API-keys
              </Alert>
            )}
          </>
        ) : isBkmEmployee ? (
          <>
            {open && (
              <Alert
                open={open}
                onClose={() => setOpen(false)}
                severity="success"
                style={{
                  margin: "20px",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  float: "left",
                }}
              >
                Logged In
              </Alert>
            )}
          </>
        ) : (
          <>
            {open && (
              <Alert
                open={open}
                onClose={() => setOpen(false)}
                severity="warning"
                style={{
                  margin: "20px",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  float: "left",
                }}
              >
                Logged into a non-BkM affiliated account. Please log-in to a BkM
                email.
              </Alert>
            )}
          </>
        )}
        {!session ? (
          <>
            <Button
              onClick={() => signIn("google")}
              variant="contained"
              href="#contained-buttons"
              color="primary"
              style={{
                backgroundColor: "black",
                margin: "20px",
                position: "absolute",
                top: "0",
                right: "0",
                float: "right",
              }}
            >
              bkm sign in
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => signOut()}
              variant="contained"
              href="#contained-buttons"
              color="primary"
              style={{
                backgroundColor: "black",
                margin: "20px",
                position: "absolute",
                top: "0",
                right: "0",
                float: "right",
              }}
            >
              bkm sign out
            </Button>
          </>
        )}
      </div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {session && session.user.name && (
            <span
              className="font-bold"
              style={{ fontSize: "36px", color: "black" }}
            >
              welcome {session.user.name.toLowerCase().split(" ")[0]}!{" "}
            </span>
          )}
        </h1>
        <div className={styles.inlineContainer}>
          <h1 className={styles.title}>
            <span className="font-bold">generate </span>
          </h1>
          <BasicSelect
            colorOptions={colorOptionsGenerate}
            onOptionChange={handleOptionPromptChange}
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
          <ImageURLInput
            onSubmit={handleImageURLSubmit}
            onUpload={handlePreview}
            model={LLM}
            prompt={prompt}
            isBkmEmployee={isBkmEmployee}
          />
        )}
        {/* add admin param to each to potentially plug in api key and get rid of input (!admin) */}
        {type === "image file" && (
          <div className={styles.inlineContainer}>
            <UploadButton
              onSubmit={handleFileSubmit}
              onUpload={handlePreview}
              model={LLM}
              prompt={prompt}
              isBkmEmployee={isBkmEmployee}
            />
          </div>
        )}
        {type === "csv" && (
          <div className={styles.inlineContainer}>
            <CSVUpload
              onSubmit={handleFileSubmit}
              onUpload={handlePreview}
              model={LLM}
              prompt={prompt}
              isBkmEmployee={isBkmEmployee}
            />
          </div>
        )}
        <div className={styles.inlineContainer}>
          {preview && (
            <div>
              <div className={styles.imageContainer}>
                <img
                  src={preview}
                  className={styles.centeredImage}
                  alt="Uploaded Preview"
                  onerror="this.style.display='none'"
                />
              </div>
            </div>
          )}
          {description && (
            <p className={styles.centeredParagraph}>
              {JSON.stringify(description, null, 2)}
            </p>
          )}
        </div>
      </main>
      <Background />
    </div>
  );
}
