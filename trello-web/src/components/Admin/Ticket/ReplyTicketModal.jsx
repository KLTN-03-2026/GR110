import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'

export default function ReplyTicketModal({
  open,
  ticket,
  onClose,
  onSubmit
}) {
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setReplyContent('')
      setLoading(false)
    }
  }, [open])

  const handleSubmit = async () => {
    if (!ticket || !replyContent.trim() || loading) return

    try {
      setLoading(true)

      await onSubmit({
        ticketId: ticket._id,
        replyContent: replyContent.trim()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>
        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
          Reply Ticket
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: '20px !important' }}>
        <Stack spacing={2}>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            Reply to: <strong>{ticket?.email || '--'}</strong>
          </Typography>

          <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>
            {ticket?.title || '--'}
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={5}
            label='Reply content'
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={loading}
          />

          <Stack direction='row' spacing={1.5} justifyContent='flex-end'>
            <Button
              variant='outlined'
              onClick={onClose}
              disabled={loading}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Cancel
            </Button>

            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={!replyContent.trim() || loading}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 'none',
                minWidth: 120,
                '&:hover': { boxShadow: 'none' }
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ mr: 1, color: '#fff' }} />
                  Sending...
                </>
              ) : (
                'Send Reply'
              )}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}