import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { SubItemsProps } from "./types";

const SubItems: React.FC<SubItemsProps> = ({
  parentLabel,
  subItems,
  isExpanded,
  textColor,
  onItemClick
}) => {
  const [activeSubItem, setActiveSubItem] = React.useState<string>("");

  const handleSubItemClick = (label: string) => {
    onItemClick(label, parentLabel);
    setActiveSubItem(label);
  };

  return (
    <Collapse
      in={isExpanded}
      timeout={700}
      easing={{
        enter: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        exit: 'cubic-bezier(0.34, 0.01, 0.64, 1)'
      }}
      sx={{
        transition: 'all 700ms cubic-bezier(0.34, 1.56, 0.64, 1) !important',
        '& .MuiCollapse-wrapper': {
          transitionProperty: 'height, opacity, transform',
          transitionDuration: '700ms',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded
            ? 'translateY(0)'
            : 'translateY(-10px)',
        }
      }}
      unmountOnExit
    >
      <List component="div" disablePadding>
        {subItems.map((subItem) => (
          <ListItem
            key={subItem.label}
            sx={{
              pl: 4,
              cursor: "pointer",
              backgroundColor:
                activeSubItem === subItem.label ? "#34D399" : "#ccd9ff",
              "&:hover": { backgroundColor: "#ebf2ff" },
            }}
            onClick={() => handleSubItemClick(subItem.label)}
          >
            <ListItemIcon sx={{
              minWidth: '30px',
              color: "#173A79"
            }}>
              <FiberManualRecordIcon sx={{ fontSize: '8px' }} />
            </ListItemIcon>
            <ListItemText
              primary={subItem.label}
              sx={{ color: "#000" }}
            />
            {activeSubItem === subItem.label && (
              <ChevronRight sx={{ color: textColor }} />
            )}
          </ListItem>
        ))}
      </List>
    </Collapse>
  );
};

export default SubItems;
