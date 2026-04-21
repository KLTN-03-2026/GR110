import {
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ConfirmDeleteModal from '../ModalDelete/ConfirmDeleteModal'
import { FeatureCell } from './FeatureCell'

function formatCurrency(value) {
  if (value === null || value === undefined) return '0 ₫'

  return Number(value).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}

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

function truncateText(value, maxLength = 50) {
    if (!value) return '-'
    if (value.length <= maxLength) return value
    return `${value.slice(0, maxLength)}...`
}

export default function PlanTable({
  plans,
  page,
  rowsPerPage,
  onEdit,
  onDelete,
  onBlock,
  deleteModalOpen,
  selectedPlan,
  onCloseDeleteModal,
  onConfirmDelete,
  deleteLoading
}) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
            <TableCell sx={{ fontSize: '16px', color: '#111827' }}>#</TableCell>
            <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
              Title
            </TableCell>
            <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
              Feature
            </TableCell>
            <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
              Billing Cycle
            </TableCell>
            <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
              Description
            </TableCell>
            <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
              Original Price
            </TableCell>
            <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
              Current Price
            </TableCell>
            <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
              Status
            </TableCell>
            <TableCell sx={{ fontSize: '16px', color: '#111827' }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {plans.map((plan, index) => {
            const statusStyle = getStatusChipStyle(plan.status)

            return (
              <TableRow
                key={plan._id}
                hover
                sx={{
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid #e5e7eb',
                    verticalAlign: 'top'
                  }
                }}
              >
                <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>

                <TableCell
                  sx={{
                    fontSize: '15px',
                    color: '#1f2937',
                    fontWeight: 500
                  }}
                >
                  {plan.title}
                </TableCell>

                <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                  <FeatureCell feature={plan.feature} truncateText={truncateText} />
                </TableCell>

                <TableCell
                  sx={{
                    fontSize: '15px',
                    color: '#1f2937',
                    textTransform: 'capitalize'
                  }}
                >
                  {plan.billingCycle}
                </TableCell>

                <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                  {truncateText(plan.description, 55)}
                </TableCell>

                <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                  {formatCurrency(plan.originPrice)}
                </TableCell>

                <TableCell sx={{ fontSize: '15px', color: '#1f2937' }}>
                  {formatCurrency(plan.currentPrice)}
                </TableCell>

                <TableCell>
                  <Chip
                    label={statusStyle.label}
                    onClick={() => onBlock(plan)}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      color: statusStyle.color,
                      backgroundColor: statusStyle.backgroundColor,
                      border: `1px solid ${statusStyle.borderColor}`
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(plan)}
                      sx={{
                        color: '#374151',
                        '&:hover': { backgroundColor: '#f3f4f6' }
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => onDelete(plan)}
                      sx={{
                        color: '#ef4444',
                        '&:hover': { backgroundColor: '#fef2f2' }
                      }}
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <ConfirmDeleteModal
        open={deleteModalOpen}
        title="Delete Plan"
        description={
          selectedPlan
            ? `Are you sure you want to delete plan "${selectedPlan.title}"?`
            : 'Are you sure you want to delete this plan?'
        }
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
        loading={deleteLoading}
      />
    </TableContainer>
  )
}
