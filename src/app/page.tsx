import { Box } from "@mui/material";
import styles from "./page.module.css";
import PricingPackages from "@/components/PricingPackages";

export default function Home() {
  return (
    <div className={styles.page}>
      <Box>
        <PricingPackages />
      </Box>
    </div>
  );
}
