import { Box, Button, Chip, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useWorkspaceMember } from '~/hooks/workspaceMember.hook'
import Diversity2RoundedIcon from '@mui/icons-material/Diversity2Rounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import WorkspaceMemberTable from '~/components/Workspace/WorkspaceMemberTable'
import InviteUserWorkspaceModal from '~/components/Workspace/InviteUserWorkspaceModal'

const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

function WorkspaceMemberPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const {
    members,
    roles,
    memberKeyword,
    handleMemberSearchChange,
    handleOpenInviteModal,
    handleChangeMemberRole,
    handleLeaveWorkspace,
    handleRemoveMember,
    inviteModal
  } = useWorkspaceMember()

  return (
    <>
      {/* ── Hero header banner ── */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
          color: 'white',
          px: { xs: 3, md: 5 },
          py: { xs: 3.5, md: 4 },
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={dotPatternSx} />

        {/* Glow orb */}
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.22) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            icon={<GroupsRoundedIcon sx={{ fontSize: 13, color: '#93c5fd !important' }} />}
            label="People & Access"
            size="small"
            sx={{
              mb: 1.5,
              backgroundColor: 'rgba(255,255,255,0.10)',
              color: '#bfdbfe',
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: 1,
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)'
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: 22, md: 28 },
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              mb: 0.5
            }}
          >
            Workspace Members
          </Typography>
          <Typography sx={{ opacity: 0.72, fontSize: '0.875rem' }}>
            {members?.length ?? 0} member{(members?.length ?? 0) !== 1 ? 's' : ''} · Manage roles and access
          </Typography>
        </Box>

        <Button
          onClick={handleOpenInviteModal}
          startIcon={<PersonAddRoundedIcon />}
          variant="contained"
          sx={{
            position: 'relative',
            zIndex: 1,
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '999px',
            px: 3,
            py: 1.2,
            fontSize: '0.9rem',
            backgroundColor: 'white',
            color: '#1d4ed8',
            boxShadow: '0 6px 20px rgba(0,0,0,0.20)',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.92)',
              transform: 'translateY(-1px)',
              boxShadow: '0 10px 28px rgba(0,0,0,0.25)'
            }
          }}
        >
          Invite Members
        </Button>
      </Box>

      {/* ── Filter bar ── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Diversity2RoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
            Filter members
          </Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Search by name or email…"
          value={memberKeyword}
          onChange={handleMemberSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            )
          }}
          sx={{
            maxWidth: 380,
            '& .MuiOutlinedInput-root': { borderRadius: '12px' }
          }}
        />

        <Chip
          label={`${members?.length ?? 0} total`}
          size="small"
          sx={{
            ml: 'auto',
            fontWeight: 700,
            fontSize: '0.75rem',
            backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.15 : 0.08),
            color: 'primary.main',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        />
      </Paper>

      {/* ── Member table ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        <WorkspaceMemberTable
          members={members}
          roles={roles}
          handleChangeMemberRole={handleChangeMemberRole}
          handleLeaveWorkspace={handleLeaveWorkspace}
          handleRemoveMember={handleRemoveMember}
        />
      </Paper>

      <InviteUserWorkspaceModal {...inviteModal} />
    </>
  )
}

export default WorkspaceMemberPage