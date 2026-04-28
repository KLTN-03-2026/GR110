import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import AbcRoundedIcon from '@mui/icons-material/AbcRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import { alpha, useTheme } from '@mui/material/styles'
import modalConfig from '~/config/modalConfig'
import { useCreateWorkspaceForm } from '~/hooks/createWorkspaceForm.hook'

function CreateWorkspaceModal({ isOpen, loading, onClose, onSubmit }) {
  const { register, handleSubmit, errors } = useCreateWorkspaceForm({ isOpen })
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Modal open={isOpen} {...modalConfig} onClose={onClose}>
      <Fade in={isOpen}>
        <Box
          onClick={onClose}
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.05fr) 420px' },
              width: { xs: '94vw', sm: 620, md: 980 },
              maxHeight: '90vh',
              borderRadius: '24px',
              overflow: 'hidden',
              bgcolor: 'background.paper',
              boxShadow: isDark
                ? '0 32px 80px rgba(0,0,0,0.55)'
                : '0 32px 80px rgba(15,23,42,0.22)'
            }}
          >
            <Box
              sx={{
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
              }}
            >
              <Box
                sx={{
                  px: { xs: 2.5, sm: 3 },
                  py: 2.5,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'primary.contrastText',
                      bgcolor: 'primary.main',
                      boxShadow: `0 10px 24px ${alpha(
                        theme.palette.primary.main,
                        0.28
                      )}`
                    }}
                  >
                    <WorkspacesRoundedIcon />
                  </Box>

                  <Box sx={{ minWidth: 0, pr: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.25 }}
                    >
                      Create workspace
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mt: 0.25 }}
                    >
                      Bring boards, members, and roles together in one place.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Stack spacing={2.5} sx={{ p: { xs: 2.5, sm: 3 } }}>
                <TextField
                  fullWidth
                  label="Workspace title"
                  placeholder="Taco's Co."
                  {...register('title', {
                    required: 'Workspace title is required'
                  })}
                  error={!!errors.title}
                  helperText={
                    errors.title?.message ||
                    'This is the title of your company, team or organization.'
                  }
                  FormHelperTextProps={{
                    sx: {
                      color: errors.title ? 'error.main' : 'text.secondary',
                      mx: 0
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AbcRoundedIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Workspace description"
                  multiline
                  minRows={4}
                  placeholder="Our team organizes everything here."
                  {...register('description')}
                  helperText="Optional. Add a short note so members know what this workspace is for."
                  FormHelperTextProps={{
                    sx: {
                      color: 'text.secondary',
                      mx: 0
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: 'flex-start', mt: 1.5 }}
                      >
                        <DescriptionOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />

                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.14 : 0.06),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <AutoAwesomeRoundedIcon
                      sx={{ color: 'primary.main', fontSize: 20, mt: 0.2 }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      A workspace can contain multiple boards and keeps team
                      permissions organized.
                    </Typography>
                  </Stack>
                </Box>

                <Divider />

                <Stack
                  direction={{ xs: 'column-reverse', sm: 'row' }}
                  spacing={1.25}
                  justifyContent="flex-end"
                >
                  <Button
                    onClick={onClose}
                    color="inherit"
                    sx={{
                      px: 2.5,
                      borderRadius: '999px',
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={loading}
                    type="submit"
                    variant="contained"
                    startIcon={
                      loading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : null
                    }
                    sx={{
                      minWidth: 150,
                      px: 3,
                      borderRadius: '999px',
                      fontWeight: 700,
                      boxShadow: `0 8px 22px ${alpha(
                        theme.palette.primary.main,
                        0.28
                      )}`
                    }}
                  >
                    {loading ? 'Creating...' : 'Create workspace'}
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                position: 'relative',
                overflow: 'hidden',
                minHeight: 520,
                p: 3,
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                background:
                  'linear-gradient(145deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
                  backgroundSize: '22px 22px'
                }}
              />

              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 2,
                  color: 'rgba(255,255,255,0.78)',
                  bgcolor: 'rgba(255,255,255,0.10)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.18)',
                    color: 'white'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              <Stack
                spacing={2.5}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  maxWidth: 310
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 24,
                      lineHeight: 1.2,
                      fontWeight: 800,
                      letterSpacing: 0
                    }}
                  >
                    Organize work faster
                  </Typography>
                  <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.72)' }}>
                    Create a shared space for boards, people, and project
                    permissions.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    borderRadius: '18px',
                    bgcolor: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    backdropFilter: 'blur(10px)',
                    p: 1.5,
                    boxShadow: '0 22px 54px rgba(0,0,0,0.24)'
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: '14px',
                      bgcolor: 'rgba(255,255,255,0.94)',
                      color: '#0f172a',
                      p: 1.5
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <ViewKanbanOutlinedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                      <Typography sx={{ fontWeight: 800 }}>Team workspace</Typography>
                    </Stack>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 1
                      }}
                    >
                      {[
                        { title: 'Plan', cards: 3, color: '#2563eb' },
                        { title: 'Build', cards: 2, color: '#7c3aed' },
                        { title: 'Ship', cards: 2, color: '#16a34a' }
                      ].map((column) => (
                        <Box
                          key={column.title}
                          sx={{
                            minHeight: 142,
                            borderRadius: '10px',
                            bgcolor: '#f1f5f9',
                            p: 1
                          }}
                        >
                          <Box
                            sx={{
                              height: 7,
                              width: '72%',
                              borderRadius: 999,
                              bgcolor: column.color,
                              mb: 1
                            }}
                          />
                          <Typography sx={{ fontSize: 11, fontWeight: 800, mb: 1 }}>
                            {column.title}
                          </Typography>
                          <Stack spacing={0.75}>
                            {Array.from({ length: column.cards }).map((_, index) => (
                              <Box
                                key={index}
                                sx={{
                                  height: 26,
                                  borderRadius: '8px',
                                  bgcolor: 'white',
                                  border: '1px solid #e2e8f0',
                                  p: 0.6
                                }}
                              >
                                <Box
                                  sx={{
                                    width: index % 2 ? '70%' : '86%',
                                    height: 4,
                                    borderRadius: 999,
                                    bgcolor: '#cbd5e1',
                                    mb: 0.45
                                  }}
                                />
                                <Box
                                  sx={{
                                    width: '48%',
                                    height: 3,
                                    borderRadius: 999,
                                    bgcolor: '#e2e8f0'
                                  }}
                                />
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Stack spacing={1.25}>
                  {['Shared boards', 'Workspace roles', 'Member management'].map(
                    (item) => (
                      <Stack key={item} direction="row" spacing={1} alignItems="center">
                        <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#86efac' }} />
                        <Typography sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.86)' }}>
                          {item}
                        </Typography>
                      </Stack>
                    )
                  )}
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default CreateWorkspaceModal
