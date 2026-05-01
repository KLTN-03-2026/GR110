import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import dayjs from 'dayjs'
import CardDatesPopoverContent from '~/components/Card/CardDatesPopoverContent'

function CardDateBadge({
  clickable,
  startedAt,
  dueAt,
  isCompleted,
  handleUpdate
}) {
  const [anchorEl, setAnchorEl] = useState(null)

  if (!startedAt && !dueAt) return null

  const handleOpen = (event) => {
    if (clickable) setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isOverdue = dueAt && dayjs().isAfter(dayjs(dueAt), 'day')
  const isDueToday = dueAt && dayjs().isSame(dayjs(dueAt), 'day')

  const label =
    startedAt && !dueAt
      ? `Started: ${dayjs(startedAt).format('MMM DD')}`
      : startedAt && dueAt
        ? `${dayjs(startedAt).format('MMM DD')} - ${dayjs(dueAt).format('MMM DD')}`
        : dayjs(dueAt).format('MMM DD')

  const backgroundColor = isCompleted
    ? '#4caf50'
    : isOverdue
      ? '#d32f2f'
      : isDueToday
        ? '#f57c00'
        : 'transparent'

  const hoverBackgroundColor = isCompleted
    ? '#45a049'
    : isOverdue
      ? '#c62828'
      : isDueToday
        ? '#e65100'
        : 'transparent'

  const isHighlighted = backgroundColor !== 'transparent'

  return (
    <Box>
      <Button
        size="small"
        onClick={handleOpen}
        startIcon={<AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />}
        sx={(theme) => ({
          textTransform: 'none',
          minWidth: 'fit-content',
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: 0.3,
          color: isHighlighted
            ? '#fff'
            : theme.palette.mode === 'dark'
              ? '#c7d1db'
              : '#44546f',
          bgcolor: isHighlighted
            ? backgroundColor
            : theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(9,30,66,0.08)',
          border: isHighlighted ? 'none' : '1px solid',
          borderColor: isHighlighted
            ? 'transparent'
            : theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(9,30,66,0.1)',
          transition: 'all 0.2s ease',
          boxShadow: isHighlighted
            ? theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(0,0,0,0.3)'
              : '0 2px 8px rgba(0,0,0,0.1)'
            : 'none',
          '&:hover': {
            bgcolor: isHighlighted
              ? hoverBackgroundColor
              : theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.12)'
                : 'rgba(9,30,66,0.12)',
            transform: isHighlighted ? 'translateY(-1px)' : 'none',
            boxShadow: isHighlighted
              ? theme.palette.mode === 'dark'
                ? '0 4px 12px rgba(0,0,0,0.4)'
                : '0 4px 12px rgba(0,0,0,0.15)'
              : 'none'
          }
        })}
      >
        {label}
      </Button>

      <CardDatesPopoverContent
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        startedAt={startedAt}
        dueAt={dueAt}
        handleUpdate={handleUpdate}
      />
    </Box>
  )
}

export default CardDateBadge
