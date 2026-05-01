import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

function CardDetailModalSkeleton() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 1200,
        maxWidth: '100%',
        maxHeight: '90vh',
        boxShadow: 24,
        borderRadius: 2,
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header Skeleton */}
      <Box sx={{ flexShrink: 0, mb: 3 }}>
        <Skeleton
          variant="rectangular"
          height={180}
          sx={{ borderRadius: 1.5 }}
        />
      </Box>

      {/* Body Skeleton */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          gap: '30px',
          mt: 2
        }}
      >
        {/* Left side skeleton */}
        <Box sx={{ flex: 8, minWidth: 0 }}>
          <Stack spacing={3}>
            {/* Title Skeleton */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="60%" height={40} />
            </Box>

            {/* Action buttons skeleton */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={100}
                  height={36}
                  sx={{ borderRadius: 1.5 }}
                />
              ))}
            </Box>

            {/* Sections skeleton */}
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i}>
                <Skeleton
                  variant="text"
                  width={150}
                  height={28}
                  sx={{ mb: 1.5 }}
                />
                <Skeleton
                  variant="rectangular"
                  height={60}
                  sx={{ borderRadius: 1.5 }}
                />
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Right side skeleton */}
        <Box sx={{ flex: 5, minWidth: 0 }}>
          <Stack spacing={2}>
            <Skeleton variant="text" width={150} height={28} />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={80}
                sx={{ borderRadius: 1.5 }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default CardDetailModalSkeleton
