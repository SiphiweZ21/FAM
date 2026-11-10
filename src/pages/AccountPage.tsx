import SelectedPremiumCheckout from '../components/SelectedPremiumCheckout'
import {safeLearningReturn} from '../lib/grade-premium'
import {useSearchParams} from 'react-router-dom'
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Gauge,
  LogOut,
  Target,
  UserRound
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

import type {
  User
} from '@supabase/supabase-js'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  getLearnerEntitlement,
  type LearnerEntitlement
} from '../lib/access'

import {
  supabase
} from '../lib/supabase'

import {
  startPremiumCheckout,
  type PremiumPackageId
} from '../lib/payments'
import AuthPanel from '../components/AuthPanel'
import LegacyLearningRecovery from '../components/LegacyLearningRecovery'
import PremiumPackageCards from '../components/PremiumPackageCards'

export default function AccountPage() {
  const navigate = useNavigate()
  const [purchaseParams]=useSearchParams()
  const selectedPackage=(["MONTHLY","TERM"].includes(purchaseParams.get('packageId')||'')?purchaseParams.get('packageId'):null) as PremiumPackageId|null
  const learningReturnTo=safeLearningReturn(purchaseParams.get('returnTo'))
  const [
    user,
    setUser
  ] =
    useState<User | null>(
      null
    )

  const [
    entitlement,
    setEntitlement
  ] =
    useState<LearnerEntitlement | null>(
      null
    )

  const [
    loading,
    setLoading
  ] =
    useState(true)

  const [
    message,
    setMessage
  ] =
    useState('')

  const [
    paymentLoading,
    setPaymentLoading
  ] = useState<PremiumPackageId | null>(null)

  async function upgradeToPremium(packageId: PremiumPackageId, paymentMethod: 'CAPITECPAY'|'CARD' = 'CAPITECPAY') {
    setMessage('')
    setPaymentLoading(packageId)

    try {
      await startPremiumCheckout(packageId,learningReturnTo||undefined,paymentMethod)
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Payment could not be started.'
      )
      setPaymentLoading(null)
    }
  }

  async function loadEntitlement() {
    const result =
      await getLearnerEntitlement()

    setEntitlement(
      result
    )
  }

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(
        async ({
          data
        }) => {
          const currentUser =
            data.user ??
            null

          setUser(
            currentUser
          )

          if (currentUser) {
            await loadEntitlement()
          }
        }
      )
      .finally(
        () =>
          setLoading(false)
      )

    const {
      data: {
        subscription
      }
    } =
      supabase.auth
        .onAuthStateChange(
          (
            event,
            session
          ) => {
            const currentUser =
              session?.user ??
              null

            setUser(
              currentUser
            )

            if (
              event ===
              'SIGNED_IN'
            ) {
              setMessage('')
              loadEntitlement()
            }

            if (
              event ===
              'SIGNED_OUT'
            ) {
              setEntitlement(
                null
              )
            }
          }
        )

    return () =>
      subscription.unsubscribe()
  }, [])

  async function signOut() {
    setMessage('')

    const {
      error
    } =
      await supabase.auth
        .signOut()

    if (error) {
      setMessage(
        error.message
      )
      return
    }

    setMessage(
      'Signed out successfully.'
    )
  }

  if (loading) {
    return (
      <div className="stack-lg narrow account-page-unified">
        <p>
          Loading account...
        </p>
      </div>
    )
  }

  if (user) {
    const isPremium =
      entitlement
        ?.accessMode ===
      'PREMIUM'

    const premiumExpiry =
      entitlement
        ?.premiumExpiresAt
        ? new Date(
            entitlement
              .premiumExpiresAt
          ).toLocaleDateString(
            'en-ZA',
            {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }
          )
        : null

    return (
      <div className="stack-lg narrow account-page-unified">
        <LegacyLearningRecovery />
        <header className="page-header">
          <span className="eyebrow">
            YOUR ACCOUNT
          </span>

          <h1>
            Welcome back
          </h1>

          <p>
            {selectedPackage?'Your account is ready. Complete your payment below to unlock your lesson.':'Manage your learning, subjects and FAM access.'}
          </p>
        </header>

        <section className="account-profile-card">
          <div className="account-profile-icon">
            <UserRound
              size={24}
            />
          </div>

          <div className="account-profile-details">
            <span className="eyebrow">
              LEARNER ACCOUNT
            </span>

            <strong>
              {user.email}
            </strong>

            <span className="account-active-status">
              <CheckCircle2
                size={14}
              />

              Account active
            </span>
          </div>
        </section>

        {selectedPackage&&learningReturnTo&&(isPremium?<section className="account-plan-card"><h2>Your Premium access is active</h2><Link className="button primary full" to={learningReturnTo}>Continue to your lesson</Link></section>:<SelectedPremiumCheckout packageId={selectedPackage} returnTo={learningReturnTo}/>)}
        <section className="account-plan-card">
          <div className="account-plan-heading">
            <div>
              <span className="eyebrow">
                YOUR PLAN
              </span>

              <h2>
                {isPremium
                  ? 'FAM Premium'
                  : 'FAM Free'}
              </h2>
            </div>

            <span
              className={
                isPremium
                  ? 'account-plan-badge premium'
                  : 'account-plan-badge free'
              }
            >
              {isPremium
                ? 'PREMIUM'
                : 'FREE'}
            </span>
          </div>

          {isPremium ? (
            <>
              <p>
                Your full FAM learning
                experience is unlocked.
              </p>

              <div className="account-plan-benefits">
                <span>
                  ✓ All learning missions
                </span>

                <span>
                  ✓ Full subject progress
                  tracking
                </span>

                <span>
                  ✓ Weak-topic insights
                </span>

                <span>
                  ✓ Personalised revision
                  priorities
                </span>

                <span>
                  ✓ Past exam papers &
                  memorandums
                </span>
              </div>

              {premiumExpiry && (
                <div className="account-plan-expiry">
                  Premium access until{' '}
                  <strong>
                    {premiumExpiry}
                  </strong>
                </div>
              )}
            </>
          ) : (
            <>
              <p>
                Start free and build your
                learning profile one
                subject at a time.
              </p>

              <div className="account-plan-benefits">
                <span>
                  ✓ One free mission per
                  subject
                </span>

                <span>
                  ✓ Choose your Grade 12
                  subjects
                </span>

                <span>
                  ✓ Set target marks
                </span>

                <span>
                  ✓ Save mission scores
                </span>

                <span>
                  ✓ Basic progress tracking
                </span>
              </div>

              <div className="account-premium-upgrade">
                <div>
                  <span className="eyebrow">
                    PREMIUM OPTION
                  </span>

                  <h3>
                    More practice when you need it
                  </h3>

                  <p>
                    Continue on the Free plan, or unlock every mission,
                    progress insight and past paper when you are ready.
                  </p>
                </div>
                <PremiumPackageCards onSelect={upgradeToPremium} loadingPackage={paymentLoading} />
              </div>
            </>
          )}
        </section>

        <section className="account-learning-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                YOUR LEARNING
              </span>

              <h2>
                Continue studying
              </h2>
            </div>
          </div>

          <div className="account-menu-list">
            <Link
              to="/dashboard"
              className="account-menu-item"
            >
              <span className="account-menu-icon">
                <Gauge
                  size={20}
                />
              </span>

              <span className="account-menu-content">
                <strong>
                  My Dashboard
                </strong>

                <small>
                  See progress and revision
                  priorities
                </small>
              </span>

              <ChevronRight
                size={18}
              />
            </Link>

            <Link
              to="/my-subjects"
              className="account-menu-item"
            >
              <span className="account-menu-icon">
                <Target
                  size={20}
                />
              </span>

              <span className="account-menu-content">
                <strong>
                  My Subjects
                </strong>

                <small>
                  Choose subjects and set
                  target marks
                </small>
              </span>

              <ChevronRight
                size={18}
              />
            </Link>

            <Link
              to="/subjects"
              className="account-menu-item"
            >
              <span className="account-menu-icon">
                <BookOpen
                  size={20}
                />
              </span>

              <span className="account-menu-content">
                <strong>
                  Learning Library
                </strong>

                <small>
                  Browse Grade 12 subjects
                  and missions
                </small>
              </span>

              <ChevronRight
                size={18}
              />
            </Link>
          </div>
        </section>

        <section className="account-signout-section">
          <span className="eyebrow">
            ACCOUNT
          </span>

          <button
            type="button"
            className="button secondary full"
            onClick={signOut}
          >
            <LogOut
              size={17}
            />

            Sign out
          </button>
        </section>

        {message && (
          <p className="account-message">
            {message}
          </p>
        )}
      </div>
    )
  }

  const purchaseIntent=Boolean(selectedPackage||learningReturnTo)
  return <>
    <AuthPanel
      hideIntro
      hideFooter
      title={purchaseIntent?'Continue your Premium purchase':undefined}
      formDescription={selectedPackage?(selectedPackage==='TERM'?'Selected: Term Pass — R200 for 3 months.':'Selected: Monthly Pass — R110 for 30 days.'):undefined}
      signInLabel={purchaseIntent?'Sign in to continue to payment':undefined}
      onAuthenticated={() => {if(!selectedPackage)navigate(learningReturnTo||'/dashboard')}}
    />
  </>
}
