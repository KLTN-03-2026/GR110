import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from '~/components/Workspace/workspaceBilling/ConfirmDialog'
import { useBoardSetting } from '~/hooks/boardSetting.hook'
import CreateBoardRoleModal from '../CreateBoardRoleModal'
import BoardRoleCard from '../BoardRoleCard'
import { Alert, alpha, Skeleton } from '@mui/material'
import PopperDeleteBoard from '../PopperDeleteBoard'
import { useTheme } from '@emotion/react'

function TabBoardSettings() {
  const { ui, data, handler } = useBoardSetting()
  const { isUpdating, isLoading } = ui
  const { roles } = data
  const { handleOpenCreateModal, handleUpdateRole } = handler

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
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
            <Skeleton
              variant="rounded"
              width={44}
              height={44}
              sx={{ borderRadius: '14px', flexShrink: 0 }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Skeleton variant="text" width={140} height={24} />
              <Stack direction="row" spacing={0.75} sx={{ mt: 0.4 }}>
                <Skeleton
                  variant="rounded"
                  width={84}
                  height={22}
                  sx={{ borderRadius: '999px' }}
                />
                <Skeleton
                  variant="rounded"
                  width={122}
                  height={22}
                  sx={{ borderRadius: '999px' }}
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
            <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 90 }}>
              <Skeleton
                variant="text"
                width={72}
                height={16}
                sx={{ ml: 'auto', mb: 0.6 }}
              />
              <Skeleton
                variant="rounded"
                width={90}
                height={6}
                sx={{ borderRadius: 999 }}
              />
            </Box>
            <Skeleton variant="circular" width={34} height={34} />
          </Box>
        </Stack>
      </Box>
    ))
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap'
        }}
      >
        {/* header  */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminPanelSettingsOutlinedIcon fontSize="large" />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Board Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure permissions and manage board roles.
            </Typography>
          </Box>
        </Box>

        {/* button  */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button
            onClick={handleOpenCreateModal}
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
              py: 1,
              minHeight: 42
            }}
          >
            Create Role
          </Button>

          <Button
            disabled={isUpdating}
            loadingPosition="center"
            onClick={handleUpdateRole}
            startIcon={
              isUpdating ? (
                <CircularProgress size="20px" />
              ) : (
                <SaveOutlinedIcon />
              )
            }
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
              py: 1,
              minHeight: 42,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#0f172a' : '#fff',
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#64b5f6' : '#1565c0'
              }
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>
      {ui.alert.open && (
        <Alert severity={ui.alert.severity}>{ui.alert.message}</Alert>
      )}
      {/* Roles List */}
      <Stack spacing={1.5} sx={{ marginTop: '1rem' }}>
        {isLoading ? (
          renderRoleSkeletons()
        ) : roles.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              There are no roles yet
            </Typography>
          </Box>
        ) : (
          roles.map((role) => (
            <BoardRoleCard
              key={role._id}
              role={role}
              data={data.roleCard}
              handler={handler.roleCard}
            />
          ))
        )}
      </Stack>
      <Box sx={{ marginTop: '10px', color: 'red', cursor: 'pointer' }}>
        <PopperDeleteBoard
          isDeleting={ui.isDeletingBoard}
          board={data.board}
          handleDeleteBoard={handler.handleDeleteBoard}
          alert={ui.alert}
        />
      </Box>

      <CreateBoardRoleModal
        ui={ui.createModal}
        data={data.createModal}
        handler={handler.createModal}
      />

      <ConfirmDialog {...ui.confirmDialog} {...handler.confirmDialog} />
    </>
  )
}

export default TabBoardSettings
