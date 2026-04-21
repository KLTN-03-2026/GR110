export function getFeatureDisplayData(feature) {
  const limits = feature?.limits || {}
  const capabilities = feature?.capabilities || {}

  const limitSummary = [
    `${limits.maxMembers ?? 0} members`,
    `${limits.maxBoards ?? 0} boards`,
    `${limits.maxColumnsPerBoard ?? 0} cols/board`,
    `${limits.maxStorageMb ?? 0}MB storage`
  ]

  const enabledCapabilities = [
    capabilities?.workspace?.customRole && 'Custom role',
    capabilities?.board?.customRole && 'Board role',
    capabilities?.board?.createPrivateBoard && 'Private board',
    capabilities?.column?.customColor && 'Custom color',
    capabilities?.task?.setDue && 'Set due',
    capabilities?.task?.assignMembers && 'Assign members'
  ].filter(Boolean)

  return {
    limitLine: limitSummary.join(' • '),
    capabilityLine:
      enabledCapabilities.length > 0
        ? enabledCapabilities.join(' • ')
        : 'No extra features enabled',
    detailLines: [
      `Members: ${limits.maxMembers ?? 0}`,
      `Boards: ${limits.maxBoards ?? 0}`,
      `Columns/Board: ${limits.maxColumnsPerBoard ?? 0}`,
      `Cards/Board: ${limits.maxCardsPerBoard ?? 0}`,
      `Comments/Card: ${limits.maxCommentsPerCard ?? 0}`,
      `Checklist Items/Card: ${limits.maxChecklistItemsPerCard ?? 0}`,
      `Storage: ${limits.maxStorageMb ?? 0}MB`,
      `File Size: ${limits.maxFileSizeMb ?? 0}MB`,
      `Workspace Custom Role: ${capabilities?.workspace?.customRole ? 'Yes' : 'No'}`,
      `Board Custom Role: ${capabilities?.board?.customRole ? 'Yes' : 'No'}`,
      `Private Board: ${capabilities?.board?.createPrivateBoard ? 'Yes' : 'No'}`,
      `Column Custom Color: ${capabilities?.column?.customColor ? 'Yes' : 'No'}`,
      `Task Set Due: ${capabilities?.task?.setDue ? 'Yes' : 'No'}`,
      `Task Assign Members: ${capabilities?.task?.assignMembers ? 'Yes' : 'No'}`
    ]
  }
}