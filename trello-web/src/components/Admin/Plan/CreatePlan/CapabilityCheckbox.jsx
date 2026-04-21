import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller } from 'react-hook-form';

export function CapabilityCheckbox({ control, name, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
        sx={{
          color: 'black'
        }}
          control={
            <Checkbox
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              sx={{
                color: 'black'
              }}
            />
          }
          label={label}
        />
      )}
    />
  )
}