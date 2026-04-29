import {
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useWorkspaceMember } from '~/hooks/workspaceMember.hook'
import Diversity2RoundedIcon from '@mui/icons-material/Diversity2Rounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import WorkspaceMemberTable from '~/components/Workspace/WorkspaceMemberTable'
import InviteUserWorkspaceModal from '~/components/Workspace/InviteUserWorkspaceModal'
import WorkspacePageHeader from '~/components/Workspace/WorkspacePageHeader'

function WorkspaceMemberPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const {
    members,
    roles,
    page,
    memberKeyword,
    totalCount,
    handleMemberSearchChange,
    handleOpenInviteModal,
    handleChangeMemberRole,
    handleLeaveWorkspace,
    handleRemoveMember,
    inviteModal,
    isLoading,
    handleChangePage
  } = useWorkspaceMember()

  return (
    <>
      <WorkspacePageHeader
        badgeIcon={<GroupsRoundedIcon sx={{ fontSize: 13 }} />}
        badgeLabel="People & Access"
        title="Workspace Members"
        description={`${totalCount ?? 0} member${
          (totalCount ?? 0) !== 1 ? 's' : ''
        } - Manage roles and access`}
      >
        <Button
          onClick={handleOpenInviteModal}
          startIcon={<PersonAddRoundedIcon />}
          variant="contained"
          sx={(theme) => ({
            fontWeight: 700,
            borderRadius: '999px',
            px: 2.5,
            py: 1.1,
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.12)'
                : 'primary.main',
            color:
              theme.palette.mode === 'dark'
                ? 'common.white'
                : 'primary.contrastText',
            border: `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.18)'
                : 'transparent'
            }`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? 'none'
                : '0 8px 24px rgba(37,99,235,0.24)',
            '&:hover': {
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.18)'
                  : 'primary.dark',
              transform: 'translateY(-1px)',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? 'none'
                  : '0 12px 30px rgba(37,99,235,0.30)'
            }
          })}
        >
          Invite Members
        </Button>
      </WorkspacePageHeader>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Diversity2RoundedIcon
            sx={{
              color: isDark ? '#93c5fd' : theme.palette.primary.main,
              fontSize: 20
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            Manage member access, role assignments, and invitations in one
            place.
          </Typography>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)',
          overflow: 'hidden',
          mb: 2.5
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>
            Member Directory
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 0.25 }}
          >
            Search members and update their workspace roles.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Diversity2RoundedIcon
              fontSize="small"
              sx={{ color: 'text.secondary' }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                whiteSpace: 'nowrap'
              }}
            >
              Filter members
            </Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Search by name or email..."
            value={memberKeyword}
            onChange={handleMemberSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    fontSize="small"
                    sx={{ color: 'text.disabled' }}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              maxWidth: 380,
              '& .MuiOutlinedInput-root': { borderRadius: '12px' }
            }}
          />

          <Chip
            label={`${totalCount ?? 0} total`}
            size="small"
            sx={{
              ml: 'auto',
              fontWeight: 700,
              fontSize: '0.75rem',
              backgroundColor: alpha(
                theme.palette.primary.main,
                isDark ? 0.15 : 0.08
              ),
              color: 'primary.main',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          />
        </Box>

        <Box sx={{ px: 2, pb: 2 }}>
          <WorkspaceMemberTable
            members={members}
            roles={roles}
            totalCount={totalCount}
            page={page}
            onPageChange={handleChangePage}
            handleChangeMemberRole={handleChangeMemberRole}
            handleLeaveWorkspace={handleLeaveWorkspace}
            handleRemoveMember={handleRemoveMember}
            isLoading={isLoading}
          />
        </Box>
      </Paper>

      <InviteUserWorkspaceModal {...inviteModal} />
    </>
  )
}

export default WorkspaceMemberPage
