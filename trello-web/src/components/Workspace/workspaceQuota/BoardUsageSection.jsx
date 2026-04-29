import { useTheme } from '@emotion/react'
import { alpha, Box, Chip, Paper, Stack, Typography } from '@mui/material'
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded'

function BoardUsageMetric({ label, value, color }) {
  return (
    <Chip
      size="small"
      label={`${label}: ${Number(value || 0).toLocaleString()}`}
      sx={{
        height: 26,
        fontWeight: 800,
        color,
        width: '100%',
        bgcolor: alpha(color, 0.08),
        border: `1px solid ${alpha(color, 0.16)}`,
        justifyContent: 'center',
        '& .MuiChip-label': {
          px: 1
        }
      }}
    />
  )
}

export function BoardUsageSection({ items }) {
  const theme = useTheme()
  const color = '#0f766e'

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        boxShadow: '0 2px 12px rgba(15,23,42,0.04)',
        overflow: 'hidden',
        gridColumn: { xs: 'auto', lg: '1 / -1' }
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.04)'
              : '#f8fafc',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              color,
              bgcolor: alpha(color, 0.1)
            }}
          >
            <ViewKanbanRoundedIcon fontSize="small" />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800 }}>Board usage</Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 0.25 }}
            >
              Current roles, columns, and cards in each board.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          p: 1.5,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
          gap: 1
        }}
      >
        {items.length ? (
          items.map(([boardName, usage]) => (
            <Box
              key={boardName}
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: '12px',
                border: `1px solid ${theme.palette.divider}`,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.025)'
                    : '#ffffff'
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'minmax(140px, 1fr) repeat(3, minmax(86px, 96px))'
                  },
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ minWidth: 0 }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '8px',
                      display: 'grid',
                      placeItems: 'center',
                      color,
                      bgcolor: alpha(color, 0.1),
                      flexShrink: 0
                    }}
                  >
                    <ViewKanbanRoundedIcon sx={{ fontSize: 15 }} />
                  </Box>

                  <Typography sx={{ fontWeight: 800 }} noWrap>
                    {boardName}
                  </Typography>
                </Stack>

                <BoardUsageMetric
                  label="Roles"
                  value={usage.boardRolesUsed}
                  color="#2563eb"
                />
                <BoardUsageMetric
                  label="Columns"
                  value={usage.columnsUsed}
                  color="#ea580c"
                />
                <BoardUsageMetric
                  label="Cards"
                  value={usage.cardsUsed}
                  color="#7c3aed"
                />
              </Box>
            </Box>
          ))
        ) : (
          <Box
            sx={{
              p: 2,
              borderRadius: '14px',
              border: `1px dashed ${alpha(color, 0.28)}`,
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              No boards found in this workspace.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  )
}
