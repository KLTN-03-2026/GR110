import React, { useState } from 'react'
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
import PermissionTable from '~/components/Admin/Permission/PermissionTable'
import useAdminPermissionPage from '~/hooks/adminPermission.hook'

export default function PermissionPage() {
  const {
    permissions,
    totalCount,
    search,
    type,
    page,
    rowsPerPage,
    handleSearchChange,
    handleChangeType,
    handleChangePage,
    handleChangeRowsPerPage
  } = useAdminPermissionPage()

  const [anchorEl, setAnchorEl] = useState(null)
  const openFilter = Boolean(anchorEl)

  const handleOpenFilter = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseFilter = () => {
    setAnchorEl(null)
  }

  const handleSelectType = (value) => {
    handleChangeType(value)
    handleCloseFilter()
  }

  const getFilterLabel = () => {
    switch (type) {
    case 'workspace':
      return 'Workspace'
    case 'board':
      return 'Board'
    default:
      return 'All'
    }
  }

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
            Permission
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '22px',
              color: '#374151'
            }}
          >
            View permission list
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
          placeholder='Search permissions...'
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
          Filter: {getFilterLabel()}
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
          <MenuItem
            selected={type === 'all'}
            onClick={() => handleSelectType('all')}
          >
            All
          </MenuItem>
          <MenuItem
            selected={type === 'workspace'}
            onClick={() => handleSelectType('workspace')}
          >
            Workspace
          </MenuItem>
          <MenuItem
            selected={type === 'board'}
            onClick={() => handleSelectType('board')}
          >
            Board
          </MenuItem>
        </Menu>
      </Stack>

      <PermissionTable
        permissions={permissions}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}