import {
  Box,
  Button,
  Container,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Chip
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import InboxRoundedIcon from '@mui/icons-material/InboxRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'

import CreateTicketDialog from '~/components/Ticket/CreateTicketDialog'
import { useState } from 'react'
import { useTicket } from '~/hooks/ticket.hook'
import SummaryCard from '~/components/Ticket/SummaryCard'
import TicketCard from '~/components/Ticket/TicketCard'

const TICKET_TYPES = [
  { value: 'support', label: 'Support' },
  { value: 'billing', label: 'Billing' },
  { value: 'bug', label: 'Bug' },
  { value: 'feedback', label: 'Feedback' }
]

/* ── dot pattern consistent with the rest of the design system ── */
const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

const selectSx = {
  minWidth: 160,
  '& .MuiOutlinedInput-root': { borderRadius: '12px' }
}

export default function TicketPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  const {
    search,
    page,
    status,
    type,
    tickets,
    totalCount,
    totalPages,
    loading,
    creating,
    handleSearchChange,
    handleChangePage,
    handleChangeStatus,
    handleChangeType,
    refetchTickets
  } = useTicket()

  const summary = {
    total: totalCount,
    pending: tickets.filter((t) => t.status === 'pending').length,
    rejected: tickets.filter((t) => t.status === 'rejected').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: isDark ? '#0b1120' : '#f6f8fc',
        py: { xs: 3, md: 4 }
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>

          {/* ── Hero header banner ── */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
              color: 'white',
              px: { xs: 3, md: 5 },
              py: { xs: 3.5, md: 4 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={dotPatternSx} />

            {/* Glow orb */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 220,
                height: 220,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56,189,248,0.22) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Chip
                icon={<ConfirmationNumberRoundedIcon sx={{ fontSize: 13, color: '#93c5fd !important' }} />}
                label="Support Center"
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
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: '-0.03em',
                  mb: 0.5
                }}
              >
                Ticket Center
              </Typography>
              <Typography sx={{ opacity: 0.72, fontSize: '0.875rem' }}>
                Manage support, billing issues, bugs, and feedback.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{
                position: 'relative',
                zIndex: 1,
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '999px',
                px: 3,
                py: 1.2,
                fontSize: '0.9rem',
                backgroundColor: 'white',
                color: '#1d4ed8',
                boxShadow: '0 6px 20px rgba(0,0,0,0.20)',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.25)'
                }
              }}
            >
              New Ticket
            </Button>
          </Box>

          {/* ── Summary cards ── */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
              gap: 2
            }}
          >
            <SummaryCard
              label="Total Tickets"
              value={summary.total}
              icon={<ConfirmationNumberRoundedIcon />}
            />
            <SummaryCard
              label="Pending"
              value={summary.pending}
              icon={<HourglassTopRoundedIcon />}
            />
            <SummaryCard
              label="Rejected"
              value={summary.rejected}
              icon={<AutorenewRoundedIcon />}
            />
            <SummaryCard
              label="Resolved"
              value={summary.resolved}
              icon={<CheckCircleRoundedIcon />}
            />
          </Box>

          {/* ── Filter bar ── */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }}
          >
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={1.5}
              alignItems={{ lg: 'center' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 0.5 }}>
                <TuneRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  Filter by
                </Typography>
              </Box>

              <TextField
                fullWidth
                placeholder="Search by ticket ID, email, title, or content…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                }}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexShrink={0}>
                <TextField
                  select
                  label="Status"
                  value={status}
                  onChange={(e) => handleChangeStatus(e.target.value)}
                  sx={selectSx}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Type"
                  value={type}
                  onChange={(e) => handleChangeType(e.target.value)}
                  sx={selectSx}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {TICKET_TYPES.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
          </Paper>

          {/* ── Ticket list / Loading / Empty ── */}
          {loading ? (
            <Paper
              elevation={0}
              sx={{
                p: 7,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <CircularProgress size={32} thickness={4} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Loading tickets…
                </Typography>
              </Stack>
            </Paper>
          ) : tickets.length > 0 ? (
            <Stack spacing={2}>
              {tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </Stack>
          ) : (
            <Paper
              elevation={0}
              sx={{
                py: 8,
                px: 4,
                borderRadius: '16px',
                border: `1.5px dashed ${alpha(theme.palette.primary.main, 0.25)}`,
                bgcolor: isDark
                  ? alpha(theme.palette.primary.main, 0.04)
                  : alpha(theme.palette.primary.main, 0.03),
                textAlign: 'center'
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '20px',
                  background: alpha(theme.palette.primary.main, 0.1),
                  display: 'grid',
                  placeItems: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <InboxRoundedIcon sx={{ fontSize: 30, color: 'primary.main' }} />
              </Box>

              <Typography sx={{ fontSize: 18, fontWeight: 800, color: 'text.primary', mb: 0.75 }}>
                No tickets found
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 3 }}>
                Try adjusting your search or filters, or open a new ticket.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => setOpenCreateDialog(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: '999px',
                  px: 3,
                  py: 1.1,
                  background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.28)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 12px 28px rgba(37,99,235,0.40)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Create your first ticket
              </Button>
            </Paper>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <Stack alignItems="center" sx={{ pt: 1 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '10px',
                    fontWeight: 600
                  }
                }}
              />
            </Stack>
          )}
        </Stack>
      </Container>

      <CreateTicketDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        loading={creating}
        TICKET_TYPES={TICKET_TYPES}
        refetchTickets={refetchTickets}
      />
    </Box>
  )
}