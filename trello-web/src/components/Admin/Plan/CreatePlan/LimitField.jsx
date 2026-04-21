import { Box, TextField, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'

export function LimitField({ control, name, label, sectionTitleSx, inputSx }) {
  return (
    <Box>
      <Typography sx={sectionTitleSx}>{label}</Typography>
      <Controller
        name={name}
        control={control}
        rules={{
          required: `${label} is required`,
          validate: (value) => {
            if (value === '' || value === null || value === undefined) {
              return `${label} is required`
            }

            if (!/^\d+$/.test(value)) {
              return `${label} must be a valid non-negative number`
            }

            if (Number(value) < 0) {
              return `${label} must be greater than or equal to 0`
            }

            return true
          }
        }}
        render={({ field, fieldState }) => (
          <>
            <TextField
              {...field}
              fullWidth
              type='text'
              value={field.value ?? ''}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*$/.test(value)) {
                  field.onChange(value)
                }
              }}
              error={!!fieldState.error}
              sx={inputSx}
            />
            {fieldState.error && (
              <Typography sx={{ mt: 0.5, fontSize: '12px', color: '#d32f2f' }}>
                {fieldState.error.message}
              </Typography>
            )}
          </>
        )}
      />
    </Box>
  )
}