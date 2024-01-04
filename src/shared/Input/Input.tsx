import React, {FC, forwardRef} from "react";
import {InputAdornment, TextField} from "@mui/material";
import {TextFieldProps} from "@mui/material/TextField/TextField";

type Props = {
  step?: number
  bold?: string
  suffix?: string
  min?:number
  max?:number
}

const Input: FC<TextFieldProps & Props> = forwardRef(function Input(props,ref) {

  const primaryTextColor = 'black'
  const secondaryTextColor = '#999'

  const styles = {
    marginBottom: '16px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: secondaryTextColor, // Цвет рамки в неактивном состоянии
      },
      '&:hover fieldset': {
        borderColor: primaryTextColor, // Цвет рамки при наведении
      },
      '&.Mui-focused fieldset': {
        borderColor: primaryTextColor, // Цвет рамки в фокусе
      },
    },
    '& .MuiFormLabel-root': {
      color: secondaryTextColor, // цвет placeholder(label)
      '&.MuiInputLabel-root': {
        '&.Mui-focused': {
          color: primaryTextColor
        }
      },
    },
    '& .MuiFormHelperText-root.Mui-error': {
      '&.MuiFormHelperText-contained': {
        marginLeft: 0 // marginLeft у ошибки
      },
    },
    '& .MuiInputBase-root': {
      color: primaryTextColor, // цвет текста
      '& input': {
        '&:-webkit-autofill': {
          transitionDelay: '9999s', // убрать фон при автозаполнении формы
          transitionProperty: 'background-color, color',
        },
      },
    },
  }

  return (
    <TextField
      ref={ref}
      sx={styles}
      size={'small'}
      type={'number'}
      variant={"outlined"}
      margin={"dense"}
      InputProps={{
        inputProps: {
          min: props.min,
          max: props.max,
          step: props.step,
        },
        style: {fontWeight: props.bold},
        startAdornment: <InputAdornment style={{position:'absolute', left:'55px'}} position="start">{props.suffix}</InputAdornment>,
      }}

      {...props}
    />
  );
});

export default Input;
