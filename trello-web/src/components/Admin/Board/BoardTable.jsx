import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material'

function getStatusChipStyle(status) {
  return status === 'active'
    ? {
      label: 'Active',
      color: '#16a34a',
      backgroundColor: '#f0fdf4',
      borderColor: '#bbf7d0'
    }
    : {
      label: 'Inactive',
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca'
    }
}

function truncateText(value, maxLength = 45) {
  if (!value) return '-'
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}

const imageSx = {
  width: 88,
  height: 52,
  borderRadius: '8px',
  objectFit: 'cover',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f3f4f6',
  display: 'block'
}

export default function BoardTable({
  boards,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff'
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>#</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Background</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Workspace</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Title</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Description</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Owner</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Visibility</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Type</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {boards.map((board, index) => {
              const statusStyle = getStatusChipStyle(board.status)

              return (
                <TableRow
                  key={board._id}
                  hover
                  sx={{
                    '& .MuiTableCell-root': {
                      borderBottom: '1px solid #e5e7eb'
                    }
                  }}
                >
                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    <Box component='img' src={board.cover.value} alt={board.title} sx={imageSx} />
                  </TableCell>

                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {board.workspaceName}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 500, fontSize: '16px', color: '#111827' }}>
                    {board.title}
                  </TableCell>

                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {truncateText(board.description, 45)}
                  </TableCell>

                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {board.ownerName}
                  </TableCell>

                  <TableCell
                    sx={{
                      textTransform: 'capitalize',
                      fontSize: '16px',
                      color: '#111827'
                    }}
                  >
                    {board.visibility}
                  </TableCell>

                  <TableCell
                    sx={{
                      textTransform: 'capitalize',
                      fontSize: '16px',
                      color: '#111827'
                    }}
                  >
                    {board.type}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={statusStyle.label}
                      size='small'
                      sx={{
                        fontWeight: 500,
                        color: statusStyle.color,
                        backgroundColor: statusStyle.backgroundColor,
                        border: `1px solid ${statusStyle.borderColor}`
                      }}
                    />
                  </TableCell>

                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ px: 1, py: 1, borderTop: '1px solid #e5e7eb', backgroundColor: '#fff' }}
      >
        <Typography sx={{ pl: 1, fontSize: '15px', color: '#111827' }}>
          Showing board per page
        </Typography>

        <TablePagination
          component='div'
          count={totalCount}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 8, 10]}
          labelRowsPerPage=''
          sx={{
            '.MuiTablePagination-toolbar': {
              minHeight: 40,
              paddingLeft: 0
            },
            '.MuiTablePagination-selectLabel': {
              display: 'none'
            },
            '.MuiTablePagination-displayedRows': {
              color: '#000'
            },
            '.MuiTablePagination-select': {
              color: '#000'
            },
            '.MuiSelect-icon': {
              color: '#000'
            },
            '.MuiIconButton-root': {
              color: '#000'
            },
            '.Mui-disabled': {
              color: '#9ca3af'
            }
          }}
        />
      </Stack>
    </Paper>
  )
}