import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TablePagination,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import ConfirmDeleteModal from '~/components/Admin/ModalDelete/ConfirmDeleteModal'
import PlanTable from '~/components/Admin/Plan/PlanTable'
import { useAdminPlan } from '~/hooks/adminPlan.hook'

export default function PlanPage() {
  const {
    search,
    page,
    rowsPerPage,
    deleteModalOpen,
    selectedPlan,
    plans,
    totalCount,
    loading,

    handleSearchChange,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleChangePage,
    handleChangeRowsPerPage,
    handleEditPlan,
    handleCreatePlan,
    handleUpdateBlockPlan
  } = useAdminPlan()

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
            Plan
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '22px',
              color: '#374151'
            }}
          >
            Manage your plan collection
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleCreatePlan}
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
          Add Plan
        </Button>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder="Search plans..."
          size="small"
          sx={{
            '& .MuiInputLabel-root': {
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

      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#fff'
        }}
      >
        <PlanTable
          plans={plans}
          page={page}
          rowsPerPage={rowsPerPage}
          onEdit={handleEditPlan}
          onDelete={handleOpenDeleteModal}
          onBlock={handleUpdateBlockPlan}
          deleteModalOpen={deleteModalOpen}
          selectedPlan={selectedPlan}
          onCloseDeleteModal={handleCloseDeleteModal}
          onConfirmDelete={handleConfirmDelete}
          deleteLoading={loading}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: 1,
            py: 1,
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#fff'
          }}
        >
          <Typography sx={{ pl: 1, fontSize: '15px', color: '#111827' }}>
            Showing plan per page
          </Typography>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 8, 10]}
            labelRowsPerPage=""
            sx={{
              '.MuiTablePagination-toolbar': {
                minHeight: 40,
                paddingLeft: 0
              },
              '.MuiTablePagination-selectLabel': {
                display: 'none'
              }
            }}
          />
        </Stack>
      </Paper>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        title="Delete Plan"
        description={
          selectedPlan
            ? `Are you sure you want to delete plan "${selectedPlan.title}"?`
            : 'Are you sure you want to delete this plan?'
        }
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}
