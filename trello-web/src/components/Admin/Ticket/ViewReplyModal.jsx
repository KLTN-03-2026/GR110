import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography
} from '@mui/material'

function formatDateTime(value) {
  if (!value) return '--'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

export default function ViewReplyModal({
  open,
  ticket,
  onClose
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
          Reply Content
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: '20px !important' }}>
        <Stack spacing={2}>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            Ticket: <strong>{ticket?.title || '--'}</strong>
          </Typography>

          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            Replied at: {formatDateTime(ticket?.repliedAt)}
          </Typography>

          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(15,23,42,0.03)'
            })}
          >
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.7,
                color: 'text.primary',
                whiteSpace: 'pre-wrap'
              }}
            >
              {ticket?.replyContent || '--'}
            </Typography>
          </Box>

          <Stack direction='row' justifyContent='flex-end'>
            <Button
              variant='contained'
              onClick={onClose}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' }
              }}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}