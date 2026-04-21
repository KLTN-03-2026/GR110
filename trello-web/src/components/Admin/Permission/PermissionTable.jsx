import React from 'react'
import {
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

function truncateText(value, maxLength = 80) {
  if (!value) return '-'
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}

function getStatusChipStyle(status) {
  return status === 'board'
    ? {
      label: 'Board',
      color: '#16a34a',
      backgroundColor: '#f0fdf4',
      borderColor: '#bbf7d0'
    }
    : {
      label: 'Workspace',
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca'
    }
}

export default function PermissionTable({
  permissions,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange
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
              <TableCell sx={{ fontSize: '16px', color: '#111827', width: 70 }}>
                #
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Permission Name
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Description
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Type
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {permissions.map((permission, index) => {
              const statusStyle = getStatusChipStyle(permission.type)

              return (
                <TableRow
                  key={permission._id}
                  hover
                  sx={{
                    '& .MuiTableCell-root': {
                      borderBottom: '1px solid #e5e7eb'
                    }
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: '15px',
                      color: '#1f2937',
                      fontWeight: 500
                    }}
                  >
                    {index + 1}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: '15px',
                      color: '#1f2937',
                      fontWeight: 500
                    }}
                  >
                    {permission.permissionCode}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: '15px',
                      color: '#1f2937'
                    }}
                  >
                    {truncateText(permission.description, 100)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusStyle.label}
                      size="small"
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
        sx={{
          px: 1,
          py: 1,
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#fff'
        }}
      >
        <Typography sx={{ pl: 1, fontSize: '15px', color: '#111827' }}>
          Showing permission per page
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