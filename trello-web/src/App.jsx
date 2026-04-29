import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
import Settings from './pages/Settings/Settings'
import BoardDetail from './pages/BoardDetail/BoardDetail.page'
import HomeLayout from './layout/Home.layout'
import WorkspaceBoardsPage from './pages/Home/WorkspaceBoards.page'
import WorkspaceMemberPage from './pages/Home/WorkspaceMembers.page'
import WorkspaceLayout from './layout/Workspace.layout'
import WorkspaceSettingsPage from './pages/Home/WorkspaceSettings.page'
import LangdingPage from './pages/Langding/LandingPage'
import WorkspaceBillingPage from './pages/Home/WorkspaceBilling.page'
import AdminLayout from './layout/Admin.layout'
import UserPage from './pages/Admin/User/User.page'
import CreateUserPage from './pages/Admin/User/Create.page'
import PlanPage from './pages/Admin/Plan/Plan.page'
import CreatePlanPage from './pages/Admin/Plan/Create.page'
import UpdateUserPage from './pages/Admin/User/Update.page'
import UpdatePlanPage from './pages/Admin/Plan/Update.page'
import BackgroundPage from './pages/Admin/Background/Background.page'
import CreateBackgroundPage from './pages/Admin/Background/Create.page'
import UpdateBackgroundPage from './pages/Admin/Background/Update.page'
import LoginPage from './pages/Admin/Auth/Login.page'
import WorkspacePage from './pages/Admin/Workspace/Workspace.page'
import PermissionPage from './pages/Admin/Permission/Permission.page'
import BoardPages from './pages/Admin/Board/Board.page'
import SubscriptionPage from './pages/Admin/Subcription/Subcription.page'
import UpdateSubscriptionPage from './pages/Admin/Subcription/UpdateSubcription.page'
import { selectCurrentAdmin } from './redux/adminUser/adminSlice'
import ProfilePage from './pages/Admin/Profile/Profile.page'
import WorkspacePaymentPage from './pages/Home/WorkspacePayment.page'
import PaymentPage from './pages/Admin/Payment/Payment.page'
import TicketPage from './pages/Tickets/Tickets.page'
import AdminTicketPage from './pages/Admin/Ticket/Ticket.page'
import { WorkspaceQuotaPage } from './pages/Home/WorkspaceQuota.page'
import Introduction from './pages/Introduction/Introduction.page'
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/auth/login" replace={true} />
  return <Outlet />
}

const ProtectedRouteAdmin = ({ admin }) => {
  if (!admin) return <Navigate to="/admin/auth/login" replace={true} />
  return <Outlet />
}

const UnauthorizedRoute = ({ user }) => {
  if (user) return <Navigate to="/h" replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  const currentAdmin = useSelector(selectCurrentAdmin)

  return (
    <Routes>
      <Route
        path="/"
        element={
          // replace = true : ví dụ truy cập route '/' thì sẽ nhảy qua trang
          // boards/6643599343c42cd4fa6c7210 và không lưu lại lịch sử trang '/'
          <Navigate to="/auth/login" replace={true} />
        }
      />

      <Route
        path="/admin"
        element={<Navigate to="/admin/auth/login" replace={true} />}
      />

      {/* Protected Routes (Hiểu đơn giản trong dự án của chúng ta là những route chỉ cho truy cập sau khi đã login) */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}

        {/* Board details  */}
        <Route path="/boards/:boardId" element={<BoardDetail />} />

        {/* Board list  */}
        <Route path="/h" element={<HomeLayout />}>
          <Route path="tickets" element={<TicketPage />} />
          <Route path="introduction" element={<Introduction/>} />

          <Route path="workspaces" element={<WorkspaceLayout />}>
            <Route
              path=":workspaceId/boards"
              element={<WorkspaceBoardsPage />}
            />

            <Route
              path=":workspaceId/members"
              element={<WorkspaceMemberPage />}
            />

            <Route
              path=":workspaceId/settings"
              element={<WorkspaceSettingsPage />}
            />

            <Route
              path=":workspaceId/billing"
              element={<WorkspaceBillingPage />}
            />

            <Route path=":workspaceId/quota" element={<WorkspaceQuotaPage />} />

            <Route
              path=":workspaceId/payment/:subscriptionId"
              element={<WorkspacePaymentPage />}
            />
          </Route>
          {/* <Route index element={<Navigate to="boards" replace />} />
          <Route path="boards" element={<BoardsOverviewPage />} />
          
          <Route
            path="workspaces/:workspaceId/billing"
            element={<WorkspaceBillingPage />}
          /> */}
        </Route>

        {/* user setting */}
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>

      <Route element={<UnauthorizedRoute user={currentUser} />}>
        {/* Authentication  */}
        <Route path="/auth/login" element={<Auth />} />
        <Route path="/auth/register" element={<Auth />} />
        <Route path="/auth/reset-password" element={<Auth />} />
        <Route path="/auth/check-email" element={<Auth />} />
        <Route path="/auth/change-password" element={<Auth />} />
        <Route path="/account/verification" element={<AccountVerification />} />
      </Route>

      <Route element={<ProtectedRouteAdmin admin={currentAdmin} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="profile" element={<ProfilePage />} />

          <Route path="ticket" element={<AdminTicketPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="user/create" element={<CreateUserPage />} />
          <Route path="user/update/:_id" element={<UpdateUserPage />} />
          <Route path="board" element={<BoardPages />} />
          <Route path="permission" element={<PermissionPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="background" element={<BackgroundPage />} />
          <Route path="background/create" element={<CreateBackgroundPage />} />
          <Route
            path="background/update/:_id"
            element={<UpdateBackgroundPage />}
          />
          <Route path="workspace" element={<WorkspacePage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route
            path="subscription/update/:_id"
            element={<UpdateSubscriptionPage />}
          />
          <Route path="plan" element={<PlanPage />} />
          <Route path="plan/create" element={<CreatePlanPage />} />
          <Route path="plan/update/:_id" element={<UpdatePlanPage />} />
        </Route>
      </Route>

      <Route path="/admin/auth/login" element={<LoginPage />} />

      {/* 404 not found  */}
      <Route
        path="*"
        element={<Navigate to="/404-not-found" replace={true} />}
      />
      <Route path="/404-not-found" element={<NotFound />} />
      <Route path="/landing-page" element={<LangdingPage />} />
    </Routes>
  )
}

export default App
