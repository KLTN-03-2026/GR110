import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import BoardTab from '../BoardModal/Tab/Tab'
import CloseIcon from '@mui/icons-material/Close'
import modalConfig from '~/config/modalConfig'
import { Fade } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: 500,
    md: 1000
  },
  height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column'
}

export default function BoardModal({ boardModal }) {
  const { open, handleClose } = boardModal

  return (
    <Modal {...modalConfig} open={open} onClose={handleClose}>
      <Fade in={open}>
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 28,
              right: 28
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" component="h2">
            Board Details
          </Typography>

          <Box sx={{ mt: 2, flex: 1, overflow: 'auto', minHeight: 0 }}>
            <BoardTab />
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}
