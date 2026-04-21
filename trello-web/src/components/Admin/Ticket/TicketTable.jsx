import {
  Button,
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
  Tooltip,
  Typography
} from '@mui/material'

const TICKET_TYPE_MAP = {
  support: 'Support',
  billing: 'Billing',
  bug: 'Bug',
  feedback: 'Feedback'
}

function formatDateTime(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString('en-GB')
}

function truncateText(value, maxLength = 40) {
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
    processing: {
      label: 'Processing',
      color: '#2563eb',
      backgroundColor: '#eff6ff',
      borderColor: '#bfdbfe'
    },
    resolved: {
      label: 'Resolved',
      color: '#16a34a',
      backgroundColor: '#f0fdf4',
      borderColor: '#bbf7d0'
    },
    rejected: {
      label: 'Rejected',
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca'
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

export default function AdminTicketTable({
  tickets,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onReject,
  onReply,
  onViewReply
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
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                #
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Email
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Title
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Type
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Status
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Created At
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => {
                const statusStyle = getStatusChipStyle(ticket.status)
                const hasReply = Boolean(ticket.replyContent)

                return (
                  <TableRow
                    key={ticket._id}
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
                      {ticket.email || '-'}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: '15px',
                        color: '#1f2937',
                        maxWidth: 320
                      }}
                    >
                      <Tooltip title={ticket.content || ''}>
                        <Stack spacing={0.5}>
                          <Typography
                            sx={{ fontSize: '15px', color: '#1f2937' }}
                          >
                            {ticket.title || '-'}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '13px',
                              color: '#6b7280'
                            }}
                          >
                            {truncateText(ticket.content, 56)}
                          </Typography>
                        </Stack>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                      {TICKET_TYPE_MAP[ticket.type] || ticket.type || '-'}
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

                    <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                      {formatDateTime(ticket.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {!hasReply && ticket.status !== 'rejected' && (
                          <>
                            <Button
                              variant="contained"
                              onClick={() => onReply(ticket)}
                              sx={{
                                textTransform: 'none',
                                minWidth: 'auto',
                                px: 2,
                                py: 0.75,
                                borderRadius: '8px',
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': {
                                  boxShadow: 'none'
                                }
                              }}
                            >
                              Reply
                            </Button>

                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => onReject(ticket)}
                              sx={{
                                textTransform: 'none',
                                minWidth: 'auto',
                                px: 2,
                                py: 0.75,
                                borderRadius: '8px',
                                fontWeight: 600
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {hasReply && (
                          <Button
                            variant="outlined"
                            onClick={() => onViewReply(ticket)}
                            sx={{
                              textTransform: 'none',
                              minWidth: 'auto',
                              px: 2,
                              py: 0.75,
                              borderRadius: '8px',
                              fontWeight: 600
                            }}
                          >
                            View reply
                          </Button>
                        )}

                        {ticket.status === 'rejected' && !hasReply && (
                          <Typography
                            sx={{
                              fontSize: '13px',
                              fontWeight: 700,
                              color: '#dc2626',
                              alignSelf: 'center'
                            }}
                          >
                            Rejected
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography
                    sx={{ fontSize: '15px', color: '#6b7280' }}
                  >
                    No tickets found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          Showing tickets per page
        </Typography>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 8, 10]}
          labelRowsPerPage=""
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