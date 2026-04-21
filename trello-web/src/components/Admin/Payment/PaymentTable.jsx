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

function formatCurrency(value) {
  if (value === null || value === undefined) return '0 ₫'

  return Number(value).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}

function formatDateTime(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString('vi-VN')
}

function truncateText(value, maxLength = 24) {
  if (!value) return '-'
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}

function getStatusChipStyle(status) {
  const statusMap = {
    pending: {
      label: 'Pending',
      color: '#b45309',
      backgroundColor: '#fffbeb',
      borderColor: '#fcd34d'
    },
    paid: {
      label: 'Paid',
      color: '#16a34a',
      backgroundColor: '#f0fdf4',
      borderColor: '#bbf7d0'
    },
    failed: {
      label: 'Failed',
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca'
    },
    refunded: {
      label: 'Refunded',
      color: '#2563eb',
      backgroundColor: '#eff6ff',
      borderColor: '#bfdbfe'
    },
    canceled: {
      label: 'Canceled',
      color: '#6b7280',
      backgroundColor: '#f9fafb',
      borderColor: '#d1d5db'
    }
  }

  return (
    statusMap[status] || {
      label: status || 'Unknown',
      color: '#6b7280',
      backgroundColor: '#f3f4f6',
      borderColor: '#d1d5db'
    }
  )
}

export default function PaymentTable({
  payments,
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
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>No.</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Workspace Title
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Plan Title
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Gateway
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Provider Transaction ID
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Amount
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Status
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Paid At
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Failed At
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.length > 0 ? (
              payments.map((payment, index) => {
                const statusStyle = getStatusChipStyle(payment.status)

                return (
                  <TableRow
                    key={payment._id}
                    hover
                    sx={{
                      '& .MuiTableCell-root': {
                        borderBottom: '1px solid #e5e7eb'
                      }
                    }}
                  >
                    <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                      {payment.workspaceTitle || '-'}
                    </TableCell>

                    <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                      {payment.planTitle || '-'}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: '15px',
                        color: '#1f2937',
                        textTransform: 'capitalize'
                      }}
                    >
                      {payment.gateway || '-'}
                    </TableCell>

                    <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                      {truncateText(payment.providerTransactionId, 24)}
                    </TableCell>

                    <TableCell sx={{ fontSize: '15px', color: '#1f2937', fontWeight: 600 }}>
                      {formatCurrency(payment.amount)}
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

                    <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                      {formatDateTime(payment.paidAt)}
                    </TableCell>

                    <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                      {formatDateTime(payment.failedAt)}
                    </TableCell>

                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} align='center' sx={{ py: 4 }}>
                  <Typography sx={{ fontSize: '15px', color: '#6b7280' }}>
                    No payment history found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
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
          Showing payment per page
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