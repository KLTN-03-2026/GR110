import Typography from '@mui/material/Typography'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import AddChecklistItem from './AddChecklistItem'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import TaskItem from './TaskItem'
import { Divider } from '@mui/material'

function CardChecklist({ data, handler }) {
  const checklists = data || []
  const { handleCreateTask, handleUpdateTaskContent, handleDeleteTask } =
    handler

  return (
    <Box>
      {checklists?.length > 0 &&
        checklists.map((checklist) => {
          const items = checklist?.childTasks || []
          const completedCount = items.filter((item) => item.isCompleted).length
          const progress = items.length
            ? Math.round((completedCount / items.length) * 100)
            : 0

          return (
            <Box key={checklist._id} sx={{ mb: 4 }}>
              {/* Checklist Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2.5,
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flex: 1,
                    minWidth: 0
                  }}
                >
                  <CheckBoxOutlinedIcon sx={{ flexShrink: 0, fontSize: 22 }} />

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <ToggleFocusInput
                      value={checklist.content}
                      inputFontSize="20px"
                      onChangedValue={(newValue) =>
                        handleUpdateTaskContent({
                          _id: checklist._id,
                          content: newValue
                        })
                      }
                      sx={{
                        fontWeight: 700,
                        '& input': {
                          fontWeight: 700
                        }
                      }}
                    />
                  </Box>
                </Box>

                <Button
                  onClick={() => handleDeleteTask(checklist)}
                  color="error"
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 1.5,
                    minWidth: 'fit-content',
                    flexShrink: 0,
                    fontSize: '12px',
                    py: 0.5
                  }}
                >
                  Delete
                </Button>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: 'text.secondary',
                      fontWeight: 600
                    }}
                  >
                    {completedCount} of {items.length} completed
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: progress === 100 ? '#4caf50' : 'text.secondary'
                    }}
                  >
                    {progress}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={(theme) => ({
                    height: 6,
                    borderRadius: 999,
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(0,0,0,0.06)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 999,
                      background:
                        progress === 100
                          ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
                          : 'linear-gradient(90deg, #42a5f5, #64b5f6)'
                    }
                  })}
                />
              </Box>

              {/* Task Items */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  mb: 2
                }}
              >
                {checklist.childTasks?.map((item) => (
                  <TaskItem key={item._id} task={item} handler={handler} />
                ))}
              </Box>

              {/* Add Task Button */}
              <AddChecklistItem
                parentId={checklist._id}
                handleCreate={handleCreateTask}
              />

              <Divider sx={{ mt: 3 }} />
            </Box>
          )
        })}
    </Box>
  )
}

export default CardChecklist
