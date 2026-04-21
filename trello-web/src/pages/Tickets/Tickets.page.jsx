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
  CircularProgress
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

import CreateTicketDialog from '~/components/Ticket/CreateTicketDialog'
import { useState } from 'react'
import { useTicket } from '~/hooks/ticket.hook'
import SummaryCard from '~/components/Ticket/SummaryCard'
import TicketCard from '~/components/Ticket/TicketCard'
import { reject } from 'lodash'

const TICKET_TYPES = [
  { value: 'support', label: 'Support' },
  { value: 'billing', label: 'Billing' },
  { value: 'bug', label: 'Bug' },
  { value: 'feedback', label: 'Feedback' }
]

export default function TicketPage() {
  const theme = useTheme()
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  const {
    search,
    page,
    rowsPerPage,
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
        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
        py: { xs: 3, md: 4 }
      }}
    >
      <Container maxWidth='lg'>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Box>
              <Stack direction='row' spacing={1.25} alignItems='center'>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main
                  }}
                >
                  <ConfirmationNumberRoundedIcon />
                </Box>

                <Box>
                  <Typography sx={{ fontSize: 30, fontWeight: 800, color: 'text.primary' }}>
                    Ticket Center
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                    Manage support, billing issues, bugs, and feedback.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Button
              variant='contained'
              startIcon={<AddRoundedIcon />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' }
              }}
            >
              Create ticket
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
              gap: 2
            }}
          >
            <SummaryCard
              label='Total tickets'
              value={summary.total}
              icon={<ConfirmationNumberRoundedIcon />}
            />
            <SummaryCard
              label='Pending'
              value={summary.pending}
              icon={<HourglassTopRoundedIcon />}
            />
            <SummaryCard
              label='Rejected'
              value={summary.rejected}
              icon={<AutorenewRoundedIcon />}
            />
            <SummaryCard
              label='Resolved'
              value={summary.resolved}
              icon={<CheckCircleRoundedIcon />}
            />
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper
            }}
          >
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={1.5}
              justifyContent='space-between'
            >
              <TextField
                fullWidth
                placeholder='Search by ticket ID, email, title, or content...'
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchRoundedIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  select
                  label='Status'
                  value={status}
                  onChange={(e) => handleChangeStatus(e.target.value)}
                  sx={{ minWidth: 170 }}
                >
                  <MenuItem value='all'>All</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='processing'>Processing</MenuItem>
                  <MenuItem value='resolved'>Resolved</MenuItem>
                  <MenuItem value='rejected'>Rejected</MenuItem>
                </TextField>

                <TextField
                  select
                  label='Type'
                  value={type}
                  onChange={(e) => handleChangeType(e.target.value)}
                  sx={{ minWidth: 170 }}
                >
                  <MenuItem value='all'>All</MenuItem>
                  {TICKET_TYPES.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
          </Paper>

          {loading ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper
              }}
            >
              <Stack alignItems='center' spacing={1.5}>
                <CircularProgress size={28} />
                <Typography sx={{ color: 'text.secondary' }}>
                  Loading tickets...
                </Typography>
              </Stack>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}

              {!tickets.length && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    borderRadius: 3,
                    border: `1px dashed ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                    textAlign: 'center'
                  }}
                >
                  <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary' }}>
                    No tickets found
                  </Typography>
                  <Typography sx={{ mt: 1, fontSize: 14, color: 'text.secondary' }}>
                    Try changing your search keyword or filters.
                  </Typography>

                  <Button
                    variant='contained'
                    startIcon={<AddRoundedIcon />}
                    onClick={() => setOpenCreateDialog(true)}
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: 'none',
                      '&:hover': { boxShadow: 'none' }
                    }}
                  >
                    Create ticket
                  </Button>
                </Paper>
              )}
            </Stack>
          )}

          {totalPages > 1 && (
            <Stack alignItems='center' sx={{ pt: 1 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color='primary'
                shape='rounded'
                showFirstButton
                showLastButton
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