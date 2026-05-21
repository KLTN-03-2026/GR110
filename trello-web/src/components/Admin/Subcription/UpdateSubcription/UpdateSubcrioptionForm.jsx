import React from 'react'
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { CapabilityCheckbox } from '../../Plan/CreatePlan/CapabilityCheckbox'
import { LimitField } from '../../Plan/CreatePlan/LimitField'
import { updateAdminSubscriptionApi } from '~/apis/adminSubscription.api'
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
  workspaceId: initialData?.workspaceId || '',
  workspaceTitle: initialData?.workspaceTitle || '',
  planId: initialData?.planId || '',
  planTitle: initialData?.planTitle || '',
  status: initialData?.status || 'pending',
  startedAt: initialData?.startedAt
    ? new Date(initialData.startedAt).toISOString().split('T')[0]
    : '',
  endedAt: initialData?.endedAt
    ? new Date(initialData.endedAt).toISOString().split('T')[0]
    : '',
  cancelAt: initialData?.cancelAt
    ? new Date(initialData.cancelAt).toISOString().split('T')[0]
    : '',
  planFeatureSnapshot: {
    capabilities: {
      workspace: {
        customRole:
          initialData?.planFeatureSnapshot?.capabilities?.workspace?.customRole ??
          false
      },
      board: {
        customRole:
          initialData?.planFeatureSnapshot?.capabilities?.board?.customRole ??
          false
      },
      column: {
        customColor:
          initialData?.planFeatureSnapshot?.capabilities?.column?.customColor ??
          false
      },
      task: {
        setDue:
          initialData?.planFeatureSnapshot?.capabilities?.task?.setDue ?? false,
        assignMembers:
          initialData?.planFeatureSnapshot?.capabilities?.task?.assignMembers ??
          false
      }
    },
    limits: {
      maxMembers:
        initialData?.planFeatureSnapshot?.limits?.maxMembers ?? 5,
      maxBoards:
        initialData?.planFeatureSnapshot?.limits?.maxBoards ?? 3,
      maxWorkspaceRoles:
        initialData?.planFeatureSnapshot?.limits?.maxWorkspaceRoles ?? 0,
      maxBoardRoles:
        initialData?.planFeatureSnapshot?.limits?.maxBoardRoles ?? 0,
      maxColumnsPerBoard:
        initialData?.planFeatureSnapshot?.limits?.maxColumnsPerBoard ?? 20,
      maxCardsPerBoard:
        initialData?.planFeatureSnapshot?.limits?.maxCardsPerBoard ?? 100,
      maxCommentsPerCard:
        initialData?.planFeatureSnapshot?.limits?.maxCommentsPerCard ?? 50,
      maxChecklistItemsPerCard:
        initialData?.planFeatureSnapshot?.limits?.maxChecklistItemsPerCard ?? 20,
      maxStorageMb:
        initialData?.planFeatureSnapshot?.limits?.maxStorageMb ?? 512,
      maxFileSizeMb:
        initialData?.planFeatureSnapshot?.limits?.maxFileSizeMb ?? 5,
      maxFilesPerUpload:
        initialData?.planFeatureSnapshot?.limits?.maxFilesPerUpload ?? 5
    }
  }

})

export default function UpdateSubscriptionForm({ initialData, onSubmitForm }) {
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

  const { _id } = useParams()

  const onSubmit = async (data) => {
    const payload = {
      workspaceId: data.workspaceId,
      planId: data.planId,
      status: data.status,
      startedAt: data.startedAt,
      endedAt: data.endedAt || null,
      cancelAt: data.cancelAt || null,
      planFeatureSnapshot: {
        capabilities: {
          workspace: {
            customRole:
              !!data.planFeatureSnapshot.capabilities.workspace.customRole
          },
          board: {
            customRole:
              !!data.planFeatureSnapshot.capabilities.board.customRole
          },
          column: {
            customColor:
              !!data.planFeatureSnapshot.capabilities.column.customColor
          },
          task: {
            setDue:
              !!data.planFeatureSnapshot.capabilities.task.setDue,
            assignMembers:
              !!data.planFeatureSnapshot.capabilities.task.assignMembers
          }
        },
        limits: {
          maxMembers: Number(data.planFeatureSnapshot.limits.maxMembers),
          maxBoards: Number(data.planFeatureSnapshot.limits.maxBoards),
          maxWorkspaceRoles: Number(data.planFeatureSnapshot.limits.maxWorkspaceRoles),
          maxBoardRoles: Number(data.planFeatureSnapshot.limits.maxBoardRoles),
          maxColumnsPerBoard: Number(data.planFeatureSnapshot.limits.maxColumnsPerBoard),
          maxCardsPerBoard: Number(data.planFeatureSnapshot.limits.maxCardsPerBoard),
          maxCommentsPerCard: Number(data.planFeatureSnapshot.limits.maxCommentsPerCard),
          maxChecklistItemsPerCard: Number(
            data.planFeatureSnapshot.limits.maxChecklistItemsPerCard
          ),
          maxStorageMb: Number(data.planFeatureSnapshot.limits.maxStorageMb),
          maxFileSizeMb: Number(data.planFeatureSnapshot.limits.maxFileSizeMb),
          maxFilesPerUpload: Number(data.planFeatureSnapshot.limits.maxFilesPerUpload)
        }
      }
    }

    await updateAdminSubscriptionApi({ subscriptionId: _id, subscriptionData: payload })
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
          <Typography sx={sectionTitleSx}>Workspace</Typography>

          <TextField
            fullWidth
            value={defaultValues.workspaceTitle || ''}
            InputProps={{
              readOnly: true
            }}
            sx={inputSx}
          />

          <input type="hidden" {...register('workspaceId')} />
        </Box>

        <Box>
          <Typography sx={sectionTitleSx}>Plan</Typography>

          <TextField
            fullWidth
            value={defaultValues.planTitle || ''}
            InputProps={{
              readOnly: true
            }}
            sx={inputSx}
          />

          <input type="hidden" {...register('planId')} />
        </Box>

        <Box>
          <Typography sx={sectionTitleSx}>Status</Typography>

          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select {...field} sx={selectSx}>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='trialing'>Trialing</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='past_due'>Past Due</MenuItem>
                  <MenuItem value='canceled'>Canceled</MenuItem>
                  <MenuItem value='expired'>Expired</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>

        <Box>
          <Typography sx={sectionTitleSx}>Start At</Typography>

          <TextField
            fullWidth
            type='date'
            error={!!errors.startedAt}
            {...register('startedAt', {
              required: 'Start date is required'
            })}
            sx={inputSx}
            InputLabelProps={{ shrink: true }}
          />
          <FieldErrorAlert errors={errors} fieldName='startedAt' />
        </Box>

        <Box>
          <Typography sx={sectionTitleSx}>End At</Typography>

          <TextField
            fullWidth
            type='date'
            {...register('endedAt')}
            sx={inputSx}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Box>
          <Typography sx={sectionTitleSx}>Cancel At</Typography>

          <TextField
            fullWidth
            type='date'
            {...register('cancelAt')}
            sx={inputSx}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#111827', mb: 2 }}>
          Plan Feature Snapshot - Capabilities
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
            name='planFeatureSnapshot.capabilities.workspace.customRole'
            label='Workspace Custom Role'
          />
          <CapabilityCheckbox
            control={control}
            name='planFeatureSnapshot.capabilities.board.customRole'
            label='Board Custom Role'
          />
          <CapabilityCheckbox
            control={control}
            name='planFeatureSnapshot.capabilities.column.customColor'
            label='Column Custom Color'
          />
          <CapabilityCheckbox
            control={control}
            name='planFeatureSnapshot.capabilities.task.setDue'
            label='Task Set Due'
          />
          <CapabilityCheckbox
            control={control}
            name='planFeatureSnapshot.capabilities.task.assignMembers'
            label='Task Assign Members'
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#111827', mb: 2 }}>
          Plan Feature Snapshot - Limits
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3
          }}
        >
          <LimitField control={control} name='planFeatureSnapshot.limits.maxMembers' label='Max Members' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxBoards' label='Max Boards' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxWorkspaceRoles' label='Max Workspace Roles' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxBoardRoles' label='Max Board Roles' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxColumnsPerBoard' label='Max Columns Per Board' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxCardsPerBoard' label='Max Cards Per Board' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxCommentsPerCard' label='Max Comments Per Card' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxChecklistItemsPerCard' label='Max Checklist Items Per Card' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxStorageMb' label='Max Storage (MB)' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxFileSizeMb' label='Max File Size (MB)' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
          <LimitField control={control} name='planFeatureSnapshot.limits.maxFilesPerUpload' label='Max File Uploads' sectionTitleSx={sectionTitleSx} inputSx={inputSx} />
        </Box>
      </Box>

      <Stack direction='row' spacing={1.5} sx={{ mt: 3 }}>
        <Button
          type='submit'
          variant='contained'
          sx={{
            minWidth: 170,
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
          Update Subscription
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