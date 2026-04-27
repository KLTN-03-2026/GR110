import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { getInitials } from '~/helpers/getInitials'
import { groupPermission } from '~/helpers/groupPermission'
import { alpha, useTheme } from '@mui/material/styles'

function WorkspaceRoleCard({ role, data, handler }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { permissions } = data

  const {
    handleOpenConfirmDialog,
    handleChangeRoleName,
    handleChangeRolePermissions
  } = handler

  const [open, setOpen] = useState(false)
  const roleSet = new Set(role.permissionCodes)
  const grouped = groupPermission({ permissions, prefix: 'workspace.' })
  const grantedCount = role.permissionCodes.length
  const permissionTotal = permissions.length || 0
  const grantedPercent = permissionTotal
    ? Math.round((grantedCount / permissionTotal) * 100)
    : 0

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(role.name)

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        borderColor: open
          ? alpha(theme.palette.primary.main, isDark ? 0.45 : 0.28)
          : theme.palette.divider,
        bgcolor: theme.palette.background.paper,
        boxShadow: open
          ? isDark
            ? `0 14px 30px ${alpha('#000', 0.26)}`
            : `0 14px 30px ${alpha(theme.palette.common.black, 0.08)}`
          : 'none',
        transition:
          'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, isDark ? 0.42 : 0.22),
          boxShadow: isDark
            ? `0 12px 26px ${alpha('#000', 0.2)}`
            : `0 12px 24px ${alpha(theme.palette.common.black, 0.06)}`,
          transform: 'translateY(-1px)'
        }
      }}
    >
      <Box
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: { xs: 2, md: 2.5 },
          py: 2,
          cursor: 'pointer',
          userSelect: 'none',
          bgcolor: open
            ? isDark
              ? alpha(theme.palette.primary.main, 0.08)
              : alpha(theme.palette.primary.main, 0.035)
            : theme.palette.background.paper
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            minWidth: 0,
            flex: 1
          }}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              fontSize: 14,
              fontWeight: 800,
              borderRadius: '14px',
              background: isDark
                ? 'linear-gradient(135deg, #1e3a8a, #2563eb)'
                : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              color: isDark ? '#ffffff' : '#1d4ed8',
              boxShadow: `0 8px 20px ${alpha(
                theme.palette.primary.main,
                isDark ? 0.22 : 0.16
              )}`,
              flexShrink: 0
            }}
          >
            {getInitials(role.name)}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            {isEditing ? (
              <TextField
                onClick={(e) => e.stopPropagation()}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  handleChangeRoleName({
                    roleId: role._id,
                    value: e.target.value
                  })
                }}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                autoFocus
                variant="standard"
                size="small"
                slotProps={{
                  input: {
                    style: { fontWeight: 800, fontSize: '1rem' }
                  }
                }}
                sx={{
                  minWidth: { xs: 160, sm: 220 },
                  '& .MuiInput-underline:before': {
                    borderBottom: '1px dashed #aaa'
                  }
                }}
              />
            ) : (
              <Typography
                variant="body1"
                fontWeight={800}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                sx={{
                  cursor: 'pointer',
                  lineHeight: 1.35,
                  maxWidth: { xs: 170, sm: 320 },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  '&:hover': { textDecoration: 'underline dotted' }
                }}
              >
                {name}
              </Typography>
            )}

            <Stack
              direction="row"
              spacing={0.75}
              useFlexGap
              flexWrap="wrap"
              sx={{ mt: 0.75 }}
            >
              <Chip
                label={role.isDefault ? 'Default role' : 'Custom role'}
                size="small"
                sx={{
                  height: 22,
                  borderRadius: '999px',
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: role.isDefault
                    ? alpha(theme.palette.info.main, isDark ? 0.18 : 0.08)
                    : alpha(theme.palette.success.main, isDark ? 0.16 : 0.08),
                  color: role.isDefault ? 'info.main' : 'success.main',
                  border: `1px solid ${alpha(
                    role.isDefault
                      ? theme.palette.info.main
                      : theme.palette.success.main,
                    0.22
                  )}`
                }}
              />

              <Chip
                icon={<ShieldOutlinedIcon sx={{ fontSize: 14 }} />}
                label={`${grantedCount}/${permissionTotal} permissions`}
                size="small"
                sx={{
                  height: 22,
                  borderRadius: '999px',
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    isDark ? 0.16 : 0.08
                  ),
                  color: 'primary.main',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '& .MuiChip-icon': {
                    ml: 0.75,
                    mr: -0.4,
                    color: 'primary.main'
                  }
                }}
              />
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0
          }}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleOpenConfirmDialog({ roleId: role._id })
            }}
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
            sx={{
              height: 34,
              minWidth: 'auto',
              px: 1.35,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              bgcolor: alpha(theme.palette.error.main, isDark ? 0.1 : 0.04),
              borderColor: alpha(theme.palette.error.main, isDark ? 0.35 : 0.2),
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, isDark ? 0.18 : 0.08),
                borderColor: theme.palette.error.main
              }
            }}
          >
            Delete
          </Button>

          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              minWidth: 90
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: 'text.secondary',
                mb: 0.5,
                textAlign: 'right'
              }}
            >
              {grantedPercent}% granted
            </Typography>
            <LinearProgress
              variant="determinate"
              value={grantedPercent}
              sx={{
                height: 6,
                borderRadius: 999,
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  bgcolor: theme.palette.primary.main
                }
              }}
            />
          </Box>

          <IconButton
            size="small"
            sx={{
              width: 34,
              height: 34,
              p: 0.75,
              borderRadius: '50%',
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              color: 'text.secondary',
              bgcolor: isDark
                ? alpha(theme.palette.common.white, 0.06)
                : alpha(theme.palette.common.black, 0.04),
              '&:hover': {
                color: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08)
              }
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={open} unmountOnExit>
        <Divider />
        <Box
          sx={{
            px: { xs: 2, md: 2.5 },
            py: 2,
            bgcolor: isDark ? alpha(theme.palette.common.white, 0.025) : '#f8fafc'
          }}
        >
          <Stack spacing={2}>
            {Object.entries(grouped).map(([label, perms]) => (
              <Paper
                key={label}
                elevation={0}
                sx={{
                  borderRadius: '14px',
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'hidden',
                  bgcolor: theme.palette.background.paper
                }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 1.15,
                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={800}
                    color="text.secondary"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: 0.6,
                      display: 'block'
                    }}
                  >
                    {label}
                  </Typography>
                </Box>

                <List disablePadding dense sx={{ p: 1 }}>
                  {perms.map((p) => {
                    const has = roleSet.has(p.permissionCode)
                    return (
                      <ListItem
                        key={p.permissionCode}
                        disableGutters
                        disablePadding
                        sx={{
                          px: 1.25,
                          py: 1,
                          mb: 0.5,
                          borderRadius: 2,
                          bgcolor: has
                            ? alpha(
                              theme.palette.success.main,
                              isDark ? 0.14 : 0.07
                            )
                            : isDark
                              ? alpha(theme.palette.common.white, 0.035)
                              : '#f8fafc',
                          border: '1px solid',
                          borderColor: has
                            ? alpha(theme.palette.success.main, isDark ? 0.3 : 0.18)
                            : 'divider',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.15,
                          transition:
                            'background-color 0.16s ease, border-color 0.16s ease',
                          '&:last-child': { mb: 0 },
                          '&:hover': {
                            borderColor: has
                              ? alpha(theme.palette.success.main, 0.42)
                              : alpha(theme.palette.primary.main, 0.22)
                          }
                        }}
                      >
                        <Tooltip
                          title={has ? 'Granted' : 'Not granted'}
                          placement="left"
                          arrow
                        >
                          <Box sx={{ mt: 0.25, flexShrink: 0 }}>
                            {has ? (
                              <CheckCircleOutlineIcon
                                sx={{
                                  fontSize: 18,
                                  color: 'success.main',
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  handleChangeRolePermissions({
                                    roleId: role._id,
                                    permissionCode: p.permissionCode,
                                    action: 'remove'
                                  })
                                }}
                              />
                            ) : (
                              <RemoveCircleOutlineIcon
                                sx={{
                                  fontSize: 18,
                                  color: 'text.disabled',
                                  cursor: 'pointer',
                                  '&:hover': { color: 'primary.main' }
                                }}
                                onClick={() => {
                                  handleChangeRolePermissions({
                                    roleId: role._id,
                                    permissionCode: p.permissionCode,
                                    action: 'add'
                                  })
                                }}
                              />
                            )}
                          </Box>
                        </Tooltip>
                        <Box>
                          <Typography
                            color={has ? 'text.secondary' : 'text.disabled'}
                          >
                            {p.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.disabled',
                              fontSize: 11,
                              wordBreak: 'break-all'
                            }}
                          >
                            {p.permissionCode}
                          </Typography>
                        </Box>
                      </ListItem>
                    )
                  })}
                </List>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  )
}
export default WorkspaceRoleCard
