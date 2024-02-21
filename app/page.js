"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import Image from "next/image";
import styles from "./Home.module.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

 function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const promptValue = e.target.prompt.value.trim();

    if (!promptValue) {
      toast.error("Enter the prompt");
      return;
    }
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptValue,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TextArtify</title>
      </Head>
      <h1 className={styles.underlined}>
  Welcome to TextArtify
</h1>

      <h3 style={{textAlign:'center',color:'#82ed5c'}}>
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/stable-diffusion">SDXL</a>:
      </h3>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="prompt" placeholder="Enter a prompt to display an image" />
        <button type="submit">Go!</button>
      </form>
      <ToastContainer />
      {error && <div>{error}</div>}

      {prediction && (
        <div>
            {prediction.output && (
              <div className={styles.imageWrapper}>
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes='100vw'
              />
              </div>
            )}
            <p>status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}
export default Home;