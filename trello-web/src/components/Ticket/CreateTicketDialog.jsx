import { useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import NotesRoundedIcon from '@mui/icons-material/NotesRounded'
import { createTicketApi } from '~/apis/ticket.api'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

export default function CreateTicketDialog({
  open,
  onClose,
  loading = false,
  TICKET_TYPES,
  refetchTickets
}) {
     const currentUser = useSelector(selectCurrentUser)
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: currentUser?.email,
      title: '',
      type: 'support',
      content: ''
    }
  })

  useEffect(() => {
    if (!open) return
    reset({
      email: currentUser?.email,
      title: '',
      type: 'support',
      content: ''
    })
  }, [open, reset])

  const onSubmit = async (data) => {
    await createTicketApi({ticketData: data})
    reset({
      email: currentUser?.email,
      title: '',
      type: 'support',
      content: ''
    })
    refetchTickets()
    onClose?.()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      PaperProps={{
        sx: {
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
          Create ticket
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
          Submit a support request, billing issue, or product feedback.
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: '20px !important' }}>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label='Email'
              placeholder='Enter email'
              disabled={true}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <TitleRoundedIcon fontSize='small' />
                  </InputAdornment>
                )
              }}
              {...register('email', {
                required: 'Email is required',
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label='Title'
              placeholder='Enter ticket title'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <TitleRoundedIcon fontSize='small' />
                  </InputAdornment>
                )
              }}
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                },
                maxLength: {
                  value: 200,
                  message: 'Title must not exceed 200 characters'
                }
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <Controller
              name='type'
              control={control}
              rules={{ required: 'Type is required' }}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label='Ticket type'
                  {...field}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CategoryRoundedIcon fontSize='small' />
                      </InputAdornment>
                    )
                  }}
                >
                  {TICKET_TYPES.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <TextField
              fullWidth
              multiline
              minRows={5}
              label='Content'
              placeholder='Describe your issue or request in detail...'
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position='start'
                    sx={{ alignSelf: 'flex-start', mt: 1.2 }}
                  >
                    <NotesRoundedIcon fontSize='small' />
                  </InputAdornment>
                )
              }}
              {...register('content', {
                required: 'Content is required',
                minLength: {
                  value: 10,
                  message: 'Content must be at least 10 characters'
                },
                maxLength: {
                  value: 5000,
                  message: 'Content must not exceed 5000 characters'
                }
              })}
              error={!!errors.content}
              helperText={errors.content?.message}
            />

            <Stack
              direction='row'
              spacing={1.5}
              justifyContent='flex-end'
              sx={{ pt: 1 }}
            >
              <Button
                variant='outlined'
                onClick={onClose}
                sx={{
                  minWidth: 110,
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2
                }}
              >
                Cancel
              </Button>

              <Button
                type='submit'
                variant='contained'
                disabled={loading}
                sx={{
                  minWidth: 130,
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                Create ticket
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
}