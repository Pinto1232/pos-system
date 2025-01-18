import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { JumbotronProps } from "./Jumbotron.types";
import { styles } from "./Jumbotron.styles";

const Jumbotron: React.FC<JumbotronProps> = ({
  title,
  subtitle,
  backgroundImage,
}) => {
  return (
    <Box sx={styles.jumbotron}>
      {/* Background Image */}
      <Box sx={styles.imageContainer} style={{ position: "relative" }}>
        <Image
          src={backgroundImage}
          alt="Jumbotron Background"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority={true} // Set to true if the image is above the fold
        />
      </Box>

      {/* Content Section */}
      <Box sx={styles.content}>
        <Typography variant="h2" sx={styles.title}>
          {title}
        </Typography>
        <Typography variant="h5" sx={styles.subtitle}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default Jumbotron;
