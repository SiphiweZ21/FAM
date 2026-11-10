import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { initializeLearningSession } from './lib/learning-session'
import { retireGuestSession } from './lib/guest'
import { initializeGradeOneProgressSync } from './lib/grade-one-sync'

const PlannedSubjectPage = lazy(() => import('./pages/PlannedSubjectPage'))
const TermProgrammePage = lazy(() => import('./pages/TermProgrammePage'))
const LearningUnitPage = lazy(() => import('./pages/LearningUnitPage'))

const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'))
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const DashboardPage = lazy(() => import('./pages/DashboardAdventurePage'))
const HomePage = lazy(() => import('./pages/HomeAdventurePage'))
const MissionPage = lazy(() => import('./pages/MissionAdventurePage'))
const MySubjectsPage = lazy(() => import('./pages/MySubjectsPage'))
const PastPapersPage = lazy(() => import('./pages/PastPapersPage'))
const PaymentCallbackPage = lazy(() => import('./pages/PaymentCallbackPage'))
const QuizPage = lazy(() => import('./pages/QuizAdventurePage'))
const SubjectPage = lazy(() => import('./pages/SubjectRoutePage'))
const SubjectsPage = lazy(() => import('./pages/SubjectsPage'))
const TournamentPage = lazy(() => import('./pages/TournamentPage'))
const TopicLessonPage = lazy(() => import('./pages/TopicLessonPage'))
const GradeHubPage = lazy(() => import('./pages/GradeHubPage'))
const GradeOneMathPage = lazy(() => import('./pages/GradeOneMathPage'))
const GradeOneMathWorldPage = lazy(() => import('./pages/GradeOneMathWorldPage'))
const GradeOnePracticePage = lazy(() => import('./pages/GradeOnePracticePage'))
const GradeOneWordWorldPage = lazy(() => import('./pages/GradeOneWordWorldPage'))
const GradeOneWordPracticePage = lazy(() => import('./pages/GradeOneWordPracticePage'))
const GradeOneLifeSkillsWorldPage = lazy(() => import('./pages/GradeOneLifeSkillsWorldPage'))
const GradeOneLifeSkillsPracticePage = lazy(() => import('./pages/GradeOneLifeSkillsPracticePage'))
const GradeOneCodingWorldPage = lazy(() => import('./pages/GradeOneCodingWorldPage'))
const GradeOneCodingPracticePage = lazy(() => import('./pages/GradeOneCodingPracticePage'))
const GradeTwoMathWorldPage = lazy(() => import('./pages/GradeTwoMathWorldPage'))
const GradeTwoMathPracticePage = lazy(() => import('./pages/GradeTwoMathPracticePage'))
const GradeTwoWordWorldPage = lazy(() => import('./pages/GradeTwoWordWorldPage'))
const GradeTwoWordPracticePage = lazy(() => import('./pages/GradeTwoWordPracticePage'))
const GradeTwoLifeSkillsWorldPage = lazy(() => import('./pages/GradeTwoLifeSkillsWorldPage'))
const GradeTwoLifeSkillsPracticePage = lazy(() => import('./pages/GradeTwoLifeSkillsPracticePage'))
const GradeTwoCodingWorldPage = lazy(() => import('./pages/GradeTwoCodingWorldPage'))
const GradeTwoCodingPracticePage = lazy(() => import('./pages/GradeTwoCodingPracticePage'))
const GradeThreeMathWorldPage = lazy(() => import('./pages/GradeThreeMathWorldPage'))
const GradeThreeMathPracticePage = lazy(() => import('./pages/GradeThreeMathPracticePage'))
const GradeThreeWordWorldPage = lazy(() => import('./pages/GradeThreeWordWorldPage'))
const GradeThreeWordPracticePage = lazy(() => import('./pages/GradeThreeWordPracticePage'))
const GradeThreeLifeSkillsWorldPage = lazy(() => import('./pages/GradeThreeLifeSkillsWorldPage'))
const GradeThreeLifeSkillsPracticePage = lazy(() => import('./pages/GradeThreeLifeSkillsPracticePage'))
const GradeThreeCodingWorldPage = lazy(() => import('./pages/GradeThreeCodingWorldPage'))
const GradeThreeCodingPracticePage = lazy(() => import('./pages/GradeThreeCodingPracticePage'))
const InteractiveFractionsPage = lazy(() => import('./pages/InteractiveFractionsPage'))
const InteractiveCurriculumPage = lazy(() => import('./pages/InteractiveCurriculumPage'))
const GradeFourMathWorldPage = lazy(() => import('./pages/GradeFourMathWorldPage'))
const GradeFourMathPracticePage = lazy(() => import('./pages/GradeFourMathPracticePage'))
const GradeFourWordWorldPage = lazy(() => import('./pages/GradeFourWordWorldPage'))
const GradeFourWordPracticePage = lazy(() => import('./pages/GradeFourWordPracticePage'))
const GradeFourScienceWorldPage = lazy(() => import('./pages/GradeFourScienceWorldPage'))
const GradeFourSciencePracticePage = lazy(() => import('./pages/GradeFourSciencePracticePage'))
const GradeFourSocialSciencesWorldPage = lazy(() => import('./pages/GradeFourSocialSciencesWorldPage'))
const GradeFourSocialSciencesPracticePage = lazy(() => import('./pages/GradeFourSocialSciencesPracticePage'))
const GradeFourLifeSkillsWorldPage = lazy(() => import('./pages/GradeFourLifeSkillsWorldPage'))
const GradeFourLifeSkillsPracticePage = lazy(() => import('./pages/GradeFourLifeSkillsPracticePage'))
const GradeFourCodingWorldPage = lazy(() => import('./pages/GradeFourCodingWorldPage'))
const GradeFourCodingPracticePage = lazy(() => import('./pages/GradeFourCodingPracticePage'))
const GradeSevenWordWorldPage = lazy(() => import('./pages/GradeSevenWordWorldPage'))
const GradeSevenWordPracticePage = lazy(() => import('./pages/GradeSevenWordPracticePage'))
const GradeSevenCodingWorldPage = lazy(() => import('./pages/GradeSevenCodingWorldPage'))
const GradeSevenCodingPracticePage = lazy(() => import('./pages/GradeSevenCodingPracticePage'))
const GradeSevenCreativeArtsWorldPage = lazy(() => import('./pages/GradeSevenCreativeArtsWorldPage'))
const GradeSevenCreativeArtsPracticePage = lazy(() => import('./pages/GradeSevenCreativeArtsPracticePage'))
const GradeSevenLifeOrientationWorldPage = lazy(() => import('./pages/GradeSevenLifeOrientationWorldPage'))
const GradeSevenLifeOrientationPracticePage = lazy(() => import('./pages/GradeSevenLifeOrientationPracticePage'))
const GradeSevenEmsWorldPage = lazy(() => import('./pages/GradeSevenEmsWorldPage'))
const GradeSevenEmsPracticePage = lazy(() => import('./pages/GradeSevenEmsPracticePage'))
const GradeSevenTechnologyWorldPage = lazy(() => import('./pages/GradeSevenTechnologyWorldPage'))
const GradeSevenTechnologyPracticePage = lazy(() => import('./pages/GradeSevenTechnologyPracticePage'))
const GradeSevenScienceWorldPage = lazy(() => import('./pages/GradeSevenScienceWorldPage'))
const GradeSevenSciencePracticePage = lazy(() => import('./pages/GradeSevenSciencePracticePage'))
const GradeSevenSocialSciencesWorldPage = lazy(() => import('./pages/GradeSevenSocialSciencesWorldPage'))
const GradeSevenSocialSciencesPracticePage = lazy(() => import('./pages/GradeSevenSocialSciencesPracticePage'))
const GradeSevenMathWorldPage = lazy(() => import('./pages/GradeSevenMathWorldPage'))
const GradeSevenMathPracticePage = lazy(() => import('./pages/GradeSevenMathPracticePage'))
const GradeSixMathWorldPage = lazy(() => import('./pages/GradeSixMathWorldPage'))
const GradeSixMathPracticePage = lazy(() => import('./pages/GradeSixMathPracticePage'))
const GradeFiveMathWorldPage = lazy(() => import('./pages/GradeFiveMathWorldPage'))
const GradeFiveMathPracticePage = lazy(() => import('./pages/GradeFiveMathPracticePage'))
const GradeSixWordWorldPage = lazy(() => import('./pages/GradeSixWordWorldPage'))
const GradeSixWordPracticePage = lazy(() => import('./pages/GradeSixWordPracticePage'))
const GradeFiveWordWorldPage = lazy(() => import('./pages/GradeFiveWordWorldPage'))
const GradeFiveWordPracticePage = lazy(() => import('./pages/GradeFiveWordPracticePage'))
const GradeSixScienceWorldPage = lazy(() => import('./pages/GradeSixScienceWorldPage'))
const GradeSixSciencePracticePage = lazy(() => import('./pages/GradeSixSciencePracticePage'))
const GradeFiveScienceWorldPage = lazy(() => import('./pages/GradeFiveScienceWorldPage'))
const GradeFiveSciencePracticePage = lazy(() => import('./pages/GradeFiveSciencePracticePage'))
const GradeSixSocialSciencesWorldPage = lazy(() => import('./pages/GradeSixSocialSciencesWorldPage'))
const GradeSixSocialSciencesPracticePage = lazy(() => import('./pages/GradeSixSocialSciencesPracticePage'))
const GradeFiveSocialSciencesWorldPage = lazy(() => import('./pages/GradeFiveSocialSciencesWorldPage'))
const GradeFiveSocialSciencesPracticePage = lazy(() => import('./pages/GradeFiveSocialSciencesPracticePage'))
const GradeSixLifeSkillsWorldPage = lazy(() => import('./pages/GradeSixLifeSkillsWorldPage'))
const GradeSixLifeSkillsPracticePage = lazy(() => import('./pages/GradeSixLifeSkillsPracticePage'))
const GradeFiveLifeSkillsWorldPage = lazy(() => import('./pages/GradeFiveLifeSkillsWorldPage'))
const GradeFiveLifeSkillsPracticePage = lazy(() => import('./pages/GradeFiveLifeSkillsPracticePage'))
const GradeSixCodingWorldPage = lazy(() => import('./pages/GradeSixCodingWorldPage'))
const GradeSixCodingPracticePage = lazy(() => import('./pages/GradeSixCodingPracticePage'))
const GradeFiveCodingWorldPage = lazy(() => import('./pages/GradeFiveCodingWorldPage'))
const GradeFiveCodingPracticePage = lazy(() => import('./pages/GradeFiveCodingPracticePage'))
const GradeOneHomeworkPage = lazy(() => import('./pages/GradeOneHomeworkPage'))
const FamilyDashboardPage = lazy(() => import('./pages/FamilyDashboardPage'))
const LearnerFamilyLinkPage = lazy(() => import('./pages/LearnerFamilyLinkPage'))
const HomeworkHelpPage = lazy(() => import('./pages/HomeworkHelpPage'))
const ShopComingSoonPage = lazy(() => import('./pages/ShopComingSoonPage'))

function PageLoading() {
  return (
    <div className="adventure-loading" role="status" aria-live="polite">
      <p>Loading FAM...</p>
    </div>
  )
}

export default function App() {
  useEffect(() => { retireGuestSession(); const stopSession = initializeLearningSession(); const stopSync = initializeGradeOneProgressSync(); return () => {stopSession(); stopSync()} }, [])

  useEffect(() => {
    const preloadSubjects = () => {
      void import('./lib/content').then(module => module.getSubjects())
    }

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preloadSubjects, { timeout: 2500 })
      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = globalThis.setTimeout(preloadSubjects, 1200)
    return () => globalThis.clearTimeout(timeoutId)
  }, [])

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
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

        <Route path="/grades/:gradeId/programmes/:subjectId/terms/:termId" element={<TermProgrammePage />} />
        <Route path="/grades/:gradeId/programmes/:subjectId/terms/:termId/units/:unitId" element={<LearningUnitPage />} />
        <Route path="/grades/:gradeId/:subjectId" element={<PlannedSubjectPage />} />
        <Route path="/grades/:gradeId" element={<GradeHubPage />} />

        <Route path="/grades/grade-1/mathematics/addition" element={<GradeOneMathPage />} />
        <Route path="/grades/grade-1/mathematics/number-mission" element={<GradeOneMathPage />} />
        <Route path="/grades/grade-1/mathematics" element={<GradeOneMathWorldPage />} />
        <Route path="/grades/grade-1/mathematics/practice/:topicId" element={<GradeOnePracticePage />} />
        <Route path="/grades/grade-1/words" element={<GradeOneWordWorldPage />} />
        <Route path="/grades/grade-1/words/practice/:pathId" element={<GradeOneWordPracticePage />} />
        <Route path="/grades/grade-1/life-skills" element={<GradeOneLifeSkillsWorldPage />} />
        <Route path="/grades/grade-1/life-skills/practice/:topicId" element={<GradeOneLifeSkillsPracticePage />} />
        <Route path="/grades/grade-1/coding" element={<GradeOneCodingWorldPage />} />
        <Route path="/grades/grade-1/coding/practice/:topicId" element={<GradeOneCodingPracticePage />} />
        <Route path="/grades/grade-2/mathematics" element={<GradeTwoMathWorldPage />} />
        <Route path="/grades/grade-2/mathematics/practice/:topicId" element={<GradeTwoMathPracticePage />} />
        <Route path="/grades/grade-2/words" element={<GradeTwoWordWorldPage />} />
        <Route path="/grades/grade-2/words/practice/:pathId" element={<GradeTwoWordPracticePage />} />
        <Route path="/grades/grade-2/life-skills" element={<GradeTwoLifeSkillsWorldPage />} />
        <Route path="/grades/grade-2/life-skills/practice/:topicId" element={<GradeTwoLifeSkillsPracticePage />} />
        <Route path="/grades/grade-2/coding" element={<GradeTwoCodingWorldPage />} />
        <Route path="/grades/grade-2/coding/practice/:topicId" element={<GradeTwoCodingPracticePage />} />
        <Route path="/grades/grade-3/mathematics" element={<GradeThreeMathWorldPage />} />
        <Route path="/grades/grade-3/mathematics/practice/:topicId" element={<GradeThreeMathPracticePage />} />
        <Route path="/grades/grade-3/words" element={<GradeThreeWordWorldPage />} />
        <Route path="/grades/grade-3/words/practice/:pathId" element={<GradeThreeWordPracticePage />} />
        <Route path="/grades/grade-3/life-skills" element={<GradeThreeLifeSkillsWorldPage />} />
        <Route path="/grades/grade-3/life-skills/practice/:topicId" element={<GradeThreeLifeSkillsPracticePage />} />
        <Route path="/grades/grade-3/coding" element={<GradeThreeCodingWorldPage />} />
        <Route path="/grades/grade-3/coding/practice/:topicId" element={<GradeThreeCodingPracticePage />} />
        <Route path="/interactive-learning" element={<InteractiveCurriculumPage />} />
        <Route path="/interactive-learning/:lessonId" element={<InteractiveCurriculumPage />} />
        <Route path="/grades/grade-4/mathematics/interactive-fractions" element={<InteractiveFractionsPage />} />
        <Route path="/grades/grade-4/mathematics" element={<GradeFourMathWorldPage />} />
        <Route path="/grades/grade-4/mathematics/practice/:topicId" element={<GradeFourMathPracticePage />} />
        <Route path="/grades/grade-4/words" element={<GradeFourWordWorldPage />} />
        <Route path="/grades/grade-4/words/practice/:pathId" element={<GradeFourWordPracticePage />} />
        <Route path="/grades/grade-4/science" element={<GradeFourScienceWorldPage />} />
        <Route path="/grades/grade-4/science/practice/:topicId" element={<GradeFourSciencePracticePage />} />
        <Route path="/grades/grade-4/social-sciences" element={<GradeFourSocialSciencesWorldPage />} />
        <Route path="/grades/grade-4/social-sciences/practice/:topicId" element={<GradeFourSocialSciencesPracticePage />} />
        <Route path="/grades/grade-4/life-skills" element={<GradeFourLifeSkillsWorldPage />} />
        <Route path="/grades/grade-4/life-skills/practice/:topicId" element={<GradeFourLifeSkillsPracticePage />} />
        <Route path="/grades/grade-4/coding" element={<GradeFourCodingWorldPage />} />
        <Route path="/grades/grade-4/coding/practice/:topicId" element={<GradeFourCodingPracticePage />} />
        <Route path="/grades/grade-6/coding" element={<GradeSixCodingWorldPage />} />
        <Route path="/grades/grade-6/coding/practice/:topicId" element={<GradeSixCodingPracticePage />} />
        <Route path="/grades/grade-6/life-skills" element={<GradeSixLifeSkillsWorldPage />} />
        <Route path="/grades/grade-6/life-skills/practice/:topicId" element={<GradeSixLifeSkillsPracticePage />} />
        <Route path="/grades/grade-6/social-sciences" element={<GradeSixSocialSciencesWorldPage />} />
        <Route path="/grades/grade-6/social-sciences/practice/:topicId" element={<GradeSixSocialSciencesPracticePage />} />
        <Route path="/grades/grade-6/science" element={<GradeSixScienceWorldPage />} />
        <Route path="/grades/grade-6/science/practice/:topicId" element={<GradeSixSciencePracticePage />} />
        <Route path="/grades/grade-6/words" element={<GradeSixWordWorldPage />} />
        <Route path="/grades/grade-6/words/practice/:pathId" element={<GradeSixWordPracticePage />} />
        <Route path="/grades/grade-7/coding" element={<GradeSevenCodingWorldPage />} />
        <Route path="/grades/grade-7/coding/practice/:topicId" element={<GradeSevenCodingPracticePage />} />
        <Route path="/grades/grade-7/creative-arts" element={<GradeSevenCreativeArtsWorldPage />} />
        <Route path="/grades/grade-7/creative-arts/practice/:topicId" element={<GradeSevenCreativeArtsPracticePage />} />
        <Route path="/grades/grade-7/life-orientation" element={<GradeSevenLifeOrientationWorldPage />} />
        <Route path="/grades/grade-7/life-orientation/practice/:topicId" element={<GradeSevenLifeOrientationPracticePage />} />
        <Route path="/grades/grade-7/ems" element={<GradeSevenEmsWorldPage />} />
        <Route path="/grades/grade-7/ems/practice/:topicId" element={<GradeSevenEmsPracticePage />} />
        <Route path="/grades/grade-7/technology" element={<GradeSevenTechnologyWorldPage />} />
        <Route path="/grades/grade-7/technology/practice/:topicId" element={<GradeSevenTechnologyPracticePage />} />
        <Route path="/grades/grade-7/social-sciences" element={<GradeSevenSocialSciencesWorldPage />} />
        <Route path="/grades/grade-7/social-sciences/practice/:topicId" element={<GradeSevenSocialSciencesPracticePage />} />
        <Route path="/grades/grade-7/science" element={<GradeSevenScienceWorldPage />} />
        <Route path="/grades/grade-7/science/practice/:topicId" element={<GradeSevenSciencePracticePage />} />
        <Route path="/grades/grade-7/words" element={<GradeSevenWordWorldPage />} />
        <Route path="/grades/grade-7/words/practice/:pathId" element={<GradeSevenWordPracticePage />} />
        <Route path="/grades/grade-10/mathematics" element={<Navigate to="/grades/grade-10/programmes/mathematics/terms/1" replace />} />
        <Route path="/grades/grade-10/words" element={<Navigate to="/grades/grade-10/programmes/words/terms/1" replace />} />
        <Route path="/grades/grade-11/mathematics" element={<Navigate to="/grades/grade-11/programmes/mathematics/terms/1" replace />} />
        <Route path="/grades/grade-11/words" element={<Navigate to="/grades/grade-11/programmes/words/terms/1" replace />} />
        <Route path="/grades/grade-8/mathematics" element={<Navigate to="/grades/grade-8/programmes/mathematics/terms/1" replace />} />
        <Route path="/grades/grade-8/words" element={<Navigate to="/grades/grade-8/programmes/words/terms/1" replace />} />
        <Route path="/grades/grade-9/mathematics" element={<Navigate to="/grades/grade-9/programmes/mathematics/terms/1" replace />} />
        <Route path="/grades/grade-9/words" element={<Navigate to="/grades/grade-9/programmes/words/terms/1" replace />} />
        <Route path="/grades/grade-7/mathematics" element={<GradeSevenMathWorldPage />} />
        <Route path="/grades/grade-7/mathematics/practice/:topicId" element={<GradeSevenMathPracticePage />} />
        <Route path="/grades/grade-6/mathematics" element={<GradeSixMathWorldPage />} />
        <Route path="/grades/grade-6/mathematics/practice/:topicId" element={<GradeSixMathPracticePage />} />
        <Route path="/grades/grade-5/mathematics" element={<GradeFiveMathWorldPage />} />
        <Route path="/grades/grade-5/mathematics/practice/:topicId" element={<GradeFiveMathPracticePage />} />
        <Route path="/grades/grade-5/words" element={<GradeFiveWordWorldPage />} />
        <Route path="/grades/grade-5/words/practice/:pathId" element={<GradeFiveWordPracticePage />} />
        <Route path="/grades/grade-5/science" element={<GradeFiveScienceWorldPage />} />
        <Route path="/grades/grade-5/science/practice/:topicId" element={<GradeFiveSciencePracticePage />} />
        <Route path="/grades/grade-5/social-sciences" element={<GradeFiveSocialSciencesWorldPage />} />
        <Route path="/grades/grade-5/social-sciences/practice/:topicId" element={<GradeFiveSocialSciencesPracticePage />} />
        <Route path="/grades/grade-5/life-skills" element={<GradeFiveLifeSkillsWorldPage />} />
        <Route path="/grades/grade-5/life-skills/practice/:topicId" element={<GradeFiveLifeSkillsPracticePage />} />
        <Route path="/grades/grade-5/coding" element={<GradeFiveCodingWorldPage />} />
        <Route path="/grades/grade-5/coding/practice/:topicId" element={<GradeFiveCodingPracticePage />} />
        <Route path="/grades/grade-1/homework" element={<GradeOneHomeworkPage />} />
        <Route path="/grades/grade-1/parent-dashboard" element={<FamilyDashboardPage />} />
        <Route path="/parent-dashboard" element={<FamilyDashboardPage />} />
        <Route path="/family/connect-learner" element={<LearnerFamilyLinkPage />} />
        <Route path="/guest-profiles" element={<Navigate to="/account" replace />} />
        <Route path="/guest-transfer-complete" element={<Navigate to="/account" replace />} />
        <Route path="/homework-help" element={<HomeworkHelpPage />} />
        <Route path="/shop" element={<ShopComingSoonPage />} />
        <Route path="/shop/:category" element={<ShopComingSoonPage />} />

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
          path="/subjects/:subjectId/:topicId/lesson"
          element={<TopicLessonPage />}
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
    </Suspense>
  )
}
