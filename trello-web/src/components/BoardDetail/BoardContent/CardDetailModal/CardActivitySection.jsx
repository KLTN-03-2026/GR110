import moment from 'moment'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useMemo, useState } from 'react'
import { Button } from '@mui/material'
import { useSelector } from 'react-redux'

function CardActivitySection({ data, handler }) {
  const { comments = [], logs = [] } = data
  const { handleAddComment, handleDeleteComment } = handler
  const [comment, setComment] = useState('')

  const boardMembers = useSelector((state) => state.activeBoard?.members || [])

  const memberMap = useMemo(() => {
    return new Map(boardMembers.map((item) => [item._id?.toString(), item]))
  }, [boardMembers])

  const onSave = async () => {
    const value = comment.trim()
    if (!value) return
    await handleAddComment(value)
    setComment('')
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Comment input */}
      <Box
        sx={{
          px: 1.5,
          py: 1.5,
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(9,30,66,0.02)'
        }}
      >
        <TextField
          fullWidth
          placeholder="Write a comment..."
          variant="outlined"
          multiline
          minRows={2}
          maxRows={6}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSave()
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              alignItems: 'flex-start',
              borderRadius: 2,
              bgcolor: 'background.paper',
              '&.Mui-focused fieldset': {
                borderWidth: '1px'
              },
              '&:hover fieldset': {
                borderColor: 'primary.main'
              }
            },
            '& .MuiOutlinedInput-input': {
              fontSize: 14,
              lineHeight: 1.55,
              padding: '10px 12px'
            }
          }}
        />

        {comment.trim() && (
          <Box
            sx={{
              mt: 1.5,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1
            }}
          >
            <Button
              variant="text"
              size="small"
              onClick={() => setComment('')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={onSave}
              disabled={!comment.trim()}
              sx={{ textTransform: 'none', px: 2, fontWeight: 600 }}
            >
              Comment
            </Button>
          </Box>
        )}
      </Box>

      {/* Comments */}
      <Box sx={{ mt: 3 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            mb: 2,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}
        >
          Comments ({comments.length})
        </Typography>

        {!comments.length && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              color: 'text.secondary',
              fontSize: 13
            }}
          >
            No comments yet. Start the conversation.
          </Box>
        )}

        {comments.map((comment) => (
          <Box
            key={comment._id}
            sx={{
              display: 'flex',
              gap: 1.5,
              mt: 2,
              alignItems: 'flex-start'
            }}
          >
            <Tooltip title={comment?.user?.displayName || ''} placement="top">
              <Avatar
                alt={comment?.user?.displayName || ''}
                src={comment?.user?.avatar || ''}
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 2px 4px rgba(0,0,0,0.3)'
                      : '0 1px 3px rgba(0,0,0,0.08)'
                }}
              >
                {comment?.user?.displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Tooltip>

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.03)'
                    : 'background.paper',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'text.disabled'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  mb: 0.75
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: 'text.primary'
                    }}
                  >
                    {comment?.user?.displayName}
                  </Typography>

                  <Typography
                    component="span"
                    sx={{
                      fontSize: 12,
                      color: 'text.secondary',
                      px: 0.8,
                      py: 0.2,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(9,30,66,0.06)'
                    }}
                  >
                    {moment(comment?.createdAt).fromNow()}
                  </Typography>
                </Box>

                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteComment(comment)}
                  sx={{
                    textTransform: 'none',
                    minWidth: 'fit-content',
                    px: 0.75,
                    py: 0.25,
                    lineHeight: 1.2,
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  Delete
                </Button>
              </Box>

              <Typography
                component="p"
                sx={{
                  m: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'text.primary',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {comment?.content}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Activity logs */}
      {!!logs.length && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ my: 2 }} />

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              mb: 2,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}
          >
            Activity
          </Typography>

          {logs.map((log) => {
            const member = memberMap.get(log.authorId?.toString())
            const displayName =
              member?.user?.displayName || member?.displayName || 'Unknown user'
            const avatar = member?.user?.avatar || member?.avatar || ''

            return (
              <Box
                key={log._id}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  mt: 2,
                  alignItems: 'flex-start',
                  pb: 1.5,
                  '&:not(:last-child)': {
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }
                }}
              >
                <Tooltip title={displayName} placement="top">
                  <Avatar
                    alt={displayName}
                    src={avatar}
                    sx={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 1px 3px rgba(0,0,0,0.3)'
                          : '0 1px 2px rgba(0,0,0,0.06)'
                    }}
                  >
                    {displayName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </Tooltip>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      wordBreak: 'break-word',
                      color: 'text.primary'
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 700, mr: 0.5 }}>
                      {displayName}
                    </Box>
                    {log.content}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 12,
                      color: 'text.secondary'
                    }}
                  >
                    {moment(log.createdAt).fromNow()}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default CardActivitySection
