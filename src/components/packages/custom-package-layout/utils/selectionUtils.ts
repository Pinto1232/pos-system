export const toggleItemSelection = <T extends { id: number }>(
  item: T,
  selectedItems: T[]
): T[] => {
  const isSelected = selectedItems.some((i) => i.id === item.id);

  if (isSelected) {
    return selectedItems.filter((i) => i.id !== item.id);
  } else {
    return [...selectedItems, item];
  }
};

export const isItemSelected = <T extends { id: number }>(
  item: T,
  selectedItems: T[]
): boolean => {
  return selectedItems.some((i) => i.id === item.id);
};

export const updateUsageQuantity = (
  id: number,
  value: string,
  currentQuantities: Record<number, number>
): Record<number, number> => {
  const newValue = Math.max(0, parseInt(value) || 0);

  return {
    ...currentQuantities,
    [id]: newValue,
  };
};

export const isAnyCheckboxSelected = (
  checkboxStates: Record<string, boolean>
): boolean => {
  return Object.values(checkboxStates).some((value) => value === true);
};

export const toggleCheckboxWithReset = (
  id: string,
  currentStates: Record<string, boolean>
): Record<string, boolean> => {
  const resetState = Object.keys(currentStates).reduce(
    (acc, key) => {
      acc[key] = false;
      return acc;
    },
    {} as Record<string, boolean>
  );

  return {
    ...resetState,
    [id]: !currentStates[id],
  };
};
