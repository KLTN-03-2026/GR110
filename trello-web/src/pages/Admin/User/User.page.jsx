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
import { useNavigate } from 'react-router-dom'
import ConfirmDeleteModal from '~/components/Admin/ModalDelete/ConfirmDeleteModal'
import UserTable from '~/components/Admin/User/UserTable'
import { useAdminUser } from '~/hooks/adminUser.hook'

export default function UserPage() {
  const navigate = useNavigate()

  const {
    search,
    role,
    page,
    rowsPerPage,
    deleteModalOpen,
    selectedUser,
    users,
    totalCount,
    handleSearchChange,
    handleChangeRole,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleChangePage,
    handleChangeRowsPerPage,
    handleEditUser,
    handleUpdateBlockUsers
  } = useAdminUser()

  const [anchorEl, setAnchorEl] = useState(null)
  const openFilter = Boolean(anchorEl)

  const ROLE_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'client', label: 'Client' },
    { value: 'admin', label: 'Admin' }
  ]

  const handleOpenFilter = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseFilter = () => {
    setAnchorEl(null)
  }

  const handleSelectRole = (value) => {
    handleChangeRole(value)
    handleCloseFilter()
  }

  const selectedRoleLabel =
    ROLE_OPTIONS.find((item) => item.value === role)?.label || 'All'

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
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
            User
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '22px',
              color: '#374151'
            }}
          >
            Manage your user collection
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate('/admin/user/create')}
          sx={{
            textTransform: 'none',
            px: 3,
            py: 1.2,
            fontSize: '18px',
            fontWeight: 500,
            borderRadius: '8px',
            backgroundColor: '#ea6b3d',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#dc5f31',
              boxShadow: 'none'
            }
          }}
        >
          Add User
        </Button>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 2, gap: 1.5 }}
      >
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder="Search users..."
          size="small"
          sx={{
            '& .InputLabel-root': {
              color: '#6b7280'
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#ea6b3d'
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              color: '#111827',
              '& fieldset': {
                borderColor: '#d1d5db'
              },
              '&:hover fieldset': {
                borderColor: '#9ca3af'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ea6b3d'
              }
            },
            '& .MuiInputBase-input': {
              color: '#111827'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
              </InputAdornment>
            )
          }}
        />

        <Button
          variant="outlined"
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
          Role: {selectedRoleLabel}
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
          {ROLE_OPTIONS.map((item) => (
            <MenuItem
              key={item.value}
              selected={role === item.value}
              onClick={() => handleSelectRole(item.value)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      <UserTable
        users={users}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onEdit={handleEditUser}
        onDelete={handleOpenDeleteModal}
        onUpdateBlock={handleUpdateBlockUsers}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        title="Delete User"
        description={
          selectedUser
            ? `Are you sure you want to delete user "${selectedUser.displayName}"?`
            : 'Are you sure you want to delete this user?'
        }
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}