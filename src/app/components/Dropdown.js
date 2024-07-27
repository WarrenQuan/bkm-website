"use client"; // This directive ensures this component is client-side
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({ colorOptions, onOptionChange }) {
  const [color, setColor] = React.useState(colorOptions[0]?.value || "#03a9f4");

  const handleChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor);
    
    // Find the label of the selected color
    const selectedOption = colorOptions.find(option => option.value === newColor);
    if (selectedOption) {
      onOptionChange(selectedOption.label); // Call the callback with the selected label
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <Box
        backgroundColor={color}
        sx={{ minWidth: 120, borderRadius: '30px' }}
        size="large"
        className="font-bold"
      >
        <FormControl fullWidth>
          <Select
            sx={{
              borderRadius: '30px',
              fontSize: '3rem',
              color: "white",
              padding: "5px 5px 5px 5px",
              margin: "2px",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);",
            }}
            MenuProps={{
              sx: {
                // "&& .Mui-selected": {
                //   backgroundColor: color,
                // },
                fontSize: '5vw',
              },
            }}
            className="font-bold"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={color}
            onChange={handleChange}
            style={{ textAlign: 'center' }}
          >
            {colorOptions.map((option) => (
              <MenuItem
                key={option.value}
                className="font-bold"
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
