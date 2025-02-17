// /src/utils/iconMap.ts
import * as Icons from "@mui/icons-material";

const iconMap: { [key: string]: React.ElementType } = {
  "MUI:StartIcon": Icons.Start,
  "MUI:TrendingUpIcon": Icons.TrendingUp,
  "MUI:BuildIcon": Icons.Build,
  "MUI:BusinessIcon": Icons.Business,
  "MUI:StarIcon": Icons.Star,
  "MUI:DefaultIcon": Icons.HelpOutline, // Fallback for unknown icons
};

export default iconMap;
