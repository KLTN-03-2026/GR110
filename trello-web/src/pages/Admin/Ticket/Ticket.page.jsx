import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import AdminTicketTable from '~/components/Admin/Ticket/TicketTable'
import ReplyTicketModal from '~/components/Admin/Ticket/ReplyTicketModal'
import ViewReplyModal from '~/components/Admin/Ticket/ViewReplyModal'
import { useAdminTicket } from '~/hooks/adminTicket.hook'

export default function AdminTicketPage() {
  const {
    search,
    page,
    rowsPerPage,
    replyModalOpen,
    viewReplyModalOpen,
    selectedTicket,
    tickets,
    totalCount,
    loading,
    handleSearchChange,
    handleOpenReplyModal,
    handleCloseReplyModal,
    handleOpenViewReplyModal,
    handleCloseViewReplyModal,
    handleRejectTicket,
    handleReplyTicket,
    handleChangePage,
    handleChangeRowsPerPage
  } = useAdminTicket()

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
            Payment
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '22px',
              color: '#374151'
            }}
          >
            View payment list
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder="Search payments..."
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
