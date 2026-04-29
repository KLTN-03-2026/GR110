import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import { alpha, useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import MemberActionButton from './workspaceMember/MemberActionButton'

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

function getStatusChipSx(status, isDark) {
  switch (status) {
  case 'active':
    return {
      backgroundColor: isDark ? 'rgba(34,197,94,0.15)' : '#dcfce7',
      color: isDark ? '#4ade80' : '#15803d',
      border: `1px solid ${isDark ? 'rgba(74,222,128,0.25)' : '#bbf7d0'}`
    }
  case 'removed':
    return {
      backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
      color: isDark ? '#f87171' : '#b91c1c',
      border: `1px solid ${isDark ? 'rgba(248,113,113,0.25)' : '#fecaca'}`
    }
  default:
    return {
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
      color: isDark ? '#9ca3af' : '#6b7280',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'}`
    }
  }
}

function getStatusLabel(status) {
  switch (status) {
  case 'active':
    return 'Active'
  case 'removed':
    return 'Removed'
  default:
    return status || ''
  }
}

const headCells = ['Member', 'Invited By', 'Role', 'Status', 'Joined', 'Action']
const FIXED_ROWS_PER_PAGE = 7

function WorkspaceMemberTable({
  members = [],
  roles = [],
  page = 0,
  totalCount = 0,
  onPageChange,
  handleChangeMemberRole,
  handleLeaveWorkspace,
  handleRemoveMember
}) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const currentUser = useSelector((state) => state.user.currentUser)

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '18px',
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper
      }}
    >
      <TableContainer
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          bgcolor: theme.palette.background.paper
        }}
      >
        <Table sx={{ minWidth: 940 }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: isDark
                  ? alpha(theme.palette.common.white, 0.045)
                  : alpha(theme.palette.primary.main, 0.035),
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              {headCells.map((label) => (
                <TableCell
                  key={label}
                  align={label === 'Action' ? 'center' : 'left'}
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    letterSpacing: 0,
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    py: 1.75,
                    px: label === 'Action' ? 2 : 2.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 9, border: 'none' }}>
                  <Stack alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '18px',
                        backgroundColor: alpha(theme.palette.primary.main, 0.09),
                        display: 'grid',
                        placeItems: 'center',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`
                      }}
                    >
                      <GroupsRoundedIcon sx={{ fontSize: 30, color: 'primary.main' }} />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: 'text.primary'
                      }}
                    >
                      No members yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Invite people to start collaborating in this workspace.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member, idx) => {
                const displayName = member?.user?.displayName || 'Unknown User'
                const email = member?.user?.email || ''
                const avatar = member?.user?.avatar
                const status = member?.status || ''
                const joinAt = member?.joinAt
                const isLast = idx === members.length - 1

                return (
                  <TableRow
                    key={member._id}
                    sx={{
                      borderBottom: isLast ? 'none' : `1px solid ${theme.palette.divider}`,
                      transition: 'background-color 0.16s ease',
                      '&:hover': {
                        bgcolor: isDark
                          ? alpha(theme.palette.common.white, 0.035)
                          : alpha(theme.palette.primary.main, 0.025)
                      },
                      '& .MuiTableCell-root': {
                        borderBottom: 'none',
                        py: 1.65,
                        px: 2.5
                      }
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          src={avatar || undefined}
                          alt={displayName}
                          sx={{
                            width: 42,
                            height: 42,
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                            color: 'white',
                            boxShadow: isDark
                              ? '0 8px 18px rgba(0,0,0,0.28)'
                              : '0 8px 18px rgba(37,99,235,0.18)'
                          }}
                        >
                          {displayName.charAt(0).toUpperCase()}
                        </Avatar>

                        <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                            <PersonRoundedIcon
                              sx={{
                                fontSize: 15,
                                color: 'text.disabled',
                                flexShrink: 0
                              }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                lineHeight: 1.35,
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {displayName}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                            <MailOutlineRoundedIcon
                              sx={{
                                fontSize: 14,
                                color: 'text.disabled',
                                flexShrink: 0
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: '0.78rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {email}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.86rem',
                            lineHeight: 1.35,
                            color: 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {member?.inviter?.displayName || ''}
                        </Typography>
                        {member?.inviter?.email && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: '0.78rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {member.inviter.email}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Select
                        size="small"
                        value={member.workspaceRoleId || ''}
                        disabled={member.status !== 'active'}
                        onChange={(e) =>
                          handleChangeMemberRole({
                            _id: member._id,
                            newRole: e.target.value
                          })
                        }
                        displayEmpty
                        sx={{
                          minWidth: 148,
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          borderRadius: '999px',
                          bgcolor: isDark
                            ? alpha(theme.palette.common.white, 0.04)
                            : alpha(theme.palette.primary.main, 0.025),
                          '& .MuiSelect-select': {
                            py: 0.8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(theme.palette.primary.main, isDark ? 0.24 : 0.16)
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-disabled': {
                            bgcolor: isDark
                              ? alpha(theme.palette.common.white, 0.025)
                              : alpha(theme.palette.common.black, 0.025)
                          }
                        }}
                      >
                        {roles.map((role) => (
                          <MenuItem
                            key={role._id}
                            value={role._id}
                            sx={{ fontSize: '0.82rem', fontWeight: 700 }}
                          >
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={getStatusLabel(status)}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          height: 26,
                          px: 0.25,
                          textTransform: 'capitalize',
                          ...getStatusChipSx(status, isDark)
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <CalendarMonthRoundedIcon
                          sx={{ fontSize: 16, color: 'text.disabled' }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.82rem', fontWeight: 600 }}
                        >
                          {formatDate(joinAt)}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="center" sx={{ px: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          '& .MuiButton-root': {
                            minWidth: 104,
                            borderRadius: '999px',
                            textTransform: 'none',
                            fontWeight: 700
                          }
                        }}
                      >
                        <MemberActionButton
                          member={member}
                          currentUser={currentUser}
                          handleLeaveWorkspace={handleLeaveWorkspace}
                          handleRemoveMember={handleRemoveMember}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper
        }}
      >
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={FIXED_ROWS_PER_PAGE}
          rowsPerPageOptions={[]}
          labelRowsPerPage=""
          sx={{
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
      </Box>
    </Box>
  )
}

export default WorkspaceMemberTable