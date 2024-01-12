import { MenuItem, TextField } from "@mui/material";
export const CustomSelectField = (props) => {
  const {
    label,
    variant,
    inputValues,
    name,
    onChange,
    onBlur,
    value,
    className,
    style,
    fieldStyle,
    error,
    isViewMode,
    disabled,
    formik,
    sx,
    accept,
  } = props;

  return (
    <>
      <TextField
        id="outlined-select-currency"
        select
        label={label}
        style={style}
        size="small"
        value={value}
        onChange={onChange}
        name={name}
      >
        {inputValues?.map((option, index) => (
          <MenuItem
            key={index}
            value={
              option?.accessor
                ? option[option?.accessor]
                : option.id || option.value || option?.[accept]
            }
          >
            {option.name || option.label || option?.[accept] || "No data Found"}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};
