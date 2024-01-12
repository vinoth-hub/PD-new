import React from "react";
import TextField from "@mui/material/TextField";

export function CustomTextField(props) {
  const {
    type,
    name,
    onChange,
    formik,
    value,
    variant,
    onBlur,
    label,
    disabled,
    style,
    isViewMode,
    maxLength,
    fullWidth,
    fieldType,
    autoComplete,
    onkeydown,
    error,
    helpertext,
    placeholder,
    endAdornment,
    size,
    sx,
  } = props;

  const handleKeyPress = (e) => {
    if (fieldType === "mobile" && e.keyCode !== 13) {
      return !/[0-9+-]/.test(e.key) && e.preventDefault();
    }
    if (fieldType === "alphaNumeric") {
      return !/[0-9A-Za-z-/:_]/.test(e.key) && e.preventDefault();
    }
    if (type === "number" && e.keyCode !== 13) {
      return !/[0-9]/.test(e.key) && e.preventDefault();
    }
    if (fieldType === "decimal") {
      return !/[0-9.]/.test(e.key) && e.preventDefault();
    }
  };
  return (
    <>
      <TextField
        id="standard-basic"
        label={label}
        size={size || "small"}
        placeholder={placeholder}
        variant={variant ? variant : "outlined"}
        type={"text"}
        name={name}
        fullWidth={fullWidth || true}
        autoComplete={autoComplete}
        onChange={onChange}
        onBlur={onBlur}
        value={value || ""}
        endAdornment={endAdornment}
        style={style}
        sx={sx}
        error={error || (formik?.touched?.[name] && formik?.errors?.[name])}
        helperText={
          error ||
          helpertext ||
          (formik?.touched?.[name] && formik?.errors?.[name]
            ? formik?.errors?.[name]
            : "")
        }
        InputProps={{
          endAdornment: endAdornment,
          onKeyPress: (e) => handleKeyPress(e),
          onKeyDown: (e) => onkeydown && onkeydown(e),
          readOnly: isViewMode,
          disabled: disabled,
        }}
        onInput={(e) => {
          e.target.value &&
            maxLength &&
            (e.target.value = e.target.value.toString().slice(0, maxLength));
        }}
      />
    </>
  );
}
