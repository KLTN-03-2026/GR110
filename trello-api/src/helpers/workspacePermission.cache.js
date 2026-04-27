import { deleteCache, deleteCachesByPattern } from '~/helpers/cache'

const getWorkspaceAccessCacheKey = ({ workspaceId, userId }) =>
  `workspace_access:${workspaceId}:${userId}`

const invalidateWorkspaceAccessCache = async ({ workspaceId, userId }) => {
  return await deleteCache({
    key: getWorkspaceAccessCacheKey({ workspaceId, userId })
  })
}

const invalidateWorkspaceAccessCachesByWorkspace = async ({ workspaceId }) => {
  return await deleteCachesByPattern({
    pattern: `workspace_access:${workspaceId}:*`
  })
}

export {
  getWorkspaceAccessCacheKey,
  invalidateWorkspaceAccessCache,
  invalidateWorkspaceAccessCachesByWorkspace
}
