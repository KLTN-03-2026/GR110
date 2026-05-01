import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import Box from '@mui/material/Box'
import useCardDetail from '~/hooks/cardDetail.hook'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CardDetailActionButton from './ActionButton/_CardDetailActionButton'
import CardHeader from './CardHeader/_CardHeader'
import CardDateBadge from '../CardDateBadge'
import CardChecklist from './Checklist/CardChecklist'
import CardMemberGroup from './CardMemberGroup'
import CardAttachment from './Attachment/CardAttachment'
import CardLabelGroup from './CardLabelGroup'
import CardDetailModalSkeleton from './CardDetailModalSkeleton'
import { useTheme } from '@mui/material/styles'

function CardDetailModal() {
  const {
    activeCard,
    isShowModalActiveCard,
    handleCloseModal,
    handleUpdateCardTitle,
    handleUpdateCardDescription,
    data,
    handler
  } = useCardDetail()

  const theme = useTheme()
  const { handleUpdateIsCompleted } = handler

  // Show skeleton while loading
  const isLoading = isShowModalActiveCard && !activeCard

  return (
    <Modal
      open={isShowModalActiveCard}
      onClose={handleCloseModal}
      sx={{
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        pt: 7.3,
        backdropFilter: 'blur(2px)'
      }}
    >
      {isLoading ? (
        <CardDetailModalSkeleton />
      ) : (
        <Box
          component="div"
          sx={{
            position: 'relative',
            width: 1300,
            maxWidth: '100%',
            maxHeight: '90vh',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 25px 50px rgba(0,0,0,0.6)'
                : '0 25px 50px rgba(9,30,66,0.25)',
            borderRadius: 8,
            border: 'none',
            outline: 0,
            padding: '40px 20px 20px',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              from: {
                opacity: 0,
                transform: 'scale(0.95) translateY(-20px)'
              },
              to: {
                opacity: 1,
                transform: 'scale(1) translateY(0)'
              }
            }
          }}
        >
          {/* Header cố định, không co giãn */}
          <Box sx={{ flexShrink: 0 }}>
            <CardHeader
              data={data.cardHeader}
              handler={handler.cardHeader}
              attachmentHandlers={handler.attachments}
              attachmentData={data.attachments}
            />
          </Box>

          {/* Body dùng flex thay Grid — dễ kiểm soát scroll hơn */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              gap: '32px',
              mt: 3
            }}
          >
            {/* Left side */}
            <Box
              sx={{
                flex: 8,
                minWidth: 0,
                minHeight: 0,
                overflowY: 'auto',
                pr: 1.5,
                '&::-webkit-scrollbar': {
                  width: '6px'
                },
                '&::-webkit-scrollbar-track': {
                  bg: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  bg:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.1)',
                  borderRadius: '3px',
                  '&:hover': {
                    bg:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.2)'
                  }
                }
              }}
            >
              {/* Title with completion icon */}
              <Box
                sx={{
                  pr: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 3
                }}
              >
                <Box
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUpdateIsCompleted()
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    color: activeCard?.isCompleted
                      ? '#4caf50'
                      : 'text.disabled',
                    '&:hover': {
                      cursor: 'pointer',
                      color: activeCard?.isCompleted
                        ? '#45a049'
                        : 'text.secondary',
                      transform: 'scale(1.08)'
                    }
                  }}
                >
                  {activeCard?.isCompleted ? (
                    <CheckCircleIcon sx={{ fontSize: 36, flexShrink: 0 }} />
                  ) : (
                    <RadioButtonUncheckedIcon
                      sx={{ fontSize: 36, flexShrink: 0 }}
                    />
                  )}
                </Box>

                <ToggleFocusInput
                  inputFontSize="28px"
                  value={activeCard?.title}
                  onChangedValue={handleUpdateCardTitle}
                  sx={{
                    fontWeight: 700,
                    '& input': {
                      fontWeight: 700,
                      lineHeight: 1.4
                    }
                  }}
                />
              </Box>

              {/* Action buttons */}
              <Box sx={{ mb: 4 }}>
                <CardDetailActionButton
                  data={data.cardButton}
                  handler={handler.cardButton}
                  activeCard={activeCard}
                />
              </Box>

              {/* Labels section */}
              {activeCard?.labelIds?.length > 0 && (
                <Box
                  sx={{
                    mb: 4,
                    pb: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <CardLabelGroup labelIds={activeCard?.labelIds} />
                </Box>
              )}

              {/* Members section */}
              {activeCard?.memberIds?.length > 0 && (
                <Box
                  sx={{
                    mb: 4,
                    pb: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2
                    }}
                  >
                    <Typography
                      variant="span"
                      sx={{
                        fontWeight: 700,
                        fontSize: '16px',
                        color: 'text.primary'
                      }}
                    >
                      Members
                    </Typography>
                  </Box>
                  <CardMemberGroup
                    memberIds={activeCard?.memberIds}
                    handler={handler.cardButton}
                  />
                </Box>
              )}

              {/* Dates section */}
              {(activeCard?.startedAt || activeCard?.dueAt) && (
                <Box
                  sx={{
                    mb: 4,
                    pb: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2
                    }}
                  >
                    <Typography
                      variant="span"
                      sx={{
                        fontWeight: 700,
                        fontSize: '16px',
                        color: 'text.primary'
                      }}
                    >
                      Dates
                    </Typography>
                  </Box>
                  <CardDateBadge
                    startedAt={activeCard?.startedAt}
                    dueAt={activeCard?.dueAt}
                    isCompleted={activeCard?.isCompleted}
                    handleUpdate={handler.cardButton.handleUpdateCardDates}
                    clickable={true}
                  />
                </Box>
              )}

              {/* Description section */}
              <Box
                sx={{
                  mb: 4,
                  pb: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 2
                  }}
                >
                  <SubjectRoundedIcon sx={{ fontSize: 22 }} />
                  <Typography
                    variant="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: '16px',
                      color: 'text.primary'
                    }}
                  >
                    Description
                  </Typography>
                </Box>
                <CardDescriptionMdEditor
                  cardDescriptionProp={activeCard?.description}
                  handleUpdateCardDescription={handleUpdateCardDescription}
                />
              </Box>

              {/* Attachments section */}
              {data.attachments?.attachments?.length > 0 && (
                <Box
                  sx={{
                    mb: 4,
                    pb: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <CardAttachment
                    data={data.attachments}
                    handler={handler.attachments}
                  />
                </Box>
              )}

              {/* Checklists section */}
              {data.checklists?.checklists?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <CardChecklist
                    data={data.checklists.checklists}
                    handler={handler.checklists}
                  />
                </Box>
              )}
            </Box>

            {/* Right side - Activity */}
            <Box
              sx={{
                flex: 5,
                minWidth: 0,
                minHeight: 0,
                overflowY: 'auto',
                pr: 1.5,
                '&::-webkit-scrollbar': {
                  width: '6px'
                },
                '&::-webkit-scrollbar-track': {
                  bg: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  bg:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.1)',
                  borderRadius: '3px',
                  '&:hover': {
                    bg:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.2)'
                  }
                }
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}
              >
                <ChatOutlinedIcon sx={{ fontSize: 22 }} />
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: '700',
                    fontSize: '16px',
                    color: 'text.primary'
                  }}
                >
                  Activity
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <CardActivitySection
                  data={data.cardActivity}
                  handler={handler.cardActivity}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Modal>
  )
}

export default CardDetailModal
