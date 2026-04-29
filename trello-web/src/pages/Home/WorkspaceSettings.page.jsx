import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import AddIcon from '@mui/icons-material/Add'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import WorkspaceRoleCard from '~/components/Workspace/WorkspaceRoleCard'
import CreateWorkspaceRoleModal from '~/components/Workspace/CreateWorkspaceRoleModal'
import ConfirmDialog from '~/components/Workspace/workspaceBilling/ConfirmDialog'
import { useWorkspaceSetting } from '~/hooks/workspaceSetting.hook'
import PopperDeleteWorkspace from '~/components/Workspace/PopperDeleteWorkspace'
import { useOutletContext } from 'react-router-dom'
import { alpha, useTheme } from '@mui/material/styles'
import WorkspacePageHeader from '~/components/Workspace/WorkspacePageHeader'

function WorkspaceSettingsPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const { ui, data, handler } = useWorkspaceSetting()
  const { isUpdating, isDeletingWorkspace, isLoadingRoles = false } = ui
  const { roles } = data
  const { handleOpenCreateModal, handleUpdateRole, handleDeleteWorkspace } =
    handler

  const { workspace } = useOutletContext()

  const roleCount = roles?.length || 0

  const renderRoleSkeletons = () => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <Box
        key={`skeleton-${idx}`}
        sx={{
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          px: { xs: 2, md: 2.5 },
          py: 2,
          bgcolor: isDark
            ? alpha(theme.palette.common.white, 0.035)
            : theme.palette.background.paper
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
            <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: '14px', flexShrink: 0 }} />

            <Box sx={{ minWidth: 0 }}>
              <Skeleton variant="text" width={140} height={24} />
              <Stack direction="row" spacing={0.75} sx={{ mt: 0.4 }}>
                <Skeleton variant="rounded" width={84} height={22} sx={{ borderRadius: '999px' }} />
                <Skeleton variant="rounded" width={122} height={22} sx={{ borderRadius: '999px' }} />
              </Stack>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 90 }}>
              <Skeleton variant="text" width={72} height={16} sx={{ ml: 'auto', mb: 0.6 }} />
              <Skeleton variant="rounded" width={90} height={6} sx={{ borderRadius: 999 }} />
            </Box>
            <Skeleton variant="circular" width={34} height={34} />
          </Box>
        </Stack>
      </Box>
    ))
  }

  return (
    <>
      <WorkspacePageHeader
        badgeIcon={<SecurityRoundedIcon sx={{ fontSize: 13 }} />}
        badgeLabel="Roles & Permissions"
        title="Workspace Settings"
        description={`${workspace?.title || 'Workspace'} - ${roleCount} role${
          roleCount !== 1 ? 's' : ''
        } - Manage access policies`}
      >
        <Button
          onClick={handleOpenCreateModal}
          startIcon={<AddIcon />}
          variant="contained"
          sx={(theme) => ({
            fontWeight: 700,
            borderRadius: '999px',
            px: 2.5,
            py: 1.1,
            bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.12)'
                  : 'primary.main',
            color:
                theme.palette.mode === 'dark'
                  ? 'common.white'
                  : 'primary.contrastText',
            border: `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.18)'
                : 'transparent'
            }`,
            boxShadow:
                theme.palette.mode === 'dark'
                  ? 'none'
                  : '0 8px 24px rgba(37,99,235,0.24)',
            '&:hover': {
              bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.18)'
                    : 'primary.dark',
              transform: 'translateY(-1px)',
              boxShadow:
                  theme.palette.mode === 'dark'
                    ? 'none'
                    : '0 12px 30px rgba(37,99,235,0.30)'
            }
          })}
        >
            Create Role
        </Button>

        <Button
          disabled={isUpdating}
          onClick={handleUpdateRole}
          startIcon={
            isUpdating ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveOutlinedIcon />
            )
          }
          variant="outlined"
          sx={(theme) => ({
            fontWeight: 700,
            borderRadius: '999px',
            px: 2.5,
            py: 1.1,
            color:
                theme.palette.mode === 'dark' ? 'common.white' : 'primary.main',
            borderColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.30)'
                  : alpha(theme.palette.primary.main, 0.28),
            backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : alpha(theme.palette.primary.main, 0.06),
            backdropFilter: 'blur(6px)',
            '&:hover': {
              borderColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.58)'
                    : theme.palette.primary.main,
              backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.14)'
                    : alpha(theme.palette.primary.main, 0.1)
            },
            '&.Mui-disabled': {
              color:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.55)'
                    : alpha(theme.palette.text.primary, 0.38),
              borderColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.16)'
                    : theme.palette.divider
            }
          })}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </WorkspacePageHeader>

      <Alert
        icon={<InfoOutlinedIcon fontSize="inherit" />}
        severity="info"
        sx={{
          mb: 2.5,
          borderRadius: '12px',
          backgroundColor: isDark
            ? alpha('#2196f3', 0.08)
            : alpha('#2196f3', 0.05),
          borderColor: isDark ? alpha('#2196f3', 0.25) : alpha('#2196f3', 0.15),
          color: isDark ? '#64b5f6' : '#1976d2',
          '& .MuiAlert-icon': {
            color: isDark ? '#64b5f6' : '#1976d2'
          }
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          Default roles cannot be edited. They are managed by the system to
          ensure workspace security and consistency.
        </Typography>
      </Alert>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          mb: 2.5
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>
            Workspace Roles
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 0.25 }}
          >
            Expand a role to review and adjust its permissions.
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          {isLoadingRoles ? (
            <Stack spacing={1.5}>{renderRoleSkeletons()}</Stack>
          ) : roles.length === 0 ? (
            <Box
              sx={{
                py: 7,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <AdminPanelSettingsOutlinedIcon
                  sx={{ fontSize: 28, color: 'primary.main' }}
                />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                No roles available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a role to start managing workspace access.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {roles.map((role) => (
                <WorkspaceRoleCard
                  key={role._id}
                  role={role}
                  data={data.roleCard}
                  handler={handler.roleCard}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.error.main, isDark ? 0.35 : 0.18)}`,
          bgcolor: isDark
            ? alpha(theme.palette.error.main, 0.08)
            : alpha(theme.palette.error.main, 0.035),
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '14px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha(theme.palette.error.main, isDark ? 0.18 : 0.1),
                color: 'error.main',
                flexShrink: 0
              }}
            >
              <WarningAmberRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
                Danger Zone
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', maxWidth: 620, mt: 0.25 }}
              >
                Deleting this workspace is permanent and will close related
                boards. This action requires typing the workspace name.
              </Typography>
            </Box>
          </Box>

          <Divider
            flexItem
            orientation="vertical"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          />

          <PopperDeleteWorkspace
            isDeleting={isDeletingWorkspace}
            workspace={workspace}
            handleDeleteWorkspace={handleDeleteWorkspace}
          />
        </Stack>
      </Paper>

      <CreateWorkspaceRoleModal
        ui={ui.createModal}
        data={data.createModal}
        handler={handler.createModal}
      />

      <ConfirmDialog {...ui.confirmDialog} {...handler.confirmDialog} />
    </>
  )
}

export default WorkspaceSettingsPage
