import { useState } from 'react'
import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import PaymentTable from '~/components/Admin/Payment/PaymentTable'
import useAdminPayment from '~/hooks/adminPayment.hook'

export default function PaymentPage() {
  const {
    payments,
    totalCount,
    search,
    gateway,
    page,
    rowsPerPage,
    handleSearchChange,
    handleChangeGateway,
    handleChangePage,
    handleChangeRowsPerPage
  } = useAdminPayment()

  const [anchorEl, setAnchorEl] = useState(null)
  const openFilter = Boolean(anchorEl)

  const GATEWAY_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'sepay', label: 'Sepay' }
  ]

  const handleOpenFilter = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseFilter = () => {
    setAnchorEl(null)
  }

  const handleSelectGateway = (value) => {
    handleChangeGateway(value)
    handleCloseFilter()
  }

  const selectedGatewayLabel =
    GATEWAY_OPTIONS.find((item) => item.value === gateway)?.label || 'All'

  return (
    <Box>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '40px',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.2
            }}
          >
            Payment
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '22px',
              color: '#374151'
            }}
          >
            View payment list
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        flexWrap='wrap'
        useFlexGap
        sx={{ mb: 2, gap: 1.5 }}
      >
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder='Search payments...'
          size='small'
          sx={{
            width: 280,
            '& .MuiOutlinedInput-root': {
              height: 38,
              borderRadius: '8px',
              backgroundColor: '#fff',
              color: 'black'
            },
            '& .MuiInputBase-input': {
              fontSize: '15px'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
              </InputAdornment>
            )
          }}
        />

        <Button
          variant='outlined'
          startIcon={<FilterListOutlinedIcon />}
          onClick={handleOpenFilter}
          sx={{
            textTransform: 'none',
            color: '#374151',
            borderColor: '#d1d5db',
            backgroundColor: '#fff',
            borderRadius: '8px',
            px: 2,
            minWidth: 'auto',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb'
            }
          }}
        >
          Gateway: {selectedGatewayLabel}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={openFilter}
          onClose={handleCloseFilter}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 180,
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 30px rgba(15,23,42,0.08)'
            }
          }}
        >
          {GATEWAY_OPTIONS.map((item) => (
            <MenuItem
              key={item.value}
              selected={gateway === item.value}
              onClick={() => handleSelectGateway(item.value)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      <PaymentTable
        payments={payments}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}