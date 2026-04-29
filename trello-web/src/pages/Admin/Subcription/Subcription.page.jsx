import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import SubscriptionTable from '~/components/Admin/Subcription/SubcriptionTable'
import { useAdminSubscription } from '~/hooks/adminSubscription.hook'

export default function SubscriptionPage() {

  const {
    search,
    page,
    rowsPerPage,
    subscriptions,
    totalCount,
    handleChangePage,
    handleChangeRowsPerPage,
    handleEditSubscription,
    formatDateTime,
    handleCancelSubscription,
    cancelModalOpen,
    selectedSubscription,
    setSelectedSubscription,
    handleCloseCancelModal,
    handleOpenCancelModal,
  } = useAdminSubscription()


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
            sx={{ fontSize: '40px', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}
          >
            Subscription
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: '22px', color: '#374151' }}>
            Manage your subscription collection
          </Typography>
        </Box>

      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <TextField
          value={search}
          placeholder="Search subscriptions..."
          size="small"
          sx={{
            width: 250,
            '& .MuiOutlinedInput-root': {
              height: 38,
              borderRadius: '8px',
              backgroundColor: '#fff'
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

      <SubscriptionTable
        subscriptions={subscriptions}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onEdit={handleEditSubscription}
        formatDateTime={formatDateTime}
        handleCancelSubscription={handleCancelSubscription}
        cancelModalOpen={cancelModalOpen}
        selectedSubscription={selectedSubscription}
        setSelectedSubscription={setSelectedSubscription}
        handleCloseCancelModal={handleCloseCancelModal}
        handleOpenCancelModal={handleOpenCancelModal}
      />

    </Box>
  )
}