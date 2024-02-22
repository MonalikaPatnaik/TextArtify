"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
// import Loader from 'react-loader-spinner';
import { RotatingLines } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import Image from "next/image";
import styles from "./Home.module.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function Home() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const promptValue = e.target.prompt.value.trim();

    if (!promptValue) {
      toast.error("Enter the prompt");
      return;
    }
    setLoading(true);
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
    if (!response.ok) {
      toast.error(prediction.detail);
      setLoading(false);
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
      if (!response.ok) {
        toast.error(prediction.detail);
        setLoading(false);
        return;
      }
      setPrediction(prediction);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TextArtify</title>
      </Head>
      <h1 className={styles.underlined}>Welcome to TextArtify</h1>

      <h3 style={{ textAlign: "center", color: "#82ed5c" }}>
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/stable-diffusion">SDXL</a>:
      </h3>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="prompt"
          placeholder="Enter a prompt to display an image"
        />
        <button type="submit">Go!</button>
      </form>
      <ToastContainer />

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <RotatingLines
          visible={true}
          height={96}
          width={96}
          color="grey"
          strokeWidth={5}
          animationDuration={0.75}
          ariaLabel="rotating-lines-loading"
        />
        </div>
      )}
      {!loading && prediction && (
        <div>
          {prediction.output && (
            <div className={styles.imageWrapper}>
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default Home;
