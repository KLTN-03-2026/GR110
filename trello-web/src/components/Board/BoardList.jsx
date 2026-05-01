import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import CreateBoardModal from './CreateBoardModal'
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Link, useParams } from 'react-router-dom'
import { backgroundBoardList } from '~/constant/backgroundBoard'
import { alpha, useTheme } from '@mui/material/styles'
import WorkspacePageHeader from '~/components/Workspace/WorkspacePageHeader'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...'
}

function BoardList({ ui, data, handler, isLoading = false }) {
  const { page, itemsPerPage } = ui
  const { boards, count } = data
  const { handleOpenCreateBoard } = handler
  const { workspaceId } = useParams()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const renderBoardSkeletons = () => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <Grid xs={12} sm={6} md={3} key={`skeleton-${idx}`}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            height: 172,
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: isDark
              ? alpha(theme.palette.common.white, 0.09)
              : alpha(theme.palette.common.black, 0.08)
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{
                bgcolor: isDark
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha(theme.palette.common.black, 0.06)
              }}
            />
          </Box>
        </Card>
      </Grid>
    ))
  }

  return (
    <>
      <WorkspacePageHeader
        badgeIcon={<ViewKanbanRoundedIcon sx={{ fontSize: 13 }} />}
        badgeLabel="Workspace Boards"
        title="Your Boards"
        description={`${boards.length} board${
          boards.length !== 1 ? 's' : ''
        } in this workspace`}
      >
        <Chip
          icon={<ViewKanbanRoundedIcon sx={{ fontSize: 15 }} />}
          label={`${count} total`}
          sx={(theme) => ({
            height: 32,
            color:
              theme.palette.mode === 'dark'
                ? '#bfdbfe'
                : theme.palette.primary.main,
            fontWeight: 700,
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.10)'
                : alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            '& .MuiChip-icon': { color: 'inherit' }
          })}
        />

        <Button
          onClick={handleOpenCreateBoard}
          startIcon={<AddRoundedIcon />}
          variant="contained"
          sx={(theme) => ({
            fontWeight: 700,
            borderRadius: '999px',
            px: 2.5,
            py: 1.05,
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.12)'
                : 'primary.main',
            color:
              theme.palette.mode === 'dark'
                ? 'common.white'
                : 'primary.contrastText',
            border: `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.18)'
                : 'transparent'
            }`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? 'none'
                : '0 8px 24px rgba(37,99,235,0.24)',
            '&:hover': {
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.18)'
                  : 'primary.dark',
              transform: 'translateY(-1px)',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? 'none'
                  : '0 12px 30px rgba(37,99,235,0.30)'
            }
          })}
        >
          Create Board
        </Button>
      </WorkspacePageHeader>

      <Box sx={{ overflow: 'hidden' }}>
        <Grid container spacing={2.5}>
          {isLoading ? (
            renderBoardSkeletons()
          ) : (
            <>
              {boards.map((b) => {
                const itemBackground = backgroundBoardList.find(
                  (item) => item.key === b?.cover?.value
                )?.src
                const backgroundImage =
                  b?.cover?.type === 'image' ? b?.cover?.value : itemBackground
                const isPublic = b.visibility === 'public'

                return (
                  <Grid xs={12} sm={6} md={3} key={b._id}>
                    <Box
                      component={Link}
                      to={`/boards/${b.workspaceId}/${b._id}`}
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
                              border: '1px solid',
                              backdropFilter: 'blur(8px)',
                              // Public: xanh lá nhạt — Private: vàng/cam nhạt
                              color: isPublic
                                ? 'rgba(134,239,172,0.9)'
                                : 'rgba(253,186,116,0.9)',
                              bgcolor: isPublic
                                ? 'rgba(20,83,45,0.35)'
                                : 'rgba(120,53,15,0.35)',
                              borderColor: isPublic
                                ? 'rgba(134,239,172,0.25)'
                                : 'rgba(253,186,116,0.25)'
                            }}
                          >
                            {isPublic ? (
                              <PublicRoundedIcon sx={{ fontSize: 13 }} />
                            ) : (
                              <LockRoundedIcon sx={{ fontSize: 13 }} />
                            )}
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 700,
                                lineHeight: 1,
                                letterSpacing: 0.2,
                                textTransform: 'capitalize'
                              }}
                            >
                              {b.visibility}
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

              {!isLoading && (
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
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.12
                          ),
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
              )}
            </>
          )}
        </Grid>

        {!isLoading && count > itemsPerPage && (
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
    </>
  )
}

export default BoardList
