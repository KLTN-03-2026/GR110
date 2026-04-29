import BoardList from '~/components/Board/BoardList'
import Box from '@mui/material/Box'
import { useWorkspaceBoards } from '~/hooks/workspaceBoard.hook'

function WorkspaceBoardsPage() {
  const { ui, data, handler } = useWorkspaceBoards()
  const { isLoading } = ui
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <BoardList
        ui={ui.boardList}
        data={data.boardList}
        handler={handler.boardList}
        isLoading={isLoading}
      />
    </Box>
  )
}
export default WorkspaceBoardsPage
