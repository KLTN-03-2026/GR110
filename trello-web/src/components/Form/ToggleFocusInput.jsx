import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

function ToggleFocusInput({
  value,
  onChangedValue,
  inputFontSize = '16px',
  color,
  truncateOnDisplay = false,
  fontWeight = 'bold',
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  const triggerBlur = () => {
    const trimmedValue = (inputValue || '').trim()
    const originalValue = (value || '').trim()

    setIsEditing(false)

    if (!trimmedValue) {
      setInputValue(value || '')
      return
    }

    setInputValue(trimmedValue)

    if (trimmedValue === originalValue) return

    onChangedValue?.(trimmedValue)
  }

  const displayValue = truncateOnDisplay
    ? truncateText(value || '', 20)
    : value || ''

  if (!isEditing) {
    return (
      <Box
        onClick={() => setIsEditing(true)}
        sx={{
          width: '100%',
          minHeight: '36px',
          display: 'flex',
          alignItems: 'center',
          px: '6px',
          py: '8px',
          borderRadius: 1,
          cursor: 'text'
        }}
        {...props}
      >
        <Typography
          sx={{
            fontSize: inputFontSize,
            fontWeight,
            color: color || 'text.primary',
            lineHeight: 1.2,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            width: '100%'
          }}
        >
          {displayValue}
        </Typography>
      </Box>
    )
  }

  return (
    <TextField
      fullWidth
      autoFocus
      variant='outlined'
      size='small'
      multiline={false}
      minRows={1}
      maxRows={4}
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      onBlur={triggerBlur} // Thoát khỏi chế đọ edit thì un function
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          event.currentTarget.blur()
        }
        if (event.key === 'Escape') {
          setInputValue(value || '')
          setIsEditing(false)
        }
      }}
      {...props}
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          minHeight: 36,
          px: 0.5,
          py: 0,
          alignItems: 'center',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#33485D' : '#ffffff',
          '& fieldset': {
            borderColor: 'primary.main'
          }
        },
        '& .MuiOutlinedInput-input': {
          fontSize: inputFontSize,
          fontWeight,
          lineHeight: 1.2,
          padding: '6px 2px',
          color: color || 'text.primary'
        },
        '& .MuiOutlinedInput-inputMultiline': {
          fontSize: inputFontSize,
          fontWeight,
          lineHeight: 1.2,
          padding: '6px 2px',
          color: color || 'text.primary'
        }
      }}
    />
  )
}

export default ToggleFocusInput