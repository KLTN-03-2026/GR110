import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { BOARD_LABEL_COLORS } from '~/constant/labelBackgroundColor'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

function CardLabelGroup({ labelIds = [] }) {
  const boardLabel = useSelector((state) => state.activeBoard.labels)

  if (labelIds.length === 0) return

  const cardLabel = labelIds
    ?.map((id) =>
      boardLabel.find((item) => item._id?.toString() === id?.toString())
    )
    .filter(Boolean)

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <LocalOfferOutlinedIcon sx={{ fontSize: 22 }} />
        <Typography variant="span" sx={{ fontWeight: 700, fontSize: '16px' }}>
          Labels
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
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
                  minWidth: 'fit-content',
                  maxWidth: '100%',
                  height: 32,
                  px: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: colorConfig[theme.palette.mode],
                  color: label.color === 'yellow' ? '#172b4d' : '#ffffff',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? 'none'
                      : '0 1px 3px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0 2px 8px rgba(0,0,0,0.2)'
                        : '0 2px 8px rgba(0,0,0,0.12)',
                    cursor: 'default'
                  }
                })}
              >
                {labelTitle && (
                  <Typography
                    variant="span"
                    sx={{
                      fontSize: 13,
                      fontWeight: 500,
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
    </Box>
  )
}

export default CardLabelGroup
