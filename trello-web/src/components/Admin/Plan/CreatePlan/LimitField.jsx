import { Box, TextField, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';

export function LimitField({ control, name, label, sectionTitleSx, inputSx }) {
  return (
    <Box>
      <Typography sx={sectionTitleSx}>{label}</Typography>
      <Controller
        name={name}
        control={control}
        rules={{
          required: `${label} is required`,
          min: {
            value: 0,
            message: `${label} must be greater than or equal to 0`
          }
        }}
        render={({ field, fieldState }) => (
          <>
            <TextField
              {...field}
              fullWidth
              type='number'
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value))}
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