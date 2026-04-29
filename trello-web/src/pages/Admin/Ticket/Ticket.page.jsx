import { useState } from 'react'
import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import AdminTicketTable from '~/components/Admin/Ticket/TicketTable'
import ReplyTicketModal from '~/components/Admin/Ticket/ReplyTicketModal'
import ViewReplyModal from '~/components/Admin/Ticket/ViewReplyModal'
import { useAdminTicket } from '~/hooks/adminTicket.hook'

export default function AdminTicketPage() {
  const {
    search,
    type,
    page,
    rowsPerPage,
    replyModalOpen,
    viewReplyModalOpen,
    selectedTicket,
    tickets,
    totalCount,
    handleSearchChange,
    handleChangeType,
    handleOpenReplyModal,
    handleCloseReplyModal,
    handleOpenViewReplyModal,
    handleCloseViewReplyModal,
    handleRejectTicket,
    handleReplyTicket,
    handleChangePage,
    handleChangeRowsPerPage
  } = useAdminTicket()

  const [anchorEl, setAnchorEl] = useState(null)
  const openFilter = Boolean(anchorEl)

  const TICKET_TYPES = [
    { value: 'all', label: 'All' },
    { value: 'support', label: 'Support' },
    { value: 'billing', label: 'Billing' },
    { value: 'bug', label: 'Bug' },
    { value: 'feedback', label: 'Feedback' }
  ]

  const handleOpenFilter = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseFilter = () => {
    setAnchorEl(null)
  }

  const handleSelectType = (value) => {
    handleChangeType(value)
    handleCloseFilter()
  }

  const selectedTypeLabel =
    TICKET_TYPES.find((item) => item.value === type)?.label || 'All'

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '40px',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.2
            }}
          >
            Ticket
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '22px',
              color: '#374151'
            }}
          >
            View ticket list
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 2, gap: 1.5 }}
      >
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder="Search tickets..."
          size="small"
          sx={{
            width: 280,
            '& .MuiOutlinedInput-root': {
              height: 38,
              borderRadius: '8px',
              backgroundColor: '#fff',
              color: 'black'
            },
            '& .MuiInputBase-input': {
              fontSize: '15px'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
              </InputAdornment>
            )
          }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterListOutlinedIcon />}
          onClick={handleOpenFilter}
          sx={{
            textTransform: 'none',
            color: '#374151',
            borderColor: '#d1d5db',
            backgroundColor: '#fff',
            borderRadius: '8px',
            px: 2,
            minWidth: 'auto',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb'
            }
          }}
        >
          Filter: {selectedTypeLabel}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={openFilter}
          onClose={handleCloseFilter}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 180,
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 30px rgba(15,23,42,0.08)'
            }
          }}
        >
          {TICKET_TYPES.map((item) => (
            <MenuItem
              key={item.value}
              selected={type === item.value}
              onClick={() => handleSelectType(item.value)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      <AdminTicketTable
        tickets={tickets}
        onReject={handleRejectTicket}
        onReply={handleOpenReplyModal}
        onViewReply={handleOpenViewReplyModal}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ReplyTicketModal
        open={replyModalOpen}
        ticket={selectedTicket}
        onClose={handleCloseReplyModal}
        onSubmit={handleReplyTicket}
      />

      <ViewReplyModal
        open={viewReplyModalOpen}
        ticket={selectedTicket}
        onClose={handleCloseViewReplyModal}
      />
    </Box>
  )
}