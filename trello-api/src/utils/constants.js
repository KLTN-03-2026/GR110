import { env } from '~/config/environment'
export const WHITELIST_DOMAINS = ['https://nguyenductien.cloud']

export const visibility = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  WORKSPACE: 'workspace'
}

export const WEBSITE_DOMAIN = env.WEBSITE_DOMAIN_PRODUCTION
// env.BUILD_MODE === 'production'
//   ? env.WEBSITE_DOMAIN_PRODUCTION
//   : env.WEBSITE_DOMAIN_DEVELOPMENT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const INVITATION_TYPES = {
  BOARD_INVITATION: 'BOARD_INVITATION'
}

export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}
