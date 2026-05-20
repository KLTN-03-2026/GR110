import { useCallback, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { fetchBoardsAPI } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'

function AutoCompleteSearchBoard() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!open && !inputValue.trim()) setBoards([])
  }, [open, inputValue])

  const getCoverSx = (cover) => {
    const base = {
      width: 46,
      height: 30,
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      flexShrink: 0,
      backgroundColor: '#dbeafe'
    }

    if (cover?.type === 'color' && cover?.value)
      return { ...base, backgroundColor: cover.value }

    if (cover?.type === 'image' && cover?.value)
      return {
        ...base,
        backgroundImage: `url(${cover.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }

    return {
      ...base,
      backgroundImage: 'linear-gradient(120deg, #dbeafe 0%, #bfdbfe 100%)'
    }
  }

  const handleFetchBoards = useCallback(async (keyword) => {
    const normalizedKeyword = keyword?.trim()

    if (!normalizedKeyword) {
      setBoards([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const searchPath = `?${createSearchParams({
        q: normalizedKeyword,
        page: 1,
        itemsPerPage: 8
      })}`
      const response = await fetchBoardsAPI(searchPath)
      setBoards(response?.boards || [])
    } catch (error) {
      setBoards([])
    } finally {
      setLoading(false)
    }
  }, [])

  const debounceSearchBoard = useDebounceFn(handleFetchBoards, 550)

  useEffect(() => {
    return () => debounceSearchBoard.cancel?.()
  }, [debounceSearchBoard])

  const handleInputChange = (_, value, reason) => {
    setInputValue(value)

    if (reason === 'clear' || !value?.trim()) {
      debounceSearchBoard.cancel?.()
      setBoards([])
      setLoading(false)
      return
    }

    debounceSearchBoard(value)
  }

  return (
    <Autocomplete
      sx={{ width: { xs: 200, sm: 260, md: 300 } }}
      id="asynchronous-search-board"
      disablePortal
      filterOptions={(x) => x}
      value={null}
      inputValue={inputValue}
      options={boards}
      loading={loading}
      noOptionsText={inputValue.trim() ? 'No board found' : 'Type to search...'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={handleInputChange}
      getOptionLabel={(board) => board.title}
      isOptionEqualToValue={(option, value) => option.boardId === value.boardId}
      onChange={(_, selectedBoard) => {
        if (!selectedBoard) return
        setInputValue(selectedBoard.title || '')
        navigate(`/boards/${selectedBoard.workspaceId}/${selectedBoard.boardId}`)
      }}
      renderOption={(props, board) => (
        <Box
          component="li"
          {...props}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            px: 1,
            py: 0.9
          }}
        >
          <Box sx={getCoverSx(board.cover)} />

          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary' }}
              noWrap
            >
              {board.title}
            </Typography>
          </Box>

          <Chip
            label={board.visibility || 'private'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              borderRadius: 1,
              bgcolor:
                board.visibility === 'public'
                  ? 'rgba(46, 125, 50, 0.14)'
                  : board.visibility === 'workspace'
                    ? 'rgba(2, 136, 209, 0.14)'
                    : 'rgba(106, 27, 154, 0.14)',
              color:
                board.visibility === 'public'
                  ? '#2e7d32'
                  : board.visibility === 'workspace'
                    ? '#0288d1'
                    : '#6a1b9a'
            }}
          />
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder="Search boards..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.92)' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress sx={{ color: 'white' }} size={16} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            '& input': {
              color: 'white',
              fontSize: '0.9rem',
              '&::placeholder': {
                color: 'rgba(255,255,255,0.85)',
                opacity: 1
              }
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.10)',
              transition: 'all .2s ease',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.45)' },
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.14)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.75)' },
              '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.17)' },
              '&.Mui-focused fieldset': { borderColor: 'white', borderWidth: 1 }
            },
            '.MuiAutocomplete-clearIndicator, .MuiAutocomplete-popupIndicator': {
              color: 'rgba(255,255,255,0.85)'
            }
          }}
        />
      )}
      ListboxProps={{
        sx: {
          py: 0.75
        }
      }}
      PaperComponent={(paperProps) => (
        <Box
          {...paperProps}
          sx={{
            mt: 0.8,
            overflow: 'hidden',
            borderRadius: 2.2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: '0 14px 30px rgba(15, 23, 42, 0.16)'
          }}
        >
          {paperProps.children}
        </Box>
      )}
    />
  )
}

export default AutoCompleteSearchBoard
