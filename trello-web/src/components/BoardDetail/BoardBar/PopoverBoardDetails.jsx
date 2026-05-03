import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import BoardModal from '../BoardModal/BoardModal'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, IconButton, Divider } from '@mui/material'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import CloseIcon from '@mui/icons-material/Close'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

export default function PopoverBoardDetails({
  boardPopover,
  boardModal,
  columnCollapseMode,
  onCollapseAllColumns,
  onExpandAllColumns
}) {
  const {
    anchorEl,
    openMoreOption,
    handleCloseMoreOption,
    handleOpenLabelList,
    handleOpenActivityList,
    handleOpenArchivedList
  } = boardPopover

  const { handleOpen, open } = boardModal

  const isAllCollapsed = columnCollapseMode === 'collapse'

  const handleOpenModal = () => {
    handleCloseMoreOption()
    handleOpen()
  }

  const handleToggleLists = () => {
    if (isAllCollapsed) {
      onExpandAllColumns()
    } else {
      onCollapseAllColumns()
    }
  }

  const menuItemSx = {
    width: '100%',
    px: 1.5,
    py: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 1.25,
    borderRadius: 1,
    textTransform: 'none',
    color: (theme) => (theme.palette.mode === 'dark' ? '#d1d5db' : '#172b4d'),
    transition: 'background-color 0.15s ease',
    '& .MuiSvgIcon-root': {
      color: (theme) => (theme.palette.mode === 'dark' ? '#9ca3af' : '#626f86')
    },
    '&:hover': {
      bgcolor: (theme) =>
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#f1f2f4'
    }
  }

  const subTextSx = {
    mt: 0.25,
    fontSize: 12,
    lineHeight: 1.25,
    color: (theme) => (theme.palette.mode === 'dark' ? '#9ca3af' : '#626f86')
  }

  return (
    <div>
      <Popover
        open={openMoreOption}
        anchorEl={anchorEl}
        onClose={handleCloseMoreOption}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 320,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 8px 20px rgba(0,0,0,0.35)'
                : '0 8px 20px rgba(9,30,66,0.12)',
            border: (theme) =>
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(9,30,66,0.13)'
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 1.25,
            px: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#f1f5f9' : '#172b4d'
            }}
          >
            Menu
          </Typography>

          <IconButton
            onClick={handleCloseMoreOption}
            size="small"
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 28,
              height: 28,
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#9ca3af' : '#626f86',
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.06)'
                    : '#f1f2f4'
              }
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Divider
          sx={{
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(9,30,66,0.13)'
          }}
        />

        <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
          <Button onClick={handleOpenModal} sx={menuItemSx}>
            <InfoOutlinedIcon sx={{ fontSize: 19 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                About this board
              </Typography>

              <Typography sx={subTextSx}>Board info and settings</Typography>
            </Box>
          </Button>

          <Button sx={menuItemSx} onClick={handleOpenLabelList}>
            <LocalOfferOutlinedIcon sx={{ fontSize: 19 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              Labels
            </Typography>
          </Button>

          <Button sx={menuItemSx} onClick={handleOpenActivityList}>
            <HistoryOutlinedIcon sx={{ fontSize: 19 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              Activity
            </Typography>
          </Button>

          <Button sx={menuItemSx} onClick={handleOpenArchivedList}>
            <Inventory2OutlinedIcon sx={{ fontSize: 19 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              Archived items
            </Typography>
          </Button>

          <Divider
            sx={{
              my: 0.75,
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(9,30,66,0.13)'
            }}
          />

          <Button onClick={handleToggleLists} sx={menuItemSx}>
            {isAllCollapsed ? (
              <OpenInFullOutlinedIcon sx={{ fontSize: 19 }} />
            ) : (
              <CloseFullscreenIcon sx={{ fontSize: 19 }} />
            )}

            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {isAllCollapsed ? 'Expand all lists' : 'Collapse all lists'}
            </Typography>
          </Button>
        </Box>
      </Popover>

      {open && <BoardModal boardModal={boardModal} />}
    </div>
  )
}
