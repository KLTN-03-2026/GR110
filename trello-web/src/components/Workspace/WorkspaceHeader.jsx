import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  IconButton,
  Avatar
} from '@mui/material'
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
function WorkspaceHeader({ workspace, handleOpenUpdateModal }) {
  const title = workspace?.title || 'Untitled Workspace'
  const description = workspace?.description || 'No description'

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#1e3a5f' : '#dbeafe',
                color: (theme) =>
                  theme.palette.mode === 'dark' ? '#93c5fd' : '#1d4ed8',
                flexShrink: 0
              }}
            >
              {workspace?.title?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="h5" fontWeight={700}>
                  {title}
                </Typography>

                <IconButton
                  size="small"
                  onClick={handleOpenUpdateModal}
                  sx={{
                    color: 'text.secondary',
                    p: 0.5,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 0.75, maxWidth: 720 }}
              >
                {description}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default WorkspaceHeader
