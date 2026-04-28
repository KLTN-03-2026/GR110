import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
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
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background:
            'linear-gradient(145deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
          color: 'white',
          px: { xs: 3, md: 5 },
          py: { xs: 3.5, md: 4 },
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={dotPatternSx} />

        <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
          <Chip
            icon={
              <ViewKanbanRoundedIcon
                sx={{ fontSize: 13, color: '#93c5fd !important' }}
              />
            }
            label="Workspace Boards"
            size="small"
            sx={{
              mb: 1.5,
              backgroundColor: 'rgba(255,255,255,0.10)',
              color: '#bfdbfe',
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: 1,
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)'
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 22, md: 28 },
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: 0,
              mb: 0.5
            }}
          >
            Your Boards
          </Typography>

          <Typography sx={{ opacity: 0.72, fontSize: '0.875rem' }}>
            {activeBoards.length} active board
            {activeBoards.length !== 1 ? 's' : ''} in this workspace
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          alignItems="center"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Chip
            icon={<ViewKanbanRoundedIcon sx={{ fontSize: 15 }} />}
            label={`${count} total`}
            sx={{
              height: 32,
              color: '#bfdbfe',
              fontWeight: 700,
              bgcolor: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.16)',
              '& .MuiChip-icon': { color: '#93c5fd' }
            }}
          />

          <Button
            onClick={handleOpenCreateBoard}
            startIcon={<AddRoundedIcon />}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '999px',
              px: 2.5,
              py: 1.05,
              backgroundColor: 'white',
              color: '#1d4ed8',
              boxShadow: '0 6px 20px rgba(0,0,0,0.20)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.92)',
                transform: 'translateY(-1px)',
                boxShadow: '0 10px 28px rgba(0,0,0,0.25)'
              }
            }}
          >
            Create Board
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          borderRadius: '24px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark ? '#0f1623' : '#f6f8fc',
          boxShadow: isDark ? 'none' : '0 18px 48px rgba(15,23,42,0.08)',
          overflow: 'hidden',
          p: { xs: 2, md: 3 }
        }}
      >
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

      <CreateBoardModal ui={ui.createModal} handler={handler.createModal} />

      <Box sx={{ mt: 4 }}>
        <Divider />
      </Box>
    </>
  )
}

export default BoardList
