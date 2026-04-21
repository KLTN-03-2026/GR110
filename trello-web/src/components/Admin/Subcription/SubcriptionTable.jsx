import {
  Chip,
  IconButton,
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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { FeatureCell } from '../Plan/FeatureCell'
import ConfirmDeleteModal from '../ModalDelete/ConfirmDeleteModal'

function getStatusChipStyle(status) {
  const statusMap = {
    pending: {
      label: 'Pending',
      color: '#b45309',
      backgroundColor: '#fffbeb',
      borderColor: '#fcd34d'
    },
    trialing: {
      label: 'Trialing',
      color: '#2563eb',
      backgroundColor: '#eff6ff',
      borderColor: '#bfdbfe'
    },
    active: {
      label: 'Active',
      color: '#16a34a',
      backgroundColor: '#f0fdf4',
      borderColor: '#bbf7d0'
    },
    past_due: {
      label: 'Past Due',
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca'
    },
    canceled: {
      label: 'Canceled',
      color: '#6b7280',
      backgroundColor: '#f9fafb',
      borderColor: '#d1d5db'
    },
    expired: {
      label: 'Expired',
      color: '#7c3aed',
      backgroundColor: '#f5f3ff',
      borderColor: '#ddd6fe'
    }
  }

  return (
    statusMap[status] || {
      label: 'Unknown',
      color: '#6b7280',
      backgroundColor: '#f3f4f6',
      borderColor: '#d1d5db'
    }
  )
}

function truncateText(value, maxLength = 50) {
  if (!value) return '-'
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}

function canCancelSubscription(status) {
  return ['pending', 'trialing', 'active'].includes(status)
}

export default function SubscriptionTable({
  subscriptions,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  formatDateTime,
  handleCancelSubscription,
  cancelModalOpen,
  selectedSubscription,
  setSelectedSubscription,
  handleCloseCancelModal,
  handleOpenCancelModal,
}) {

  const handleConfirmCancel = async () => {
    if (!selectedSubscription?._id) return

    await handleCancelSubscription({
      subscriptionId: selectedSubscription._id,
      subscriptionData: {
        ...selectedSubscription,
        status: 'canceled',
        canceledAt: new Date().toISOString()
      }
    })

    handleCloseCancelModal()
  }

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
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Workspace</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Plan</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                Plan Feature Snapshot
              </TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Status</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Start At</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>End At</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Cancel At</TableCell>
              <TableCell sx={{ fontSize: '16px', color: '#111827' }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subscriptions.map((subscription, index) => {
              const statusStyle = getStatusChipStyle(subscription.status)
              const canCancel = canCancelSubscription(subscription.status)

              return (
                <TableRow
                  key={subscription._id}
                  hover
                  sx={{
                    '& .MuiTableCell-root': {
                      borderBottom: '1px solid #e5e7eb'
                    }
                  }}
                >
                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>

                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {subscription.workspaceTitle}
                  </TableCell>

                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {subscription.planTitle}
                  </TableCell>

                  <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                    <FeatureCell
                      feature={subscription.planFeatureSnapshot}
                      truncateText={truncateText}
                    />
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

                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {formatDateTime(subscription.startedAt) || '-'}
                  </TableCell>

                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {formatDateTime(subscription.endedAt) || '-'}
                  </TableCell>

                  <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
                    {formatDateTime(subscription.canceledAt) || 'ok'}
                  </TableCell>

                  <TableCell>
                    <Stack direction='row' spacing={0.5}>
                      <Tooltip title='Edit subscription'>
                        <IconButton
                          size='small'
                          onClick={() => onEdit(subscription)}
                          sx={{
                            color: '#374151',
                            '&:hover': { backgroundColor: '#f3f4f6' }
                          }}
                        >
                          <EditOutlinedIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title={
                          canCancel
                            ? 'Cancel subscription'
                            : 'This subscription cannot be canceled'
                        }
                      >
                        <span>
                          <IconButton
                            size='small'
                            disabled={!canCancel}
                            onClick={() =>
                              handleOpenCancelModal(subscription)
                            }
                            sx={{
                              color: canCancel ? '#ef4444' : '#9ca3af',
                              '&:hover': {
                                backgroundColor: canCancel ? '#fef2f2' : 'transparent'
                              }
                            }}
                          >
                            <CancelOutlinedIcon fontSize='small' />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
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
          Showing subscription per page
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
        <ConfirmDeleteModal
          open={cancelModalOpen}
          title='Cancel Subscription'
          description={
            selectedSubscription
              ? `Are you sure you want to cancel subscription of workspace "${selectedSubscription.workspaceTitle}"?`
              : 'Are you sure you want to cancel this subscription?'
          }
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancel}
        />
      </Stack>
    </Paper>
  )
}