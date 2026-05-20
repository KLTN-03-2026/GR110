import { useColorScheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  const modeMap = {
    light: {
      icon: (
        <LightModeIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.92)' }} />
      ),
      label: 'Light'
    },
    dark: {
      icon: (
        <DarkModeOutlinedIcon
          sx={{ fontSize: 18, color: 'rgba(255,255,255,0.92)' }}
        />
      ),
      label: 'Dark'
    },
    system: {
      icon: (
        <SettingsBrightnessIcon
          sx={{ fontSize: 18, color: 'rgba(255,255,255,0.92)' }}
        />
      ),
      label: 'System'
    }
  }

  const currentMode = modeMap[mode] || modeMap.system

  return (
    <FormControl size="small" sx={{ minWidth: 132 }}>
      <Select
        id="select-dark-light-mode"
        value={mode}
        onChange={handleChange}
        IconComponent={KeyboardArrowDownRoundedIcon}
        renderValue={() => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            {currentMode.icon}
            <Typography
              sx={{ fontSize: '0.9rem', color: 'white', lineHeight: 1 }}
            >
              {currentMode.label}
            </Typography>
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 0.8,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 14px 30px rgba(15, 23, 42, 0.16)',
              overflow: 'hidden'
            }
          }
        }}
        sx={{
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.10)',
          height: 38,
          transition: 'all .2s ease',
          '& .MuiSelect-select': {
            py: 0.8,
            pr: 4,
            display: 'flex',
            alignItems: 'center'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.45)'
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.14)' },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.75)'
          },
          '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.17)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
            borderWidth: 1
          },
          '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.92)' }
        }}
      >
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize="small" /> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeOutlinedIcon fontSize="small" /> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize="small" /> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ModeSelect
