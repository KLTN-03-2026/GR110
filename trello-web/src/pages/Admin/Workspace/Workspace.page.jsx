import React from 'react'
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
import WorkspaceTable from '~/components/Admin/Workspace/WorkspaceTable'
import useAdminWorkspacePage from '~/hooks/adminWorkspace.hook'

export default function WorkspacePage() {
  const {
    workspaces,
    loading,
    totalCount,
    search,
    page,
    rowsPerPage,
    handleSearchChange,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useAdminWorkspacePage()

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
            Workspace
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '22px',
              color: '#374151'
            }}
          >
            Manage your workspace collection
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ mb: 2 }}
      >
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder='Search workspaces...'
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

      </Stack>

      <WorkspaceTable
        workspaces={workspaces}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        loading={loading}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    </Box>
  )
}