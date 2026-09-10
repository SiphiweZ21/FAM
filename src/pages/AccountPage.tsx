import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Gauge,
  GraduationCap,
  LockKeyhole,
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
  startPremiumCheckout
} from '../lib/payments'

export default function AccountPage() {
  const navigate = useNavigate()
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
    email,
    setEmail
  ] =
    useState('')

  const [
    password,
    setPassword
  ] =
    useState('')

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
  ] = useState(false)

  async function upgradeToPremium() {
    setMessage('')
    setPaymentLoading(true)

    try {
      await startPremiumCheckout()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Payment could not be started.'
      )
      setPaymentLoading(false)
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

  async function signUp() {
    setMessage('')

    if (
      !email ||
      !password
    ) {
      setMessage(
        'Enter your email and password.'
      )
      return
    }

    const {
      error
    } =
      await supabase.auth
        .signUp({
          email,
          password
        })

    if (error) {
      setMessage(
        error.message
      )
      return
    }

    setMessage(
      'Account created. Check your email if confirmation is required.'
    )
  }

  async function signIn() {
    setMessage('')

    if (
      !email ||
      !password
    ) {
      setMessage(
        'Enter your email and password.'
      )
      return
    }

    const {
      error
    } =
      await supabase.auth
        .signInWithPassword({
          email,
          password
        })

    if (error) {
      setMessage(
        error.message
      )
      return
    }

    setPassword('')
    navigate('/dashboard')
  }

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

    setEmail('')
    setPassword('')
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
        <header className="page-header">
          <span className="eyebrow">
            YOUR ACCOUNT
          </span>

          <h1>
            Welcome back
          </h1>

          <p>
            Manage your learning,
            subjects and FAM access.
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
                <div className="account-premium-upgrade-icon">
                  <LockKeyhole
                    size={20}
                  />
                </div>

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

                <div className="account-premium-pricing">
                  <div className="account-standard-price">
                    <span>
                      Standard price
                    </span>

                    <del>
                      R250 / year
                    </del>
                  </div>

                  <div className="account-discount-badge">
                    SAVE R100
                  </div>

                  <div className="account-offer-price">
                    <span>
                      12 MONTH ACCESS
                    </span>

                    <strong>
                      R150
                    </strong>

                    <small>
                      / year
                    </small>
                  </div>

                  <span className="account-payment-note">
                    One payment. No automatic renewal.
                  </span>

                  <button
                    type="button"
                    className="button primary full"
                    onClick={upgradeToPremium}
                    disabled={paymentLoading}
                  >
                    {paymentLoading
                      ? 'Opening secure checkout...'
                      : 'Choose Premium — R150 for 12 months'}
                  </button>
                </div>
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

  return (
    <div className="stack-lg narrow account-page-unified">
      <header className="page-header">
        <span className="eyebrow">
          FAM ACCOUNT
        </span>

        <h1>
          Learn. Practise. Improve.
        </h1>

        <p>
          Sign in to save your learning
          progress, scores, subjects and
          revision history.
        </p>
      </header>

      <section className="account-login-card">
        <div className="account-login-heading">
          <div className="account-login-icon">
            <GraduationCap
              size={24}
            />
          </div>

          <div>
            <span className="eyebrow">
              LEARNER SIGN IN
            </span>

            <h2>
              Continue your Matric
              preparation
            </h2>
          </div>
        </div>

        <div className="account-form">
          <label>
            <span>
              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={
                event =>
                  setEmail(
                    event.target.value
                  )
              }
              placeholder="learner@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            <span>
              Password
            </span>

            <input
              type="password"
              value={password}
              onChange={
                event =>
                  setPassword(
                    event.target.value
                  )
              }
              placeholder="Minimum 6 characters"
              autoComplete="current-password"
            />
          </label>
        </div>

        <button
          type="button"
          className="button primary full"
          onClick={signIn}
        >
          Sign in
        </button>

        <button
          type="button"
          className="button secondary full"
          onClick={signUp}
        >
          Create learner account
        </button>

        {message && (
          <p className="account-message">
            {message}
          </p>
        )}
      </section>

      <section className="account-free-note">
        <strong>
          Start for free
        </strong>

        <p>
          Create an account, select your
          subjects, set your target marks
          and begin your free Grade 12
          missions.
        </p>
      </section>
    </div>
  )
}
