import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { alpha } from '@mui/material/styles'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import randomColor from 'randomcolor'
import AssignmentIcon from '@mui/icons-material/Assignment'

function WorkspaceSidebarItem({ workspace }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const routes = useMemo(
    () => ({
      boards: `/h/workspaces/${workspace._id}/boards`,
      members: `/h/workspaces/${workspace._id}/members`,
      settings: `/h/workspaces/${workspace._id}/settings`,
      billing: `/h/workspaces/${workspace._id}/billing`,
      quota: `/h/workspaces/${workspace._id}/quota`
    }),
    [workspace._id]
  )

  const sidebarItems = useMemo(
    () => [
      {
        key: 'boards',
        label: 'Boards',
        to: routes.boards,
        icon: <DashboardOutlinedIcon fontSize="small" />
      },
      {
        key: 'members',
        label: 'Members',
        to: routes.members,
        icon: <GroupOutlinedIcon fontSize="small" />
      },
      {
        key: 'settings',
        label: 'Settings',
        to: routes.settings,
        icon: <SettingsOutlinedIcon fontSize="small" />
      },
      {
        key: 'billing',
        label: 'Billing',
        to: routes.billing,
        icon: <ReceiptLongOutlinedIcon fontSize="small" />
      },
      {
        key: 'quota',
        label: 'Quota',
        to: routes.quota,
        icon: <AssignmentIcon fontSize="small" />
      }
    ],
    [routes]
  )

  const isWorkspaceActive = sidebarItems.some((item) =>
    location.pathname.startsWith(item.to)
  )

  const isActive = (path) => location.pathname.startsWith(path)

  const avatarColor = useMemo(
    () =>
      randomColor({
        luminosity: 'dark',
        seed: workspace?._id || workspace?.title
      }),
    [workspace?._id, workspace?.title]
  )

  useEffect(() => {
    if (isWorkspaceActive) {
      setOpen(true)
    }
  }, [isWorkspaceActive])

  const toggleSection = () => {
    setOpen((prev) => !prev)
  }

  const getSubItemSx = (active) => (theme) => ({
    position: 'relative',
    minHeight: 38,
    pl: 2,
    pr: 1.5,
    py: 0.85,
    borderRadius: '12px',
    mx: 1,
    mb: 0.5,
    ml: 2.25,
    color: active ? 'primary.main' : 'text.secondary',
    bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
    border: `1px solid ${
      active ? alpha(theme.palette.primary.main, 0.16) : 'transparent'
    }`,
    '&:before': {
      content: '""',
      position: 'absolute',
      left: -10,
      top: '50%',
      width: 4,
      height: active ? 20 : 0,
      borderRadius: 999,
      bgcolor: 'primary.main',
      transform: 'translateY(-50%)',
      transition: 'height 0.18s ease'
    },
    '&:hover': {
      bgcolor: active
        ? alpha(theme.palette.primary.main, 0.14)
        : alpha(theme.palette.text.primary, 0.04),
      color: active ? 'primary.main' : 'text.primary'
    },
    '& .MuiListItemIcon-root': {
      minWidth: 32,
      color: 'inherit'
    },
    '& .MuiListItemText-primary': {
      fontSize: 13.5,
      fontWeight: active ? 700 : 600
    }
  })

  const truncateText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <>
      <ListItemButton
        onClick={toggleSection}
        sx={(theme) => ({
          borderRadius: '16px',
          mb: 0.75,
          px: 1.25,
          py: 1.15,
          alignItems: 'center',
          border: '1px solid transparent',
          bgcolor: isWorkspaceActive
            ? alpha(theme.palette.primary.main, 0.1)
            : theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.03)
              : alpha(theme.palette.common.white, 0.72),
          boxShadow: isWorkspaceActive
            ? `0 10px 24px ${alpha(theme.palette.primary.main, 0.12)}`
            : 'none',
          transition: 'all 0.18s ease',
          '&:hover': {
            bgcolor: isWorkspaceActive
              ? alpha(theme.palette.primary.main, 0.14)
              : alpha(theme.palette.primary.main, 0.06),
            borderColor: 'transparent'
          }
        })}
      >
        <ListItemIcon sx={{ minWidth: 0, mr: 1.25 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: 15,
              fontWeight: 800,
              borderRadius: 2,
              bgcolor: avatarColor,
              color: '#fff',
              boxShadow: `0 8px 18px ${alpha(avatarColor, 0.28)}`
            }}
          >
            {workspace?.title?.charAt(0)?.toUpperCase()}
          </Avatar>
        </ListItemIcon>

        <ListItemText
          primary={truncateText(workspace.title, 17)}
          secondary={`${workspace?.planName || 'Free'} plan`}
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: 800,
            lineHeight: 1.2,
            color: 'text.primary'
          }}
          secondaryTypographyProps={{
            component: 'span',
            fontSize: 11.5,
            fontWeight: 700,
            color: isWorkspaceActive ? 'primary.main' : 'text.secondary',
            sx: {
              display: 'inline-flex',
              alignItems: 'center',
              mt: 0.45,
              px: 0.75,
              py: 0.15,
              borderRadius: 999,
              bgcolor: (theme) =>
                isWorkspaceActive
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.text.primary, 0.06)
            }
          }}
          sx={{ my: 0, minWidth: 0 }}
        />

        <Box
          sx={(theme) => ({
            width: 28,
            height: 28,
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            color: isWorkspaceActive ? 'primary.main' : 'text.secondary',
            bgcolor: isWorkspaceActive
              ? alpha(theme.palette.primary.main, 0.1)
              : 'transparent',
            flexShrink: 0
          })}
        >
          {open ? (
            <ExpandLess sx={{ fontSize: 20 }} />
          ) : (
            <ExpandMore sx={{ fontSize: 20 }} />
          )}
        </Box>
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {sidebarItems.map((item) => {
            const active = isActive(item.to)

            return (
              <ListItemButton
                key={item.key}
                component={RouterLink}
                to={item.to}
                sx={getSubItemSx(active)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>

                <ListItemText primary={item.label} />
              </ListItemButton>
            )
          })}
        </List>
      </Collapse>
    </>
  )
}

export default WorkspaceSidebarItem
