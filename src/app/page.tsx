import { Box } from "@mui/material";
import styles from "./page.module.css";
import PricingPackagesContainer from "@/components/pricing-packages/PricingPackagesContainer";

export default function Home() {
  return (
    <div className={styles.page}>
      <Box>
        <PricingPackagesContainer />
      </Box>
    </div>
  );
}
