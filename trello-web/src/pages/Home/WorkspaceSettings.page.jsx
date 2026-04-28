import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import CircularProgress from '@mui/material/CircularProgress'
import WorkspaceRoleCard from '~/components/Workspace/WorkspaceRoleCard'
import CreateWorkspaceRoleModal from '~/components/Workspace/CreateWorkspaceRoleModal'
import ConfirmDialog from '~/components/Workspace/workspaceBilling/ConfirmDialog'
import { useWorkspaceSetting } from '~/hooks/workspaceSetting.hook'
import PopperDeleteWorkspace from '~/components/Workspace/PopperDeleteWorkspace'
import { useOutletContext } from 'react-router-dom'
import { alpha, useTheme } from '@mui/material/styles'

const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

function WorkspaceSettingsPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const { ui, data, handler } = useWorkspaceSetting()
  const { isUpdating, isDeletingWorkspace } = ui
  const { roles } = data
  const { handleOpenCreateModal, handleUpdateRole, handleDeleteWorkspace } =
    handler

  const { workspace } = useOutletContext()

  const roleCount = roles?.length || 0
  const customRoleCount = roles?.filter((role) => !role.isDefault).length || 0

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background:
            'linear-gradient(145deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
          color: 'white',
          px: { xs: 3, md: 5 },
          py: { xs: 3.5, md: 4 },
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={dotPatternSx} />

        <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
          <Chip
            icon={
              <SecurityRoundedIcon
                sx={{ fontSize: 13, color: '#93c5fd !important' }}
              />
            }
            label="Roles & Permissions"
            size="small"
            sx={{
              mb: 1.5,
              backgroundColor: 'rgba(255,255,255,0.10)',
              color: '#bfdbfe',
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: 1,
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)'
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 22, md: 28 },
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: 0,
              mb: 0.5
            }}
          >
            Workspace Settings
          </Typography>

          <Typography sx={{ opacity: 0.72, fontSize: '0.875rem' }}>
            {workspace?.title || 'Workspace'} - {roleCount} role
            {roleCount !== 1 ? 's' : ''} - Manage access policies
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1.25}
          flexWrap="wrap"
          useFlexGap
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Button
            onClick={handleOpenCreateModal}
            startIcon={<AddIcon />}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '999px',
              px: 2.5,
              py: 1.1,
              backgroundColor: 'white',
              color: '#1d4ed8',
              boxShadow: '0 6px 20px rgba(0,0,0,0.20)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.92)',
                transform: 'translateY(-1px)',
                boxShadow: '0 10px 28px rgba(0,0,0,0.25)'
              }
            }}
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
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '999px',
              px: 2.5,
              py: 1.1,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.35)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(6px)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.7)',
                backgroundColor: 'rgba(255,255,255,0.14)'
              },
              '&.Mui-disabled': {
                color: 'rgba(255,255,255,0.55)',
                borderColor: 'rgba(255,255,255,0.16)'
              }
            }}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Box>


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
          {roles.length === 0 ? (
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
