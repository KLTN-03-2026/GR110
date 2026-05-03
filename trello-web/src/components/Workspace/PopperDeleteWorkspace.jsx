import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Popper from '@mui/material/Popper'
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

function PopperDeleteWorkspace({
  isDeleting,
  workspace,
  handleDeleteWorkspace
}) {
  const [inputValue, setInputValue] = useState('')
  const workspaceName = workspace?.title

  return (
    <PopupState variant="popper" popupId="demo-popup-popper">
      {(popupState) => (
        <div>
          <Typography
            {...bindToggle(popupState)}
            sx={{
              color: 'error.main',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: 700,
              '&:hover': { cursor: 'pointer' }
            }}
          >
            Delete this Workspace?
          </Typography>

          <Popper
            {...bindPopper(popupState)}
            placement="top-start"
            transition
            modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper
                  sx={(theme) => ({
                    width: 430,
                    color: theme.palette.text.primary,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.error.main}`
                  })}
                >
                  {/* Header */}
                  <Box
                    sx={(theme) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: `1px solid ${theme.palette.error.main}`,
                      px: 2,
                      py: 1.2,
                      position: 'relative',
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(198,40,40,0.15)'
                          : 'rgba(198,40,40,0.08)'
                    })}
                  >
                    <WarningAmberIcon
                      sx={{ color: 'error.main', fontSize: 18, mr: 1 }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: 'error.main',
                        fontSize: 14
                      }}
                    >
                      Delete Workspace
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => popupState.close()}
                      sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        color: theme.palette.text.primary,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        p: '2px'
                      })}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Warning Banner */}
                  <Box
                    sx={(theme) => ({
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(198,40,40,0.18)'
                          : 'rgba(198,40,40,0.08)',
                      border: `1px solid ${theme.palette.error.main}`,
                      borderRadius: 1,
                      mx: 2,
                      mt: 2,
                      px: 1.5,
                      py: 1,
                      display: 'flex',
                      gap: 1,
                      alignItems: 'flex-start'
                    })}
                  >
                    <WarningAmberIcon
                      sx={{
                        color: 'error.main',
                        fontSize: 18,
                        mt: '1px',
                        flexShrink: 0
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: 'error.main',
                        fontWeight: 600,
                        lineHeight: 1.5
                      }}
                    >
                      This action will permanently delete all Workspace data and
                      cannot be restored.
                    </Typography>
                  </Box>

                  {/* Body */}
                  <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        mb: 1.5,
                        color: 'text.primary'
                      }}
                    >
                      Enter the Workspace name "{workspaceName}" to confirm
                      deletion
                    </Typography>

                    <Typography
                      sx={{ fontSize: 13, color: 'text.secondary', mb: 0.5 }}
                    >
                      Important notices:
                    </Typography>

                    <List dense disablePadding sx={{ mb: 1.5 }}>
                      {[
                        {
                          text: 'All data will be permanently deleted and cannot be undone.',
                          highlight: true
                        },
                        {
                          text: 'All boards in this Workspace will be closed.',
                          highlight: false
                        },
                        {
                          text: 'Board admins can reopen boards.',
                          highlight: false
                        },
                        {
                          text: 'Members will not be able to interact with closed boards.',
                          highlight: false
                        }
                      ].map((item, i) => (
                        <ListItem
                          key={i}
                          disablePadding
                          sx={{ alignItems: 'flex-start', mb: 0.5 }}
                        >
                          <FiberManualRecordIcon
                            sx={{
                              fontSize: 8,
                              mt: '6px',
                              mr: 1,
                              flexShrink: 0,
                              color: item.highlight
                                ? 'error.main'
                                : 'text.primary'
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: item.highlight
                                ? 'error.main'
                                : 'text.secondary',
                              fontWeight: item.highlight ? 600 : 400
                            }}
                          >
                            {item.text}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>

                    <TextField
                      fullWidth
                      size="small"
                      placeholder={workspaceName}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      sx={(theme) => ({
                        mb: 1.5,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.04)'
                              : 'rgba(0,0,0,0.03)',
                          '& fieldset': {
                            borderColor:
                              inputValue && inputValue !== workspaceName
                                ? theme.palette.error.main
                                : theme.palette.divider
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.text.secondary
                          }
                        }
                      })}
                    />

                    {/* Match hint */}
                    {inputValue && inputValue !== workspaceName && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: 'error.main',
                          mb: 1,
                          mt: -1
                        }}
                      >
                        Workspace name does not match.
                      </Typography>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      disabled={inputValue !== workspaceName || isDeleting}
                      onClick={handleDeleteWorkspace}
                      sx={(theme) => ({
                        mb: 1,
                        bgcolor:
                          inputValue === workspaceName
                            ? 'error.main'
                            : theme.palette.action.disabledBackground,
                        color:
                          inputValue === workspaceName
                            ? '#fff'
                            : theme.palette.text.disabled,
                        fontWeight: 700,
                        fontSize: 14,
                        textTransform: 'none',
                        py: 1,
                        '&:hover': { bgcolor: 'error.dark' },
                        '&.Mui-disabled': {
                          bgcolor: theme.palette.action.disabledBackground,
                          color: theme.palette.text.disabled
                        }
                      })}
                    >
                      {isDeleting
                        ? 'Deleting...'
                        : '🗑 Permanently Delete Workspace'}
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
      )}
    </PopupState>
  )
}

export default PopperDeleteWorkspace
