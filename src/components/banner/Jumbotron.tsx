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
      <Box sx={styles.imageContainer}>
        <Image
          src={backgroundImage}
          alt="Jumbotron Background"
           layout="responsive"
           width={1920} // Example width
     height={1080} // Example height
          objectFit="cover"
          objectPosition="center"
        />
      </Box>
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