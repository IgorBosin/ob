import { forwardRef } from 'react'

import {
  FilledTextFieldProps,
  InputAdornment,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
} from '@mui/material'

type Props = {
  bold?: string
  marginBottom?: string
  // margin?: string,
  marginLeft?: string
  marginRight?: string
  marginTop?: string
  max?: number
  min?: number
  step?: number
  suffix?: string
}

const Input = forwardRef<
  HTMLDivElement,
  (FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps) & Props
>(function Input(props, ref) {
  const primaryTextColor = 'black'
  const secondaryTextColor = '#999'

  const styles = {
    '& .MuiFormHelperText-root.Mui-error': {
      '&.MuiFormHelperText-contained': {
        marginLeft: 0, // marginLeft у ошибки
      },
    },
    '& .MuiFormLabel-root': {
      '&.MuiInputLabel-root': {
        '&.Mui-focused': {
          color: primaryTextColor,
        },
      },
      color: secondaryTextColor, // цвет placeholder(label)
    },
    '& .MuiInputBase-root': {
      '& input': {
        '&:-webkit-autofill': {
          transitionDelay: '9999s', // убрать фон при автозаполнении формы
          transitionProperty: 'background-color, color',
        },
      },
      color: primaryTextColor, // цвет текста
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: secondaryTextColor, // Цвет рамки в неактивном состоянии
      },
      '&.Mui-focused fieldset': {
        borderColor: primaryTextColor, // Цвет рамки в фокусе
      },
      '&:hover fieldset': {
        borderColor: primaryTextColor, // Цвет рамки при наведении
      },
    },
    marginBottom: props.marginBottom,
    // margin: props.margin,
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,
    marginTop: props.marginTop,
  }

  return (
    <TextField
      InputProps={{
        inputProps: {
          max: props.max,
          min: props.min,
          step: props.step,
        },
        startAdornment: (
          <InputAdornment position={'start'} style={{ left: '55px', position: 'absolute' }}>
            {props.suffix}
          </InputAdornment>
        ),
        style: { fontWeight: props.bold },
      }}
      margin={'dense'}
      ref={ref}
      size={'small'}
      sx={styles}
      type={'number'}
      variant={'outlined'}
      {...props}
    />
  )
})

export default Input
