import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { useUpdateWorkspaceForm } from '~/hooks/updateWorkspaceForm.hook'
import { alpha, Divider, InputAdornment } from '@mui/material'
import { useTheme } from '@emotion/react'

function UpdateWorkspaceModal({ data, loading, isOpen, onClose, onSubmit }) {
  const { register, errors, handleSubmit } = useUpdateWorkspaceForm({
    isOpen,
    data
  })

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Dialog
      open={isOpen}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3
        }
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: isDark
            ? `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.18
            )}, transparent 58%)`
            : `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.08
            )}, transparent 62%)`
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.26)}`,
              flexShrink: 0
            }}
          >
            <EditOutlinedIcon />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.25
              }}
            >
              Update workspace
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 0.25
              }}
            >
              Update title and description for your workspace.
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{
            color: 'text.secondary',
            bgcolor: alpha(theme.palette.text.primary, isDark ? 0.1 : 0.05),
            '&:hover': {
              bgcolor: alpha(theme.palette.text.primary, isDark ? 0.16 : 0.08),
              color: 'text.primary'
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AbcIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              label="Title"
              fullWidth
              autoFocus
              disabled={loading}
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Title must be at most 100 characters'
                },
                validate: (value) =>
                  value.trim() !== '' || 'Title cannot be empty'
              })}
            />

            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              label="Description"
              fullWidth
              multiline
              minRows={4}
              disabled={loading}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description must be at most 500 characters'
                }
              })}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={loading ? undefined : onClose}
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>

          <Button sx={{
            borderRadius: 5
          }} type="submit" variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default UpdateWorkspaceModal
