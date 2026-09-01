import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AccountPage from './pages/AccountPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import MissionPage from './pages/MissionPage'
import MySubjectsPage from './pages/MySubjectsPage'
import PastPapersPage from './pages/PastPapersPage'
import PaymentCallbackPage from './pages/PaymentCallbackPage'
import QuizPage from './pages/QuizPage'
import SubjectPage from './pages/SubjectPage'
import SubjectsPage from './pages/SubjectsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/subjects"
          element={<SubjectsPage />}
        />

        <Route
          path="/my-subjects"
          element={<MySubjectsPage />}
        />

        <Route
          path="/subjects/:subjectId"
          element={<SubjectPage />}
        />

        <Route
          path="/subjects/:subjectId/past-papers"
          element={<PastPapersPage />}
        />

        <Route
          path="/subjects/:subjectId/:topicId/:missionId"
          element={<MissionPage />}
        />

        <Route
          path="/quiz/:subjectId/:topicId/:missionId"
          element={<QuizPage />}
        />

        <Route
          path="/account"
          element={<AccountPage />}
        />

        <Route
          path="/payment/callback"
          element={<PaymentCallbackPage />}
        />
      </Route>
    </Routes>
  )
}
