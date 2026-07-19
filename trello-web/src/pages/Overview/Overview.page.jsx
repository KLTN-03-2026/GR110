import {
  Box,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'

const doneItems = [
  'Không gian làm việc đã có đầy đủ chức năng quản lý thành viên và phân vai trò rõ ràng.',
  'Bảng công việc đã hỗ trợ đầy đủ các thao tác tạo, sửa, quản lý và theo dõi tiến độ.',
  'Khi nhiều người cùng kéo-thả thẻ trong một bảng, hệ thống vẫn giữ dữ liệu nhất quán.',
  'Thay đổi được cập nhật gần như ngay lập tức để các thành viên cùng nhìn thấy.',
  'Luồng sử dụng chính hiện đã đủ để vận hành nhóm làm việc đông người.'
]

const missingItems = [
  'Khi nhiều người cùng chỉnh sửa một thẻ hoặc cùng kéo-thả trong cùng thời điểm, vẫn có khả năng phát sinh xung đột thao tác.',
  'Cần tối ưu thêm để hệ thống mượt hơn khi số lượng người dùng tăng nhanh cùng lúc.',
  'Một số tình huống cao điểm vẫn cần kiểm tra thực tế thêm trước khi mở rộng chính thức.',
  'Phần triển khai lên môi trường vận hành cần chuẩn hóa thêm để ổn định dài hạn.',
  'Với bảng quá lớn, tốc độ tải ban đầu có thể chưa tối ưu như mong muốn.',
  'Cần thêm đợt chạy thử đông người để tự tin hơn trước khi sử dụng quy mô lớn.'
]

const listItemSx = {
  py: 0.25,
  px: 0,
  alignItems: 'flex-start'
}

function OverviewPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 4, md: 6 },
        background:
          'linear-gradient(145deg, #f7fafc 0%, #edf2f7 45%, #e2e8f0 100%)'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 3,
              border: '1px solid #dbe4ee',
              background:
                'linear-gradient(120deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 100%)'
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Chip
                icon={<TrendingUpRoundedIcon />}
                label="Project Overview"
                sx={{ width: 'fit-content', fontWeight: 700 }}
              />
              <Chip
                icon={<HubRoundedIcon />}
                label="Phạm vi: Workspace • Board • Kéo thả"
                color="primary"
                sx={{ width: 'fit-content', fontWeight: 700 }}
              />
              <Chip
                icon={<TaskAltRoundedIcon />}
                label="Reviewed: 30/05/2026"
                sx={{ width: 'fit-content', fontWeight: 700 }}
              />
            </Stack>
            <Typography variant="h4" fontWeight={800} mt={2}>
              Tổng quan mức sẵn sàng cho nhóm 150 người dùng
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Nội dung tập trung vào quản lý công việc trong workspace, board và
              thao tác kéo-thả thẻ trong cùng một board.
            </Typography>
          </Paper>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2
            }}
          >
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: '1px solid #d8f0df' }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <TaskAltRoundedIcon color="success" />
                <Typography variant="h6" fontWeight={800}>
                  Đã làm được
                </Typography>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <List disablePadding>
                {doneItems.map((item) => (
                  <ListItem key={item} sx={listItemSx}>
                    <ListItemIcon sx={{ minWidth: 28, mt: '2px' }}>
                      <CheckCircleOutlineRoundedIcon
                        fontSize="small"
                        color="success"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: '1px solid #f3d4d4' }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <WarningAmberRoundedIcon color="error" />
                <Typography variant="h6" fontWeight={800}>
                  Chưa làm được / Cần gia cố
                </Typography>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <List disablePadding>
                {missingItems.map((item) => (
                  <ListItem key={item} sx={listItemSx}>
                    <ListItemIcon sx={{ minWidth: 28, mt: '2px' }}>
                      <RadioButtonUncheckedRoundedIcon
                        fontSize="small"
                        color="error"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default OverviewPage
