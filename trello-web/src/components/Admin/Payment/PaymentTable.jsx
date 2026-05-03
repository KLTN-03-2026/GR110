import { useState } from 'react'
import {
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { formatPrice } from '~/helpers/formatPrice'


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
  onRowsPerPageChange,
  onFetchTransactionDetail
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const handleOpenDetail = async (payment) => {
    setSelectedPayment(payment || null)
    setIsDetailOpen(true)

    if (!onFetchTransactionDetail || !payment?._id) return

    try {
      setIsDetailLoading(true)
      const transactionDetail = await onFetchTransactionDetail(payment._id)

      if (transactionDetail) {
        setSelectedPayment((prev) => ({
          ...prev,
          ...transactionDetail
        }))
      }
    } finally {
      setIsDetailLoading(false)
    }
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedPayment(null)
    setIsDetailLoading(false)
  }

  const transactionDetailRows = [
    { label: 'Gateway', value: selectedPayment?.gateway },
    {
      label: 'Provider Transaction ID',
      value: selectedPayment?.providerTransactionId
    },
    { label: 'Internal Transaction Record ID', value: selectedPayment?.transactionId },
    { label: 'Status', value: selectedPayment?.status },
    { label: 'Transaction Date', value: formatDateTime(selectedPayment?.transactionDate) },
    { label: 'Account Number', value: selectedPayment?.accountNumber },
    { label: 'Sub Account', value: selectedPayment?.subAccount },
    { label: 'Code', value: selectedPayment?.code },
    { label: 'Content', value: selectedPayment?.content },
    { label: 'Transfer Type', value: selectedPayment?.transferType },
    { label: 'Description', value: selectedPayment?.description },
    {
      label: 'Transfer Amount',
      value:
        selectedPayment?.transferAmount != null
          ? formatPrice(selectedPayment.transferAmount)
          : formatPrice(selectedPayment?.amount || 0)
    },
    { label: 'Reference Code', value: selectedPayment?.referenceCode },
    { label: 'Accumulated', value: selectedPayment?.accumulated },
    { label: 'Paid At', value: formatDateTime(selectedPayment?.paidAt) },
    { label: 'Failed At', value: formatDateTime(selectedPayment?.failedAt) }
  ]

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
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Actions
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
                      <span title={payment.providerTransactionId || '-'}>
                        {payment.providerTransactionId}
                      </span>
                    </TableCell>

                    <TableCell sx={{ fontSize: '15px', color: '#1f2937', fontWeight: 600 }}>
                      {formatPrice(payment.amount)}
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

                    <TableCell>
                      <Button
                        size='small'
                        variant='outlined'
                        onClick={() => handleOpenDetail(payment)}
                        sx={{
                          textTransform: 'none',
                          borderColor: '#d1d5db',
                          color: '#111827',
                          '&:hover': {
                            borderColor: '#9ca3af',
                            backgroundColor: '#f9fafb'
                          }
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={11} align='center' sx={{ py: 4 }}>
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

      <Dialog
        open={isDetailOpen}
        onClose={handleCloseDetail}
        fullWidth
        maxWidth='sm'
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            color: '#111827',
            border: '1px solid #e5e7eb'
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            backgroundColor: '#ffffff',
            color: '#111827',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          Transaction Details
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            backgroundColor: '#ffffff',
            color: '#111827',
            borderTop: 'none',
            borderBottom: 'none'
          }}
        >
          <Stack spacing={1.25}>
            {transactionDetailRows.map((row) => (
              <Stack
                key={row.label}
                direction='row'
                justifyContent='space-between'
                alignItems='flex-start'
                sx={{
                  py: 0.75,
                  borderBottom: '1px dashed #e5e7eb',
                  '&:last-of-type': { borderBottom: 'none' }
                }}
              >
                <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
                  {row.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#111827',
                    fontWeight: 500,
                    textAlign: 'right',
                    maxWidth: '58%',
                    wordBreak: 'break-word'
                  }}
                >
                  {row.value ?? '-'}
                </Typography>
              </Stack>
            ))}
          </Stack>
          {isDetailLoading && (
            <Stack alignItems='center' sx={{ py: 2 }}>
              <CircularProgress size={24} sx={{ color: '#111827' }} />
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  )
}
