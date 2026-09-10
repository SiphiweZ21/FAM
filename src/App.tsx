import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AccountPage from './pages/AccountPage'
import DashboardPage from './pages/DashboardAdventurePage'
import HomePage from './pages/HomeAdventurePage'
import MissionPage from './pages/MissionAdventurePage'
import MySubjectsPage from './pages/MySubjectsPage'
import PastPapersPage from './pages/PastPapersPage'
import PaymentCallbackPage from './pages/PaymentCallbackPage'
import QuizPage from './pages/QuizAdventurePage'
import SubjectPage from './pages/SubjectRoutePage'
import SubjectsPage from './pages/SubjectsPage'
import TournamentPage from './pages/TournamentPage'

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
          path="/tournament"
          element={<TournamentPage />}
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
