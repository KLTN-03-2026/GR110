import {
  Avatar,
  Chip,
  MenuItem,
  Paper,
  Select,
  Skeleton,
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
import MemberActionButton from '~/components/Workspace/workspaceMember/MemberActionButton'
import { useSelector } from 'react-redux'
import { useTheme } from '@emotion/react'

function formatDate(dateString) {
  if (!dateString) return '--'

  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function getStatusColor(status) {
  switch (status) {
    case 'active':
      return 'success'
    case 'removed':
      return 'error'
    default:
      return 'default'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'active':
      return 'Active'
    case 'removed':
      return 'Removed'
    default:
      return status || '--'
  }
}

function BoardMemberTable({
  members = [],
  roles = [],
  page = 0,
  rowsPerPage = 7,
  totalCount = 0,
  onPageChange,
  handleChangeMemberRole,
  handleRemoveMember,
  handleLeaveWorkspace,
  isLoading
}) {
  const theme = useTheme()
  const currentUser = useSelector((state) => state.user.currentUser)

  const renderMemberSkeletons = () => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <TableRow
        key={`skeleton-${idx}`}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiTableCell-root': {
            borderBottom: 'none',
            py: 1.65,
            px: 2.5
          }
        }}
      >
        {/* Member Column */}
        <TableCell>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Skeleton variant="circular" width={42} height={42} />
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={18} />
              <Skeleton variant="text" width="60%" height={14} />
            </Stack>
          </Stack>
        </TableCell>

        {/* Invited By Column */}
        <TableCell>
          <Stack spacing={0.5}>
            <Skeleton variant="text" width="70%" height={18} />
            <Skeleton variant="text" width="50%" height={14} />
          </Stack>
        </TableCell>

        {/* Role Column */}
        <TableCell>
          <Skeleton
            variant="rounded"
            width={148}
            height={36}
            sx={{
              borderRadius: '999px'
            }}
          />
        </TableCell>

        {/* Status Column */}
        <TableCell>
          <Skeleton
            variant="rounded"
            width={70}
            height={26}
            sx={{
              borderRadius: '4px'
            }}
          />
        </TableCell>

        {/* Joined Column */}
        <TableCell>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={80} height={18} />
          </Stack>
        </TableCell>

        {/* Action Column */}
        <TableCell align="center">
          <Skeleton
            variant="rounded"
            width={104}
            height={36}
            sx={{
              borderRadius: '999px',
              mx: 'auto'
            }}
          />
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden'
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.04)'
                  : 'grey.50'
            }}
          >
            <TableCell sx={{ fontWeight: 700 }}>Member</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            renderMemberSkeletons()
          ) : members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                <Typography variant="body1" color="text.secondary">
                  There are no members yet
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => {
              const displayName = member?.user?.displayName || 'Unknown User'
              const email = member?.user?.email || '--'
              const avatar = member?.user?.avatar
              const status = member?.status || '--'
              const joinAt = member?.joinAt

              return (
                <TableRow key={member?._id || email} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={avatar || undefined}
                        alt={displayName}
                        sx={{ width: 44, height: 44, fontWeight: 600 }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </Avatar>

                      <Stack spacing={0.25}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {email}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={member.boardRoleId || ''}
                      disabled={member.status !== 'active'}
                      onChange={(e) =>
                        handleChangeMemberRole({
                          _id: member._id,
                          newRole: e.target.value
                        })
                      }
                      displayEmpty
                      sx={{
                        minWidth: 140,
                        fontWeight: 600
                      }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role._id} value={role._id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getStatusLabel(status)}
                      color={getStatusColor(status)}
                      size="small"
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(joinAt)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <MemberActionButton
                      member={member}
                      currentUser={currentUser}
                      handleLeaveWorkspace={handleLeaveWorkspace}
                      handleRemoveMember={handleRemoveMember}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
        labelRowsPerPage=""
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          '.MuiTablePagination-toolbar': {
            minHeight: 56,
            px: 2
          },
          '.MuiTablePagination-selectLabel': {
            display: 'none'
          },
          '.MuiTablePagination-select': {
            display: 'none'
          },
          '.MuiTablePagination-displayedRows': {
            fontWeight: 600
          }
        }}
      />
    </TableContainer>
  )
}

export default BoardMemberTable
