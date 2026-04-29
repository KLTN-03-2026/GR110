import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchWorkspaceQuota } from '~/apis/workspace.api'

export function useQuota() {
  const [quota, setQuota] = useState()
  const { workspaceId } = useParams()

  useEffect(() => {
    const fetchQuota = async () => {
      const response = await fetchWorkspaceQuota(workspaceId)
      console.log(response.quota);
      
      setQuota(response.quota)
    }

    fetchQuota()
  }, [workspaceId])
  return {
    quota
  }
}
