import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import BoardTable from '~/components/Admin/Board/BoardTable'
import useAdminBoardPage from '~/hooks/adminBoard.hook'

export default function BoardPages() {
  const {
    boards,
    totalCount,
    search,
    page,
    rowsPerPage,
    getWorkspaceTitle,
    getOwnerName,
    handleSearchChange,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useAdminBoardPage()

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='flex-start' sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: '40px', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
            Board
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: '22px', color: '#374151' }}>
            Manage your board collection
          </Typography>
        </Box>

      </Stack>

      <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder='Search boards...'
          size='small'
          sx={{
            width: 250,
            '& .MuiOutlinedInput-root': {
              height: 38,
              borderRadius: '8px',
              backgroundColor: '#fff'
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

        <Stack direction='row' spacing={1.2}>
          <Button
            variant='outlined'
            startIcon={<FilterListOutlinedIcon />}
            sx={{
              textTransform: 'none',
              color: '#374151',
              borderColor: '#6b7280',
              backgroundColor: '#fff',
              borderRadius: '8px',
              px: 2,
              minWidth: 'auto',
              '&:hover': {
                borderColor: '#4b5563',
                backgroundColor: '#f9fafb'
              }
            }}
          >
            Filter
          </Button>

          <Button
            variant='outlined'
            startIcon={<FileDownloadOutlinedIcon />}
            sx={{
              textTransform: 'none',
              color: '#374151',
              borderColor: '#6b7280',
              backgroundColor: '#fff',
              borderRadius: '8px',
              px: 2,
              minWidth: 'auto',
              '&:hover': {
                borderColor: '#4b5563',
                backgroundColor: '#f9fafb'
              }
            }}
          >
            Excel
          </Button>

          <Button
            variant='outlined'
            startIcon={<PictureAsPdfOutlinedIcon />}
            sx={{
              textTransform: 'none',
              color: '#374151',
              borderColor: '#6b7280',
              backgroundColor: '#fff',
              borderRadius: '8px',
              px: 2,
              minWidth: 'auto',
              '&:hover': {
                borderColor: '#4b5563',
                backgroundColor: '#f9fafb'
              }
            }}
          >
            PDF
          </Button>
        </Stack>
      </Stack>

      <BoardTable
        boards={boards}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        getWorkspaceTitle={getWorkspaceTitle}
        getOwnerName={getOwnerName}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    </Box>
  )
}