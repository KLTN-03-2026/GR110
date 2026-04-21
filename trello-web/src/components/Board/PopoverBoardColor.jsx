import { Box, Button, Popover, Typography, IconButton } from '@mui/material'
import { backgroundBoardList } from '~/constant/backgroundBoard'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CloseIcon from '@mui/icons-material/Close'
import { createBackground, deleteBackground } from '~/apis/board.api'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useState } from 'react'

export function PopoverBoardColor({
  handleCloseBackgroundPopover,
  handleSelectBackground,
  anchorEl,
  selectedBackground,
  openBackgroundPopover,
  systemBackgrounds,
  customBackgrounds,
  getBackground,
  showCustom = true
}) {
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const board = useSelector((state) => state.activeBoard.board)

  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [confirmAnchorEl, setConfirmAnchorEl] = useState(null)
  const [selectedCustomBackground, setSelectedCustomBackground] = useState(null)

  const openCustomMenu = Boolean(menuAnchorEl)
  const openConfirmDelete = Boolean(confirmAnchorEl)

  const handleOpenCustomMenu = (event, item) => {
    event.stopPropagation()
    setMenuAnchorEl(event.currentTarget)
    setSelectedCustomBackground(item)
  }

  const handleCloseCustomMenu = () => {
    setMenuAnchorEl(null)
  }

  const handleOpenDeleteConfirm = () => {
    setConfirmAnchorEl(menuAnchorEl)
    setMenuAnchorEl(null)
  }

  const handleCloseDeleteConfirm = () => {
    setConfirmAnchorEl(null)
  }

  const handleUploadCustomBackground = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await createBackground({ boardId, payload: formData })

    dispatch(
      updateCurrentActiveBoard({
        ...board,
        ...res.metadata
      })
    )

    await getBackground?.()
    event.target.value = ''
  }

  const handleDeleteCustomBackground = async () => {
    if (!selectedCustomBackground?._id) return

    await deleteBackground({ boardId: boardId, backgroundId: selectedCustomBackground._id })

    dispatch(fetchBoardDetailsAPI(boardId))

    await getBackground?.()

    if (selectedBackground?.image === selectedCustomBackground?.image) {
      handleCloseBackgroundPopover?.()
    }

    setConfirmAnchorEl(null)
    setMenuAnchorEl(null)
    setSelectedCustomBackground(null)
  }

  return (
    <>
      <Popover
        open={openBackgroundPopover}
        anchorEl={anchorEl}
        onClose={handleCloseBackgroundPopover}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        PaperProps={{
          sx: {
            ml: 1,
            p: 2,
            borderRadius: 3,
            width: 380
          }
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 1.5, textAlign: 'center' }}>
          Board background
        </Typography>

        <Box mb={2}>Photos</Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1
          }}
        >
          {systemBackgrounds?.map((item) => {
            const isSelected = selectedBackground?.image === item.image

            return (
              <Box
                key={item._id}
                sx={{
                  position: 'relative',
                  width: 110,
                  height: 60,
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                onClick={() => handleSelectBackground(item, 'image')}
              >
                <Box
                  component='img'
                  src={item.image}
                  alt={item._id}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 2,
                    display: 'block',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent'
                  }}
                />

                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
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

        <Box mb={2} mt={2}>
          Colors
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1
          }}
        >
          {backgroundBoardList.map((item) => {
            const isSelected = selectedBackground?.key === item.key

            return (
              <Box
                key={item.key}
                sx={{
                  position: 'relative',
                  width: 110,
                  height: 60,
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                onClick={() => handleSelectBackground(item, 'color')}
              >
                <Box
                  component='img'
                  src={item.src}
                  alt={item.key}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 2,
                    display: 'block',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent'
                  }}
                />

                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
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

        {showCustom && (
          <>
            <Box mb={2} mt={2}>
              Custom
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1
              }}
            >
              <Button
                component='label'
                variant='contained'
                sx={{
                  width: 110,
                  height: 60,
                  minWidth: 110,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  backgroundColor: 'action.hover',
                  color: 'text.secondary',
                  boxShadow: 'none',
                  border: '1px dashed',
                  borderColor: 'divider',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    boxShadow: 'none'
                  }
                }}
              >
                <AddIcon sx={{ fontSize: 28 }} />
                <input
                  hidden
                  type='file'
                  accept='image/*'
                  onChange={handleUploadCustomBackground}
                />
              </Button>

              {customBackgrounds?.map((item) => {
                const isSelected = selectedBackground?.image === item.image

                return (
                  <Box
                    key={item._id}
                    sx={{
                      position: 'relative',
                      width: 110,
                      height: 60,
                      flexShrink: 0,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectBackground(item, 'image')}
                  >
                    <Box
                      component='img'
                      src={item.image}
                      alt={item.title || item._id}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 2,
                        display: 'block',
                        border: '2px solid',
                        borderColor: isSelected ? 'primary.main' : 'transparent'
                      }}
                    />

                    <IconButton
                      size='small'
                      onClick={(event) => handleOpenCustomMenu(event, item)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 24,
                        height: 24,
                        bgcolor: 'rgba(0,0,0,0.55)',
                        color: 'white',
                        zIndex: 2,
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.72)'
                        }
                      }}
                    >
                      <MoreHorizIcon sx={{ fontSize: 16 }} />
                    </IconButton>

                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 6,
                          right: 6,
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
          </>
        )}
      </Popover>

      <Popover
        open={openCustomMenu}
        anchorEl={menuAnchorEl}
        onClose={handleCloseCustomMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          sx: {
            mt: 0.75,
            minWidth: 220,
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#111827',
            color: '#f9fafb',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.35)'
          }
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.72)',
              letterSpacing: 0.2
            }}
          >
            Background actions
          </Typography>
        </Box>

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            startIcon={<DeleteOutlineIcon />}
            onClick={handleOpenDeleteConfirm}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 2,
              px: 1.25,
              py: 1,
              color: '#fca5a5',
              backgroundColor: 'transparent',
              '& .MuiButton-startIcon': {
                color: '#ef4444'
              },
              '&:hover': {
                backgroundColor: 'rgba(239,68,68,0.12)'
              }
            }}
          >
            Delete background
          </Button>
        </Box>
      </Popover>

      <Popover
        open={openConfirmDelete}
        anchorEl={confirmAnchorEl}
        onClose={handleCloseDeleteConfirm}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
        PaperProps={{
          sx: {
            ml: -1,
            width: 300,
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#2f3136',
            color: '#fff',
            boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.06)'
          }
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: '#f3f4f6'
            }}
          >
            Delete background?
          </Typography>

          <IconButton
            size='small'
            onClick={handleCloseDeleteConfirm}
            sx={{
              color: '#d1d5db'
            }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>

        <Box sx={{ px: 2, pb: 1.5 }}>
          <Typography
            sx={{
              fontSize: 14,
              lineHeight: 1.5,
              color: '#e5e7eb'
            }}
          >
            Deleting a background is permanent.
            <br />
            There is no undo.
          </Typography>
        </Box>

        <Box sx={{ px: 2, pb: 2 }}>
          <Button
            fullWidth
            onClick={handleDeleteCustomBackground}
            sx={{
              height: 44,
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 16,
              color: '#111827',
              backgroundColor: '#f87171',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#ef4444',
                boxShadow: 'none'
              }
            }}
          >
            Delete
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default PopoverBoardColor