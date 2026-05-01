import { useEffect, useMemo, useState } from 'react'
import { useColorScheme } from '@mui/material/styles'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

function CardDescriptionMdEditor({
  cardDescriptionProp = '',
  handleUpdateCardDescription
}) {
  const { mode } = useColorScheme()

  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState(
    cardDescriptionProp || ''
  )
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setCardDescription(cardDescriptionProp || '')
  }, [cardDescriptionProp])

  const normalizedOriginalValue = useMemo(
    () => (cardDescriptionProp || '').trim(),
    [cardDescriptionProp]
  )

  const normalizedCurrentValue = useMemo(
    () => (cardDescription || '').trim(),
    [cardDescription]
  )

  const isChanged = normalizedCurrentValue !== normalizedOriginalValue

  const handleEdit = () => {
    setMarkdownEditMode(true)
  }

  const handleCancel = () => {
    setCardDescription(cardDescriptionProp || '')
    setMarkdownEditMode(false)
  }

  const handleSave = async () => {
    if (!isChanged) {
      setMarkdownEditMode(false)
      return
    }

    try {
      setIsSaving(true)
      await handleUpdateCardDescription(normalizedCurrentValue)
      setMarkdownEditMode(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box sx={{ mt: 1.5 }}>
      {markdownEditMode ? (
        <Stack spacing={1.5}>
          <Box
            data-color-mode={mode}
            sx={{
              '& .w-md-editor': {
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: 'primary.main',
                transition: 'all 0.2s ease'
              },
              '& .w-md-editor-toolbar': {
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(0,0,0,0.01)'
              }
            }}
          >
            <MDEditor
              value={cardDescription}
              onChange={(value) => setCardDescription(value || '')}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={320}
              preview="edit"
              visibleDragbar={false}
            />
          </Box>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={handleCancel}
              disabled={isSaving}
              sx={{ textTransform: 'none', borderRadius: 1.5 }}
            >
              Cancel
            </Button>

            <Button
              className="interceptor-loading"
              type="button"
              variant="contained"
              onClick={handleSave}
              disabled={!isChanged || isSaving}
              sx={{ textTransform: 'none', borderRadius: 1.5 }}
            >
              Save changes
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={1.5}>
          {cardDescription ? (
            <Box
              data-color-mode={mode}
              sx={{
                px: 1.75,
                py: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(0,0,0,0.01)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(0,0,0,0.02)',
                  borderColor: 'primary.main',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0,0,0,0.2)'
                      : '0 2px 8px rgba(0,0,0,0.06)'
                }
              }}
              onClick={handleEdit}
            >
              <MDEditor.Markdown
                source={cardDescription}
                style={{
                  whiteSpace: 'pre-wrap',
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}
              />
            </Box>
          ) : (
            <Box
              onClick={handleEdit}
              sx={{
                px: 2,
                py: 2.5,
                minHeight: 100,
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(0,0,0,0.01)',
                color: 'text.secondary',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(0,0,0,0.02)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0,0,0,0.2)'
                      : '0 2px 8px rgba(0,0,0,0.06)'
                }
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                Add a more detailed description...
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  )
}

export default CardDescriptionMdEditor
