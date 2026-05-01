import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import CardDateBadge from '~/components/BoardDetail/BoardContent/CardDateBadge'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import Box from '@mui/material/Box'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import { useSelector } from 'react-redux'
import BoardMemberGroup from '../BoardDetail/BoardBar/BoardMemberGroup'
import { BOARD_LABEL_COLORS } from '~/constant/labelBackgroundColor'
import { memo, useMemo } from 'react'

function CardBadge({ card }) {
  const hasDateBadge = !!(card?.startedAt || card?.dueAt)
  const hasTaskBadge = (card?.taskCount || 0) > 0
  const hasDescriptionBadge = !!card?.isHasDescription
  const hasCommentBadge = (card?.commentCount || 0) > 0
  const hasMember = card?.memberIds?.length > 0
  const hasAttachment = card?.attachmentCount > 0
  const hasLabels = card?.labelIds?.length > 0
  const hasBadges =
    hasDateBadge ||
    hasTaskBadge ||
    hasDescriptionBadge ||
    hasCommentBadge ||
    hasMember ||
    hasAttachment ||
    hasLabels

  const boardMember = useSelector((state) => state.activeBoard.members)
  const boardLabel = useSelector((state) => state.activeBoard.labels)

  const cardMember = useMemo(() => {
    if (!hasMember) return []
    return card.memberIds
      .map((id) =>
        boardMember.find((item) => item._id?.toString() === id?.toString())
      )
      .filter(Boolean)
  }, [hasMember, card.memberIds, boardMember])

  const cardLabel = useMemo(() => {
    if (!hasLabels) return []
    return card.labelIds
      .map((id) =>
        boardLabel.find((item) => item._id?.toString() === id?.toString())
      )
      .filter(Boolean)
  }, [hasLabels, card.labelIds, boardLabel])

  if (!hasBadges) return null

  const neutralBadgeSx = (theme) => ({
    height: 24,
    px: 0.85,
    borderRadius: 1.5,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0.5,
    color: theme.palette.mode === 'dark' ? '#c7d1db' : '#44546f',
    bgcolor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.06)'
        : 'rgba(9,30,66,0.06)',
    border:
      theme.palette.mode === 'dark'
        ? '1px solid rgba(255,255,255,0.05)'
        : '1px solid rgba(9,30,66,0.08)',
    transition: 'background-color 0.16s ease, border-color 0.16s ease',
    '&:hover': {
      bgcolor:
        theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.11)'
          : 'rgba(9,30,66,0.1)'
    }
  })

  return (
    <Box
      sx={{
        mt: 1.05,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 0.65
      }}
    >
      {hasLabels && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            width: '100%'
          }}
        >
          {cardLabel.map((label) => {
            const colorConfig =
              BOARD_LABEL_COLORS[label.color] || BOARD_LABEL_COLORS.none
            const labelTitle = label.title || label.name || ''

            return (
              <Tooltip key={label._id} title={labelTitle || label.color}>
                <Box
                  sx={(theme) => ({
                    minWidth: 50,
                    maxWidth: 238,
                    height: 18,
                    px: labelTitle ? 1 : 0,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: labelTitle ? 'flex-start' : 'center',
                    bgcolor: colorConfig[theme.palette.mode],
                    color: label.color === 'yellow' ? '#172b4d' : '#ffffff',
                    overflow: 'hidden',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? 'inset 0 0 0 1px rgba(255,255,255,0.08)'
                        : 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                  })}
                >
                  {labelTitle && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {labelTitle}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            )
          })}
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.55
        }}
      >
        {hasDateBadge && (
          <Box
            sx={(theme) => ({
              '& .MuiButton-root': {
                height: 24,
                borderRadius: 1.5,
                px: 0.85,
                py: 0,
                lineHeight: 1,
                fontSize: 12,
                border:
                  theme.palette.mode === 'dark'
                    ? '1px solid rgba(255,255,255,0.05)'
                    : '1px solid rgba(9,30,66,0.08)'
              }
            })}
          >
            <CardDateBadge
              startedAt={card?.startedAt}
              dueAt={card?.dueAt}
              isCompleted={card?.isCompleted}
              clickable={false}
            />
          </Box>
        )}

        {hasTaskBadge && (
          <Tooltip title="Checklist items">
            <Box
              sx={(theme) => ({
                ...neutralBadgeSx(theme),
                fontWeight: 600,
                color:
                  card.completedTaskCount === card.taskCount
                    ? theme.palette.mode === 'dark'
                      ? '#000'
                      : '#fff'
                    : theme.palette.mode === 'dark'
                      ? '#c7d1db'
                      : '#44546f',
                bgcolor:
                  card.completedTaskCount === card.taskCount
                    ? '#94C748'
                    : neutralBadgeSx(theme).bgcolor,
                border:
                  card.completedTaskCount === card.taskCount ? 'none' : null,
                '&:hover': {
                  bgcolor:
                    card.completedTaskCount === card.taskCount
                      ? '#86b63f'
                      : neutralBadgeSx(theme).bgcolor
                }
              })}
            >
              <CheckBoxOutlinedIcon sx={{ fontSize: 15 }} />
              {card.completedTaskCount}/{card.taskCount}
            </Box>
          </Tooltip>
        )}

        {hasDescriptionBadge && (
          <Tooltip title="This card has a description.">
            <Box sx={(theme) => neutralBadgeSx(theme)}>
              <SubjectRoundedIcon sx={{ fontSize: 15 }} />
            </Box>
          </Tooltip>
        )}

        {hasCommentBadge && (
          <Tooltip title="Comments">
            <Box sx={(theme) => neutralBadgeSx(theme)}>
              <ChatOutlinedIcon sx={{ fontSize: 15 }} />
              <Typography
                component="span"
                sx={{ fontSize: 12.5, fontWeight: 600 }}
              >
                {card.commentCount}
              </Typography>
            </Box>
          </Tooltip>
        )}

        {hasAttachment && (
          <Tooltip title="Attachments">
            <Box sx={(theme) => neutralBadgeSx(theme)}>
              <AttachFileOutlinedIcon sx={{ fontSize: 15 }} />
              <Typography
                component="span"
                sx={{ fontSize: 12.5, fontWeight: 600 }}
              >
                {card.attachmentCount}
              </Typography>
            </Box>
          </Tooltip>
        )}

        {hasMember && (
          <Box sx={{ ml: 'auto' }}>
            <BoardMemberGroup members={cardMember} limit={4} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

const MemoizedCardBadge = memo(CardBadge)

export default MemoizedCardBadge
