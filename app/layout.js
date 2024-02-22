import { Inter } from "next/font/google";
import styles from "./Home.module.css";
// import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Textartify",
  description: "Application that converts text to image using in-built Replicate Model",
  icons:{
    icon:'./favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={styles.bg}>{children}</body>
    </html>
  );
}
