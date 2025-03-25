export interface SearchBarProps {
    /** Placeholder text inside the search field */
    placeholder?: string;
    /** Callback triggered when the user presses enter or clicks the icon */
    onSearch?: (value: string) => void;
    /** Optional initial value for the search field */
    value?: string;
  }
  