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
import ConfirmDeleteModal from '~/components/Admin/ModalDelete/ConfirmDeleteModal'
import BackgroundTable from '~/components/Admin/Background/BackgroundTable'
import { useAdminBackground } from '~/hooks/adminBackground.hook'

export default function BackgroundPage() {
  const {
    search,
    entity,
    page,
    rowsPerPage,
    backgrounds,
    totalCount,
    deleteModalOpen,
    selectedBackground,
    handleSearchChange,
    handleChangeEntity,
    handleChangePage,
    handleChangeRowsPerPage,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleEditBackground,
    handleCreateBackground,
    handleUpdateBlockBackground,
  } = useAdminBackground()

  const [anchorEl, setAnchorEl] = useState(null)
  const openFilter = Boolean(anchorEl)

  const ENTITY_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'board', label: 'Board' },
    { value: 'card', label: 'Card' }
  ]

  const handleOpenFilter = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseFilter = () => {
    setAnchorEl(null)
  }

  const handleSelectEntity = (value) => {
    handleChangeEntity(value)
    handleCloseFilter()
  }

  const selectedEntityLabel =
    ENTITY_OPTIONS.find((item) => item.value === entity)?.label || 'All'

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
            Background
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '22px',
              color: '#374151'
            }}
          >
            Manage your background collection
          </Typography>
        </Box>

        <Button
          variant='contained'
          onClick={handleCreateBackground}
          sx={{
            textTransform: 'none',
            px: 3,
            py: 1.2,
            fontSize: '18px',
            fontWeight: 500,
            borderRadius: '8px',
            color: '#ffffff',
            backgroundColor: '#ea6b3d',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#dc5f31',
              boxShadow: 'none'
            }
          }}
        >
          Add Background
        </Button>
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
          placeholder='Search backgrounds...'
          size='small'
          sx={{
            width: 250,
            '& .MuiOutlinedInput-root': {
              height: 38,
              borderRadius: '8px',
              backgroundColor: '#fff'
            },
            '& .MuiInputBase-input': {
              fontSize: '15px',
              color: '#111827'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: '#000000', fontSize: 20 }} />
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
          Entity: {selectedEntityLabel}
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
          {ENTITY_OPTIONS.map((item) => (
            <MenuItem
              key={item.value}
              selected={entity === item.value}
              onClick={() => handleSelectEntity(item.value)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      <BackgroundTable
        backgrounds={backgrounds}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onEdit={handleEditBackground}
        onDelete={handleOpenDeleteModal}
        onUpdateBlock={handleUpdateBlockBackground}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        title='Delete Background'
        description={
          selectedBackground
            ? `Are you sure you want to delete background "${selectedBackground.title}"?`
            : 'Are you sure you want to delete this background?'
        }
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}