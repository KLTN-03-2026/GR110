import UpdateWorkspaceModal from '~/components/Workspace/UpdateWorkspaceModal'
import WorkspaceHeader from '~/components/Workspace/WorkspaceHeader'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import { useWorkspaceLayout } from '~/hooks/workspaceLayout.hook'

function WorkspaceLayout() {
  const { workspace, updateModal, handleOpenUpdateModal } = useWorkspaceLayout()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: 'calc(100vh - 125px)',
        overflow: 'hidden'
      }}
    >
      <WorkspaceHeader
        workspace={workspace}
        handleOpenUpdateModal={handleOpenUpdateModal}
      />
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0, pr: 0.5 }}>
        <Outlet context={{ workspace }} />
      </Box>
      <UpdateWorkspaceModal {...updateModal} />
    </Box>
  )
}
export default WorkspaceLayout
