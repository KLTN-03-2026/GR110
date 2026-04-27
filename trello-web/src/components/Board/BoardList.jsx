import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import CreateBoardModal from './CreateBoardModal'
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Divider from '@mui/material/Divider'
import { Link, useParams } from 'react-router-dom'
import { backgroundBoardList } from '~/constant/backgroundBoard'
import { alpha, useTheme } from '@mui/material/styles'

const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...'
}

function BoardList({ ui, data, handler }) {
  const { page, itemsPerPage } = ui
  const { boards, count } = data
  const { handleOpenCreateBoard } = handler
  const { workspaceId } = useParams()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const activeBoards = boards?.filter((b) => b.status === 'active') || []

  return (
    <>
      <Box
        sx={{
          borderRadius: '24px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark ? '#0f1623' : '#f6f8fc',
          boxShadow: isDark ? 'none' : '0 18px 48px rgba(15,23,42,0.08)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            px: { xs: 2.5, md: 3 },
            py: 2.5,
            background: isDark
              ? 'linear-gradient(135deg, rgba(30,64,175,0.28), rgba(15,23,42,0.72))'
              : 'linear-gradient(135deg, #eff6ff 0%, #ffffff 62%, #f8fafc 100%)',
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box
            sx={{
              ...dotPatternSx,
              backgroundImage: isDark
                ? 'radial-gradient(circle, rgba(147,197,253,0.10) 1px, transparent 1px)'
                : 'radial-gradient(circle, rgba(37,99,235,0.10) 1px, transparent 1px)'
            }}
          />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 8px 22px rgba(37,99,235,0.28)',
                  flexShrink: 0
                }}
              >
                <ViewKanbanRoundedIcon sx={{ color: 'white', fontSize: 21 }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: 0 }}
                >
                  Your Boards
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeBoards.length} active board
                  {activeBoards.length !== 1 ? 's' : ''} in this workspace
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                icon={
                  <ViewKanbanRoundedIcon
                    sx={{ fontSize: '14px !important' }}
                  />
                }
                label="Workspace Boards"
                size="small"
                sx={{
                  height: 30,
                  backgroundColor: alpha(
                    theme.palette.primary.main,
                    isDark ? 0.15 : 0.08
                  ),
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: 0,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '& .MuiChip-icon': { color: 'primary.main' }
                }}
              />

              <Chip
                label={`${count} total`}
                size="small"
                sx={{
                  height: 30,
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: 0,
                  color: 'text.secondary',
                  bgcolor: isDark
                    ? alpha(theme.palette.common.white, 0.06)
                    : alpha(theme.palette.common.black, 0.04),
                  border: `1px solid ${theme.palette.divider}`
                }}
              />
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2.5}>
            {activeBoards.map((b) => {
              const itemBackground = backgroundBoardList.find(
                (item) => item.key === b?.cover?.value
              )?.src
              const backgroundImage =
                b?.cover?.type === 'image' ? b?.cover?.value : itemBackground

              return (
                <Grid xs={12} sm={6} md={3} key={b._id}>
                  <Box
                    component={Link}
                    to={`/boards/${b._id}`}
                    sx={{ display: 'block', textDecoration: 'none' }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        width: '100%',
                        height: 172,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px solid',
                        borderColor: isDark
                          ? alpha(theme.palette.common.white, 0.09)
                          : alpha(theme.palette.common.black, 0.08),
                        boxShadow: isDark
                          ? '0 10px 26px rgba(0,0,0,0.24)'
                          : '0 10px 24px rgba(15,23,42,0.06)',
                        transition:
                          'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: isDark
                            ? '0 18px 42px rgba(0,0,0,0.42)'
                            : '0 18px 42px rgba(37,99,235,0.14)',
                          borderColor: alpha(theme.palette.primary.main, 0.55)
                        },
                        '&:hover .board-cover': {
                          transform: 'scale(1.04)'
                        }
                      }}
                    >
                      <Box
                        className="board-cover"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: backgroundImage
                            ? `url("${backgroundImage}")`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          bgcolor: isDark
                            ? alpha(theme.palette.common.white, 0.05)
                            : alpha(theme.palette.primary.main, 0.08),
                          transition: 'transform 0.35s ease'
                        }}
                      />

                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.62) 100%)'
                        }}
                      />

                      <CardContent
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          height: '100%',
                          p: 2,
                          '&:last-child': { pb: 2 },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end'
                        }}
                      >
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            width: 'fit-content',
                            maxWidth: '100%',
                            mb: 1,
                            px: 1,
                            py: 0.45,
                            borderRadius: '999px',
                            color: 'rgba(255,255,255,0.88)',
                            bgcolor: 'rgba(15,23,42,0.32)',
                            border: '1px solid rgba(255,255,255,0.14)',
                            backdropFilter: 'blur(8px)'
                          }}
                        >
                          <ViewKanbanRoundedIcon sx={{ fontSize: 14 }} />
                          <Typography
                            sx={{
                              fontSize: 11,
                              fontWeight: 700,
                              lineHeight: 1,
                              letterSpacing: 0
                            }}
                          >
                            Board
                          </Typography>
                        </Box>

                        <Typography
                          title={b.title}
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 800,
                            lineHeight: 1.35,
                            color: 'white',
                            textShadow: '0 2px 8px rgba(15,23,42,0.40)',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word'
                          }}
                        >
                          {truncateText(b.title, 54)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              )
            })}

            <Grid xs={12} sm={6} md={3}>
              <Card
                onClick={handleOpenCreateBoard}
                elevation={0}
                sx={{
                  width: '100%',
                  height: 172,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1.5px dashed',
                  borderColor: isDark
                    ? alpha(theme.palette.common.white, 0.16)
                    : alpha(theme.palette.primary.main, 0.26),
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isDark
                    ? alpha(theme.palette.common.white, 0.035)
                    : theme.palette.background.paper,
                  transition:
                    'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background-color 0.22s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'primary.main',
                    borderStyle: 'solid',
                    bgcolor: isDark
                      ? alpha(theme.palette.primary.main, 0.09)
                      : alpha(theme.palette.primary.main, 0.05),
                    boxShadow: isDark
                      ? '0 18px 42px rgba(0,0,0,0.34)'
                      : '0 18px 42px rgba(37,99,235,0.12)'
                  }
                }}
              >
                <CardContent
                  sx={{
                    p: 2,
                    '&:last-child': { p: 2 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.25,
                    width: '100%',
                    height: '100%',
                    textAlign: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '12px',
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      display: 'grid',
                      placeItems: 'center'
                    }}
                  >
                    <AddRoundedIcon
                      sx={{ color: 'primary.main', fontSize: 24 }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: 'primary.main',
                        lineHeight: 1.35
                      }}
                    >
                      Create New Board
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        lineHeight: 1.4
                      }}
                    >
                      Start with a blank workspace board
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {count > itemsPerPage && (
            <Box
              sx={{
                mt: 3,
                pt: 2.5,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'space-between' },
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Page {page} of {Math.ceil(count / itemsPerPage)}
              </Typography>

              <Pagination
                size="large"
                color="primary"
                showFirstButton
                showLastButton
                count={Math.ceil(count / itemsPerPage)}
                page={page}
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    to={`/h/workspaces/${workspaceId}/boards${
                      item.page === 1 ? '' : `?page=${item.page}`
                    }`}
                    {...item}
                  />
                )}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '10px',
                    fontWeight: 700
                  }
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      <CreateBoardModal ui={ui.createModal} handler={handler.createModal} />

      <Box sx={{ mt: 4 }}>
        <Divider />
      </Box>
    </>
  )
}

export default BoardList
