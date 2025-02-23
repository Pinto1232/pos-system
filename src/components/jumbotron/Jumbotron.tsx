import React from "react";
import styles from "./Jumbotron.module.css";

interface JumbotronProps {
  heading: string;
  subheading: string;
  backgroundImage: string;
  overlayColor?: string; // e.g. "rgba(0,0,0,0.5)" or "linear-gradient(...)"
  height?: string; // e.g. "400px" or "100vh"
}

const JumbotronComponent: React.FC<JumbotronProps> = ({
  heading,
  subheading,
  backgroundImage,
  overlayColor = "rgba(0, 0, 0, 0.5)",
  height = "500px", // default height
}) => {
  return (
    <div
      className={styles.jumbotronContainer}
      style={{
        backgroundImage: `
          ${overlayColor},
          url(${backgroundImage})
        `,
        height: height, 
        backgroundBlendMode: 'overlay', 
        backgroundSize: 'cover', // Ensure the image covers the entire container
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
      }}
    >
      <div className={styles.content}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subheading}</p>
      </div>
    </div>
  );
};

// ✅ Wrap the presentational component with React.memo
const Jumbotron = React.memo(JumbotronComponent);

export default Jumbotron;
