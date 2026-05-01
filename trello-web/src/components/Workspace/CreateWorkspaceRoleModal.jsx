import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { alpha, useTheme } from '@mui/material/styles'
import { groupPermission } from '~/helpers/groupPermission'
import { useCreateWorkspaceRoleForm } from '~/hooks/workspaceRoleForm.hook'

function CreateWorkspaceRoleModal({ ui, data, handler }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { open, isSubmitting } = ui
  const { permissions } = data || []
  const { onClose, handleCreate } = handler

  const {
    register,
    handleSubmit,
    errors,
    selectedPermissions,
    handleClose,
    onSubmit
  } = useCreateWorkspaceRoleForm({ handleCreate, onClose })

  const grouped = groupPermission({ permissions, prefix: 'workspace.' })
  const permissionTotal = permissions?.length || 0

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,0.55)'
            : '0 32px 80px rgba(15,23,42,0.20)'
        }
      }}
    >
      <DialogTitle
        sx={{
          position: 'relative',
          px: { xs: 2.5, md: 3 },
          py: 2.5,
          pr: 7,
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: isDark
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, transparent 48%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent 50%)`
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
                0.26
              )}`,
              flexShrink: 0
            }}
          >
            <AdminPanelSettingsOutlinedIcon />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 900, lineHeight: 1.25 }}>
              Create workspace role
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              Define a custom role and assign workspace permissions.
            </Typography>
          </Box>
        </Stack>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={isSubmitting}
          size="small"
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
            bgcolor: alpha(theme.palette.text.primary, isDark ? 0.1 : 0.05),
            '&:hover': {
              color: 'text.primary',
              bgcolor: alpha(theme.palette.text.primary, isDark ? 0.16 : 0.08)
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
        }}
      >
        <Stack
          component="form"
          spacing={2.5}
          onSubmit={handleSubmit(onSubmit)}
          id="create-workspace-form"
          sx={{ p: { xs: 2.5, md: 3 } }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
            }}
          >
            <TextField
              label="Workspace role name"
              fullWidth
              autoFocus
              error={!!errors.name}
              helperText={
                errors.name?.message ||
                'Use a clear name such as Manager, Reviewer, or Client.'
              }
              FormHelperTextProps={{
                sx: {
                  mx: 0,
                  color: errors.name ? 'error.main' : 'text.secondary'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              {...register('name', {
                required: 'Workspace name is required',
                minLength: {
                  value: 2,
                  message: 'Workspace name must be at least 2 characters'
                }
              })}
            />
          </Box>

          <Box
            sx={{
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)',
              overflow: 'hidden'
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{
                px: 2.5,
                py: 2,
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08)
                  }}
                >
                  <SecurityRoundedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900 }}>Permissions</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                    Select what this role can do inside the workspace.
                  </Typography>
                </Box>
              </Stack>

              <Chip
                icon={<CheckCircleRoundedIcon sx={{ fontSize: 15 }} />}
                label={`${selectedPermissions.length}/${permissionTotal} selected`}
                size="small"
                sx={{
                  height: 30,
                  fontWeight: 800,
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                  '& .MuiChip-icon': { color: 'primary.main' }
                }}
              />
            </Stack>

            <Box sx={{ p: 2 }}>
              {Object.keys(grouped).length === 0 ? (
                <Box
                  sx={{
                    py: 5,
                    display: 'grid',
                    placeItems: 'center',
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}
                >
                  <Typography variant="body2">No permissions available</Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                    gridAutoRows: '1fr',
                    alignItems: 'stretch',
                    gap: 1.5
                  }}
                >
                  {Object.entries(grouped).map(([groupLabel, groupItems]) => (
                    <Box
                      key={groupLabel}
                      sx={{
                        height: '100%',
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '14px',
                        bgcolor: isDark ? 'rgba(255,255,255,0.025)' : '#ffffff',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          px: 1.75,
                          py: 1,
                          minHeight: 46,
                          display: 'flex',
                          alignItems: 'center',
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontWeight: 900,
                            color: 'text.secondary',
                            letterSpacing: 0.6,
                            textTransform: 'uppercase'
                          }}
                        >
                          {groupLabel}
                        </Typography>
                      </Box>

                      <FormGroup
                        sx={{
                          flex: 1,
                          p: 1,
                          display: 'grid',
                          alignContent: 'start',
                          gridAutoRows: 'minmax(50px, auto)',
                          gap: 0.5
                        }}
                      >
                        {groupItems.map((permission) => {
                          const checked = selectedPermissions.includes(
                            permission.permissionCode
                          )

                          return (
                            <FormControlLabel
                              key={permission._id || permission.permissionCode}
                              control={
                                <Checkbox
                                  value={permission.permissionCode}
                                  {...register('permissionCodes')}
                                />
                              }
                              label={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: checked
                                      ? 'text.primary'
                                      : 'text.secondary',
                                    display: 'block',
                                    lineHeight: 1.45,
                                    overflowWrap: 'anywhere'
                                  }}
                                >
                                  {permission.description}
                                </Typography>
                              }
                              sx={{
                                m: 0,
                                minHeight: 50,
                                px: 1,
                                py: 0.5,
                                display: 'grid',
                                gridTemplateColumns: '34px minmax(0, 1fr)',
                                alignItems: 'center',
                                borderRadius: '10px',
                                border: '1px solid transparent',
                                bgcolor: checked
                                  ? alpha(
                                    theme.palette.primary.main,
                                    isDark ? 0.14 : 0.06
                                  )
                                  : 'transparent',
                                '&:hover': {
                                  bgcolor: checked
                                    ? alpha(
                                      theme.palette.primary.main,
                                      isDark ? 0.18 : 0.09
                                    )
                                    : alpha(
                                      theme.palette.text.primary,
                                      isDark ? 0.07 : 0.04
                                    )
                                },
                                '& .MuiFormControlLabel-label': {
                                  minWidth: 0,
                                  display: 'block'
                                },
                                '& .MuiCheckbox-root': {
                                  p: 0.75,
                                  color: checked
                                    ? 'primary.main'
                                    : 'text.secondary'
                                }
                              }}
                            />
                          )
                        })}
                      </FormGroup>
                    </Box>
                  ))}
                </Box>
              )}

              {errors.permissionCodes && (
                <FormHelperText error sx={{ mx: 0, mt: 1.5 }}>
                  {errors.permissionCodes.message}
                </FormHelperText>
              )}
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2.5, md: 3 },
          py: 2.5,
          gap: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper
        }}
      >
        <Button
          onClick={handleClose}
          color="inherit"
          disabled={isSubmitting}
          sx={{
            borderRadius: '999px',
            px: 2.5,
            fontWeight: 700
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-workspace-form"
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{
            minWidth: 150,
            borderRadius: '999px',
            px: 3,
            fontWeight: 800,
            boxShadow: `0 8px 22px ${alpha(theme.palette.primary.main, 0.26)}`
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create role'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateWorkspaceRoleModal
