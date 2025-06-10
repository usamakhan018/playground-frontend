import { useTheme } from '@/contexts/ThemeProvider';
import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'hsl(var(--background))',
    borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--input))',
    borderRadius: 'var(--radius)',
    boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
    '&:hover': {
      borderColor: 'hsl(var(--input))',
    },
    transition: 'border-color 0.2s ease-in-out',
    cursor: 'pointer',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'hsl(var(--accent))'
      : state.isFocused
      ? 'hsl(var(--accent) / 0.1)'
      : 'transparent',
    color: state.isSelected
      ? 'hsl(var(--accent-foreground))'
      : 'hsl(var(--foreground))',
    '&:active': {
      backgroundColor: 'hsl(var(--accent) / 0.1)',
      
    },
    // padding: '8px',
    '&:hover': {
      backgroundColor: 'hsl(var(--accent) )',
      cursor: 'pointer',
    }
  }),
  input: (provided) => ({
    ...provided,
    color: 'hsl(var(--foreground))',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'hsl(var(--background))',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    border: '1px solid hsl(var(--border))',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'hsl(var(--foreground))',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'hsl(var(--muted-foreground))',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
    '&:hover': {
      color: 'hsl(var(--foreground))',
      
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: 'hsl(var(--muted-foreground))',
    cursor: 'pointer', 
    '&:hover': {
      color: 'hsl(var(--foreground))',
    },
  }),
  
};

const customTheme = (theme) => ({
  ...theme,
  borderRadius: 'var(--radius)',
  
  colors: {
    ...theme.colors,
    primary: 'hsl(var(--primary))',
    primary25: 'hsl(var(--accent) / 0.1)',
    neutral0: 'hsl(var(--background))',
    neutral5: 'hsl(var(--accent) / 0.05)',
    neutral10: 'hsl(var(--accent) / 0.1)',
    neutral20: 'hsl(var(--input))',
    neutral30: 'hsl(var(--input))',
    neutral40: 'hsl(var(--muted-foreground))',
    neutral50: 'hsl(var(--muted-foreground))',
    neutral60: 'hsl(var(--muted-foreground))',
    neutral70: 'hsl(var(--foreground))',
    neutral80: 'hsl(var(--foreground))',
    neutral90: 'hsl(var(--foreground))',
  },
});

const ShadcnSelect = (props) => {
  const { theme, systemTheme } = useTheme();

  // Determine if dark mode is active
  const isDarkMode = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';

  return (
    <Select
      {...props}
      styles={customStyles}
      theme={(baseTheme) => customTheme(baseTheme)}
      className={`${isDarkMode ? 'dark' : ''} react-select-container`}
      classNamePrefix="react-select"
    />
  );
};

export default ShadcnSelect;