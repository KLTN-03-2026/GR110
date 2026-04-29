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
                <SearchIcon sx={{ color: 'black', fontSize: 20 }} />
              </InputAdornment>
            )
          }}
        />

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