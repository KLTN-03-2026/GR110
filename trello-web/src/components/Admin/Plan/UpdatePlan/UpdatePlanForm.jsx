import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { CapabilityCheckbox } from '../CreatePlan/CapabilityCheckbox'
import { LimitField } from '../CreatePlan/LimitField'
import { updateAdminPlanApi } from '~/apis/adminPlan.api'
import { useParams } from 'react-router-dom'

const inputSx = {
  '& .MuiInputLabel-root': {
    color: '#6b7280'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ea6b3d'
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    color: '#111827',
    '& fieldset': {
      borderColor: '#d1d5db'
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ea6b3d'
    }
  },
  '& .MuiInputBase-input': {
    color: '#111827'
  }
}

const selectSx = {
  backgroundColor: '#ffffff',
  color: '#111827',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#9ca3af'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ea6b3d'
  },
  '& .MuiSvgIcon-root': {
    color: '#6b7280'
  }
}

const sectionTitleSx = {
  mb: 1,
  fontSize: '14px',
  fontWeight: 600,
  color: '#111827'
}

const buildDefaultValues = (initialData) => ({
  title: initialData?.title || '',
  billingCycle: initialData?.billingCycle || 'monthly',
  description: initialData?.description || '',
  originPrice: initialData?.originPrice ?? 0,
  currentPrice: initialData?.currentPrice ?? 0,
  status: initialData?.status || 'active',
  feature: {
    capabilities: {
      workspace: {
        customRole: initialData?.feature?.capabilities?.workspace?.customRole ?? false
      },
      board: {
        customRole: initialData?.feature?.capabilities?.board?.customRole ?? false
      },
      column: {
        customColor: initialData?.feature?.capabilities?.column?.customColor ?? false
      },
      task: {
        setDue: initialData?.feature?.capabilities?.task?.setDue ?? false,
        assignMembers: initialData?.feature?.capabilities?.task?.assignMembers ?? false
      }
    },
    limits: {
      maxMembers: initialData?.feature?.limits?.maxMembers ?? 5,
      maxBoards: initialData?.feature?.limits?.maxBoards ?? 3,
      maxWorkspaceRoles: initialData?.feature?.limits?.maxWorkspaceRoles ?? 0,
      maxBoardRoles: initialData?.feature?.limits?.maxBoardRoles ?? 0,
      maxColumnsPerBoard: initialData?.feature?.limits?.maxColumnsPerBoard ?? 20,
      maxCardsPerBoard: initialData?.feature?.limits?.maxCardsPerBoard ?? 100,
      maxCommentsPerCard: initialData?.feature?.limits?.maxCommentsPerCard ?? 50,
      maxChecklistItemsPerCard: initialData?.feature?.limits?.maxChecklistItemsPerCard ?? 20,
      maxStorageMb: initialData?.feature?.limits?.maxStorageMb ?? 512,
      maxFileSizeMb: initialData?.feature?.limits?.maxFileSizeMb ?? 5,
      maxFilesPerUpload: initialData?.feature?.limits?.maxFilesPerUpload ?? 5
    }
  }
})

export default function UpdatePlanForm({ initialData }) {
  const defaultValues = buildDefaultValues(initialData)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur'
  })

  const { _id } = useParams();
  const onSubmit = async(data) => {
    const payload = {
      title: data.title.trim(),
      billingCycle: data.billingCycle,
      description: data.description.trim(),
      originPrice: Number(data.originPrice),
      currentPrice: Number(data.currentPrice),
      status: data.status,
      feature: {
        capabilities: {
          workspace: {
            customRole: !!data.feature.capabilities.workspace.customRole
          },
          board: {
            customRole: !!data.feature.capabilities.board.customRole
          },
          column: {
            customColor: !!data.feature.capabilities.column.customColor
          },
          task: {
            setDue: !!data.feature.capabilities.task.setDue,
            assignMembers: !!data.feature.capabilities.task.assignMembers
          }
        },
        limits: {
          maxMembers: Number(data.feature.limits.maxMembers),
          maxBoards: Number(data.feature.limits.maxBoards),
          maxWorkspaceRoles: Number(data.feature.limits.maxWorkspaceRoles),
          maxBoardRoles: Number(data.feature.limits.maxBoardRoles),
          maxColumnsPerBoard: Number(data.feature.limits.maxColumnsPerBoard),
          maxCardsPerBoard: Number(data.feature.limits.maxCardsPerBoard),
          maxCommentsPerCard: Number(data.feature.limits.maxCommentsPerCard),
          maxChecklistItemsPerCard: Number(data.feature.limits.maxChecklistItemsPerCard),
          maxStorageMb: Number(data.feature.limits.maxStorageMb),
          maxFileSizeMb: Number(data.feature.limits.maxFileSizeMb),
          maxFilesPerUpload: Number(data.feature.limits.maxFilesPerUpload)
        }
      }
    }

    await updateAdminPlanApi({planId: _id, planData: payload})
  }

  return (
    <Paper
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      elevation={0}
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: '14px',
        p: { xs: 2, md: 3 },
        backgroundColor: '#ffffff'
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3
        }}
      >
        <Box>
          <Typography sx={sectionTitleSx}>Title</Typography>

          <TextField
            fullWidth
            label='Enter Title...'
            type='text'
            variant='outlined'
            error={!!errors.title}
            {...register('title', {
              required: 'Title is required'
            })}
            sx={inputSx}
          />
          <FieldErrorAlert errors={errors} fieldName='title' />
        </Box>

        <Box>
          <Typography sx={sectionTitleSx}>Billing Cycle</Typography>

          <Controller
            name='billingCycle'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select {...field} sx={selectSx}>
                  <MenuItem value='monthly'>Monthly</MenuItem>
                  <MenuItem value='quarterly'>Quarterly</MenuItem>
                  <MenuItem value='yearly'>Yearly</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>

        <Box>
          <Typography sx={sectionTitleSx}>Original Price</Typography>

          <TextField
            fullWidth
            label='Enter Original Price...'
            type='number'
            variant='outlined'
            error={!!errors.originPrice}
            {...register('originPrice', {
              required: 'Original price is required',
              validate: (value) => {
                if (Number(value) < 0) return 'Original price must be greater than or equal to 0'
                return true
              }
            })}
            sx={inputSx}
          />
          <FieldErrorAlert errors={errors} fieldName='originPrice' />
        </Box>

        <Box>
          <Typography sx={sectionTitleSx}>Current Price</Typography>

          <TextField
            fullWidth
            label='Enter Current Price...'
            type='number'
            variant='outlined'
            error={!!errors.currentPrice}
            {...register('currentPrice', {
              required: 'Current price is required',
              validate: (value) => {
                if (Number(value) < 0) return 'Current price must be greater than or equal to 0'
                return true
              }
            })}
            sx={inputSx}
          />
          <FieldErrorAlert errors={errors} fieldName='currentPrice' />
        </Box>

        <Box>
          <Typography sx={sectionTitleSx}>Status</Typography>

          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select {...field} sx={selectSx}>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#111827', mb: 2 }}>
          Capabilities
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1
          }}
        >
          <CapabilityCheckbox
            control={control}
            name='feature.capabilities.workspace.customRole'
            label='Workspace Custom Role'
          />
          <CapabilityCheckbox
            control={control}
            name='feature.capabilities.board.customRole'
            label='Board Custom Role'
          />
          <CapabilityCheckbox
            control={control}
            name='feature.capabilities.column.customColor'
            label='Column Custom Color'
          />
          <CapabilityCheckbox
            control={control}
            name='feature.capabilities.task.setDue'
            label='Task Set Due'
          />
          <CapabilityCheckbox
            control={control}
            name='feature.capabilities.task.assignMembers'
            label='Task Assign Members'
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#111827', mb: 2 }}>
          Limits
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3
          }}
        >
          <LimitField control={control} name='feature.limits.maxMembers' label='Max Members' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='feature.limits.maxBoards' label='Max Boards' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField
            control={control}
            name='feature.limits.maxWorkspaceRoles'
            label='Max Workspace Roles'
            sectionTitleSx={sectionTitleSx}
            inputSx={inputSx}
          />
          <LimitField
            control={control}
            name='feature.limits.maxBoardRoles'
            label='Max Board Roles'
            sectionTitleSx={sectionTitleSx}
            inputSx={inputSx}
          />
          <LimitField
            control={control}
            name='feature.limits.maxColumnsPerBoard'
            label='Max Columns Per Board'
            sectionTitleSx={sectionTitleSx}
            inputSx={inputSx}
          />
          <LimitField
            control={control}
            name='feature.limits.maxCardsPerBoard'
            label='Max Cards Per Board'
            sectionTitleSx={sectionTitleSx}
            inputSx={inputSx}
          />
          <LimitField
            control={control}
            name='feature.limits.maxCommentsPerCard'
            label='Max Comments Per Card'
            sectionTitleSx={sectionTitleSx}
            inputSx={inputSx}
          />
          <LimitField
            control={control}
            name='feature.limits.maxChecklistItemsPerCard'
            label='Max Checklist Items Per Card'
            sectionTitleSx={sectionTitleSx}
            inputSx={inputSx}
          />
          <LimitField
            control={control}
            name='feature.limits.maxStorageMb'
            label='Max Storage (MB)'
            sectionTitleSx={sectionTitleSx}
            inputSx={inputSx}
          />
          <LimitField
            control={control}
            name='feature.limits.maxFileSizeMb'
            label='Max File Size (MB)'
            sectionTitleSx={sectionTitleSx}
            inputSx={inputSx}
          />
          <LimitField
            control={control}
            name='feature.limits.maxFilesPerUpload'
            label='Max File Uploads'
            sectionTitleSx={sectionTitleSx}
            inputSx={inputSx}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography sx={{ mb: 1, fontSize: '14px', fontWeight: 600, color: '#111827' }}>
          Description
        </Typography>

        <TextField
          fullWidth
          label='Enter Description...'
          multiline
          minRows={5}
          variant='outlined'
          error={!!errors.description}
          {...register('description', {
            required: 'Description is required'
          })}
          sx={inputSx}
        />
        <FieldErrorAlert errors={errors} fieldName='description' />
      </Box>

      <Stack direction='row' spacing={1.5} sx={{ mt: 3 }}>
        <Button
          type='submit'
          variant='contained'
          sx={{
            minWidth: 120,
            height: 40,
            px: 2,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: '#ea6b3d',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#dc5f31',
              boxShadow: 'none'
            }
          }}
        >
          Update Plan
        </Button>

        <Button
          type='button'
          variant='contained'
          onClick={() => reset(buildDefaultValues(initialData))}
          sx={{
            minWidth: 100,
            height: 40,
            px: 2,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: '#5b5b5b',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#4b4b4b',
              boxShadow: 'none'
            }
          }}
        >
          Reset
        </Button>
      </Stack>
    </Paper>
  )
}