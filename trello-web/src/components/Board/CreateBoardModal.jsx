import { useEffect, useMemo, useState } from 'react'
import Modal from '@mui/material/Modal'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import CloseIcon from '@mui/icons-material/Close'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PublicIcon from '@mui/icons-material/Public'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CheckIcon from '@mui/icons-material/Check'
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import { alpha, useTheme } from '@mui/material/styles'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { backgroundBoardList } from '~/constant/backgroundBoard'
import PopoverBoardColor from './PopoverBoardColor'
import { fetchBackgroundAPI } from '~/apis/board.api'
import AIGenerateBoardModal from './AIGenerateBoardModal'

const type = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  WORKSPACE: 'workspace'
}

const descriptionType = {
  PUBLIC:
    'Anyone on the internet can see this board. Only board members can edit.',
  PRIVATE:
    'Board members and Trello Workspace admins can see and edit this board.',
  WORKSPACE: 'All members of the Trello Workspace can see and edit this board.'
}

const alertConfig = {
  [type.PUBLIC]: {
    severity: 'warning',
    text: descriptionType.PUBLIC
  },
  [type.PRIVATE]: {
    severity: 'info',
    text: descriptionType.PRIVATE
  },
  [type.WORKSPACE]: {
    severity: 'success',
    text: descriptionType.WORKSPACE
  }
}

const visibilityOptions = [
  {
    value: type.PUBLIC,
    label: 'Public',
    icon: <PublicIcon fontSize="small" />,
    color: 'warning.main'
  },
  {
    value: type.PRIVATE,
    label: 'Private',
    icon: <LockOutlinedIcon fontSize="small" />,
    color: 'info.main'
  },
  {
    value: type.WORKSPACE,
    label: 'Workspace',
    icon: <Groups2OutlinedIcon fontSize="small" />,
    color: 'success.main'
  }
]

const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

function CreateBoardModal({ ui, handler }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [backgrounds, setBackgrounds] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedBackground, setSelectedBackground] = useState(null)

  const { handleClose, handleCreateBoard, isSubmitting } = handler
  const { isOpen } = ui
  const aiUi = ui.ai || { isOpen: false }
  const aiHandler = handler.ai || {}

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      visibility: type.PRIVATE,
      cover: {
        type: 'image',
        value: ''
      }
    }
  })

  const systemBackgrounds =
    backgrounds?.filter((item) => item.type === 'system') || []

  const previewSrc = useMemo(() => {
    if (selectedBackground?.image) return selectedBackground.image
    if (selectedBackground?.src) return selectedBackground.src
  }, [selectedBackground])

  const getBackground = async () => {
    try {
      const res = await fetchBackgroundAPI()
      const data = Array.isArray(res) ? res : res?.backgrounds || []
      const activeBackgrounds = data.filter(
        (item) => item.status === 'active' && !item.isDelete
      )

      setBackgrounds(activeBackgrounds)
      return activeBackgrounds
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      setBackgrounds([])
      return []
    }
  }

  useEffect(() => {
    if (!isOpen) return

    const onGetData = async () => {
      const activeBackgrounds = await getBackground()
      const firstBackground =
        activeBackgrounds?.find((item) => item.type === 'system') || null

      reset({
        title: '',
        description: '',
        visibility: type.PRIVATE,
        cover: {
          type: 'image',
          value: firstBackground?.image || ''
        }
      })

      setSelectedBackground(firstBackground)
    }

    onGetData()
  }, [isOpen, reset])

  const modalConfig = {
    'aria-labelledby': 'board-modal-title',
    closeAfterTransition: true,
    slots: { backdrop: Backdrop },
    slotProps: {
      backdrop: {
        timeout: 400
      }
    }
  }

  const handleOpenBackgroundPopover = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseBackgroundPopover = () => {
    setAnchorEl(null)
  }

  const openBackgroundPopover = Boolean(anchorEl)

  const handleSelectBackground = (item, coverType) => {
    setSelectedBackground(item)

    if (coverType === 'image') {
      setValue(
        'cover',
        {
          type: 'image',
          value: item.image
        },
        { shouldDirty: true, shouldValidate: true }
      )
    } else {
      setValue(
        'cover',
        {
          type: 'color',
          value: item.key
        },
        { shouldDirty: true, shouldValidate: true }
      )
    }

    handleCloseBackgroundPopover()
  }

  const onSubmit = (data) => {
    handleCreateBoard(data)
  }

  const handleOpenAIModal = () => {
    if (isSubmitting) return
    aiHandler.handleOpen?.()
  }

  const renderCreateBoardContent = () => (
    <Box sx={{ p: { xs: 2.25, sm: 3 } }}>
      <Box
        onClick={handleOpenAIModal}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          mb: 2.25,
          p: 2,
          cursor: isSubmitting ? 'default' : 'pointer',
          border: `1px solid ${alpha(theme.palette.warning.main, 0.24)}`,
          background: isDark
            ? 'linear-gradient(135deg, rgba(180,83,9,0.18), rgba(15,23,42,0.55))'
            : 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
          transition:
            'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
          '&:hover': {
            transform: isSubmitting ? 'none' : 'translateY(-1px)',
            borderColor: alpha(theme.palette.warning.main, 0.42),
            boxShadow: isDark
              ? '0 12px 28px rgba(180,83,9,0.16)'
              : '0 12px 28px rgba(217,119,6,0.12)'
          }
        }}
      >
        <Box
          sx={{
            ...dotPatternSx,
            backgroundImage: isDark
              ? 'radial-gradient(circle, rgba(251,191,36,0.10) 1px, transparent 1px)'
              : 'radial-gradient(circle, rgba(217,119,6,0.11) 1px, transparent 1px)'
          }}
        />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha(theme.palette.warning.main, isDark ? 0.18 : 0.12),
                color: isDark
                  ? theme.palette.warning.light
                  : theme.palette.warning.dark,
                flexShrink: 0
              }}
            >
              <AutoAwesomeRoundedIcon />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
                Generate this board with AI
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', lineHeight: 1.5 }}
              >
                Describe your project and let AI create columns and cards.
              </Typography>
            </Box>
          </Stack>

          <Button
            type="button"
            variant="contained"
            onClick={(event) => {
              event.stopPropagation()
              handleOpenAIModal()
            }}
            disabled={isSubmitting}
            startIcon={<AutoAwesomeRoundedIcon />}
            sx={{
              minWidth: 126,
              borderRadius: '999px',
              textTransform: 'none',
              fontWeight: 800,
              bgcolor: '#d97706',
              boxShadow: '0 8px 22px rgba(217,119,6,0.22)',
              '&:hover': { bgcolor: '#b45309' }
            }}
          >
            Use AI
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: 158,
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          mb: 2.25,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark
            ? alpha(theme.palette.common.white, 0.04)
            : alpha(theme.palette.primary.main, 0.04)
        }}
      >
        {previewSrc && (
          <Box
            component="img"
            src={previewSrc}
            alt={selectedBackground?.title || 'board-background'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        )}

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.64) 100%)'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            component="img"
            src="https://trello.com/assets/14cda5dc635d1f13bc48.svg"
            alt="board preview"
            sx={{
              width: 220,
              maxWidth: '70%',
              filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.24))'
            }}
          />
        </Box>
      </Box>

      <Stack spacing={1.25}>
        <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
          Background
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: 1
          }}
        >
          {systemBackgrounds.slice(0, 6).map((item) => {
            const isSelected = selectedBackground?.image === item.image

            return (
              <Box
                key={item._id}
                sx={{
                  position: 'relative',
                  height: 48,
                  cursor: 'pointer'
                }}
                onClick={() => handleSelectBackground(item, 'image')}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    display: 'block',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    transition: 'transform 0.16s ease',
                    '&:hover': { transform: 'translateY(-1px)' }
                  }}
                />

                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 2
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 16 }} />
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: 1
          }}
        >
          {backgroundBoardList.slice(0, 5).map((item) => {
            const isSelected = selectedBackground?.key === item.key

            return (
              <Box
                key={item.key}
                sx={{
                  position: 'relative',
                  height: 48,
                  cursor: 'pointer'
                }}
                onClick={() => handleSelectBackground(item, 'color')}
              >
                <Box
                  component="img"
                  src={item.src}
                  alt={item.key}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    display: 'block',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    transition: 'transform 0.16s ease',
                    '&:hover': { transform: 'translateY(-1px)' }
                  }}
                />

                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 2
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 16 }} />
                  </Box>
                )}
              </Box>
            )
          })}

          <Box
            onClick={handleOpenBackgroundPopover}
            sx={{
              height: 48,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: isDark
                ? alpha(theme.palette.common.white, 0.06)
                : alpha(theme.palette.common.black, 0.04),
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                bgcolor: 'action.selected'
              }
            }}
          >
            <MoreHorizIcon />
          </Box>
        </Box>

        <PopoverBoardColor
          handleCloseBackgroundPopover={handleCloseBackgroundPopover}
          handleSelectBackground={handleSelectBackground}
          anchorEl={anchorEl}
          selectedBackground={selectedBackground}
          openBackgroundPopover={openBackgroundPopover}
          systemBackgrounds={systemBackgrounds}
          customBackgrounds={[]}
          getBackground={getBackground}
          showCustom={false}
        />
      </Stack>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5} sx={{ mt: 3 }}>
          <Box>
            <TextField
              fullWidth
              label="Title"
              placeholder="Enter board title..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AbcIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              {...register('title', {
                required: FIELD_REQUIRED_MESSAGE,
                minLength: {
                  value: 1,
                  message: 'Min Length is 1 characters'
                },
                maxLength: {
                  value: 200,
                  message: 'Max Length is 200 characters'
                }
              })}
              error={!!errors.title}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px' }
              }}
            />
            <FieldErrorAlert errors={errors} fieldName="title" />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Description"
              placeholder="Write a short description for this board..."
              rows={3}
              multiline
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ alignSelf: 'flex-start', mt: 1.2 }}
                  >
                    <DescriptionOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              {...register('description', {
                maxLength: {
                  value: 4000,
                  message: 'Max Length is 4000 characters'
                }
              })}
              error={!!errors.description}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px' }
              }}
            />
            <FieldErrorAlert errors={errors} fieldName="description" />
          </Box>

          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.25,
                    fontWeight: 800,
                    color: 'text.primary'
                  }}
                >
                  Visibility
                </Typography>

                <RadioGroup
                  row
                  {...field}
                  value={field.value}
                  onChange={(_, value) => field.onChange(value)}
                  sx={{
                    gap: 1.25,
                    flexWrap: 'wrap'
                  }}
                >
                  {visibilityOptions.map((item) => {
                    const selected = field.value === item.value

                    return (
                      <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio size="small" />}
                        label={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <Box
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: selected
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : 'action.hover',
                                color: selected ? item.color : 'text.secondary'
                              }}
                            >
                              {item.icon}
                            </Box>
                            <Typography sx={{ fontWeight: 700 }}>
                              {item.label}
                            </Typography>
                          </Box>
                        }
                        sx={{
                          m: 0,
                          height: 54,
                          minWidth: 170,
                          flex: '1 1 170px',
                          px: 1.5,
                          py: 1.2,
                          borderRadius: '14px',
                          border: '1px solid',
                          borderColor: selected ? item.color : 'divider',
                          bgcolor: selected ? 'action.selected' : 'transparent',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      />
                    )
                  })}
                </RadioGroup>

                {field.value && (
                  <Alert
                    severity={alertConfig[field.value].severity}
                    sx={{
                      mt: 2,
                      borderRadius: '12px'
                    }}
                  >
                    {alertConfig[field.value].text}
                  </Alert>
                )}
              </Box>
            )}
          />

          <Divider />

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="flex-end"
            spacing={1.5}
            sx={{ pt: 0.5 }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              sx={{
                minWidth: 110,
                borderRadius: '999px',
                textTransform: 'none',
                fontWeight: 700
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                minWidth: 132,
                borderRadius: '999px',
                textTransform: 'none',
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(37,99,235,0.24)'
              }}
            >
              Create board
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )

  return (
    <>
      <Modal open={isOpen} onClose={handleClose} {...modalConfig}>
        <Fade in={isOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '94%', sm: 680 },
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '22px',
              bgcolor: 'background.paper',
              boxShadow: isDark
                ? '0 28px 90px rgba(0,0,0,0.52)'
                : '0 28px 90px rgba(15,23,42,0.20)',
              outline: 'none'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                px: { xs: 2.25, sm: 3 },
                py: 2.25,
                color: 'white',
                background: 'linear-gradient(135deg, #0f172a, #1d4ed8)'
              }}
            >
              <Box sx={dotPatternSx} />

              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                spacing={2}
                sx={{ position: 'relative', zIndex: 1 }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.16)'
                    }}
                  >
                    <ViewKanbanRoundedIcon
                      sx={{ color: '#93c5fd', fontSize: 22 }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      id="board-modal-title"
                      sx={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.3 }}
                    >
                    Create board
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.25,
                        color: 'rgba(255,255,255,0.72)',
                        fontSize: '0.82rem',
                        lineHeight: 1.5
                      }}
                    >
                    Choose a cover, add the board details, and set who can
                    access it.
                    </Typography>
                  </Box>
                </Stack>

                <IconButton
                  onClick={handleClose}
                  size="small"
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.10)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>

            {renderCreateBoardContent()}
          </Box>
        </Fade>
      </Modal>

      <AIGenerateBoardModal
        isOpen={aiUi.isOpen}
        handleClose={aiHandler.handleClose || (() => {})}
        handleGenerate={aiHandler.handleGenerate || (async () => null)}
        isSubmitting={aiHandler.isSubmitting ?? isSubmitting}
      />
    </>
  )
}

export default CreateBoardModal
