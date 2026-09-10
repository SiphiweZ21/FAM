// src/pages/TournamentPage.tsx

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Heart,
  LockKeyhole,
  Trophy,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Tournament = {
  id: string
  name: string
  subject_id: string
  description: string | null

  prize_cash: number
  premium_months: number

  registration_opens_at: string
  registration_closes_at: string
  starts_at: string
  entry_closes_at: string
  ends_at: string

  question_count: number
  starting_lives: number
  points_per_correct: number

  rules_version: string
  status: string
}

type Registration = {
  id: string
  display_name: string
  notify_30_minutes_before: boolean
  status: string
}

const TOURNAMENT_ID =
  '99950022-49b2-4503-8afc-85e4e9eaa219'

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatCountdown(milliseconds: number) {
  if (milliseconds <= 0) {
    return '00:00:00'
  }

  const totalSeconds = Math.floor(milliseconds / 1000)

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const time = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':')

  return days > 0 ? `${days}d ${time}` : time
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'Unable to load tournament.'
}

export default function TournamentPage() {
  const [tournament, setTournament] =
    useState<Tournament | null>(null)

  const [registration, setRegistration] =
    useState<Registration | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [acceptRules, setAcceptRules] = useState(false)
  const [notifyReminder, setNotifyReminder] = useState(true)

  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    void loadTournament()
  }, [])

  async function loadTournament() {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const {
        data: tournamentData,
        error: tournamentError,
      } = await supabase
        .from('tournaments')
        .select(`
          id,
          name,
          subject_id,
          description,
          prize_cash,
          premium_months,
          registration_opens_at,
          registration_closes_at,
          starts_at,
          entry_closes_at,
          ends_at,
          question_count,
          starting_lives,
          points_per_correct,
          rules_version,
          status
        `)
        .eq('id', TOURNAMENT_ID)
        .maybeSingle()

      console.log(
        'Tournament data:',
        tournamentData
      )

      console.log(
        'Tournament error:',
        tournamentError
      )

      if (tournamentError) {
        throw tournamentError
      }

      if (!tournamentData) {
        throw new Error(
          'The tournament was not returned by Supabase.'
        )
      }

      setTournament(
        tournamentData as Tournament
      )

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error(
          'Auth user lookup error:',
          userError
        )
      }

      if (!user) {
        return
      }

      const {
        data: registrationData,
        error: registrationError,
      } = await supabase
        .from('tournament_registrations')
        .select(`
          id,
          display_name,
          notify_30_minutes_before,
          status
        `)
        .eq(
          'tournament_id',
          tournamentData.id
        )
        .eq(
          'user_id',
          user.id
        )
        .maybeSingle()

      console.log(
        'Registration data:',
        registrationData
      )

      console.log(
        'Registration error:',
        registrationError
      )

      if (registrationError) {
        throw registrationError
      }

      if (registrationData) {
        setRegistration(
          registrationData as Registration
        )

        setDisplayName(
          registrationData.display_name
        )

        setNotifyReminder(
          registrationData
            .notify_30_minutes_before
        )
      }
    } catch (err: unknown) {
      console.error(
        'Tournament load failed:',
        err
      )

      setTournament(null)

      setError(
        getErrorMessage(err)
      )
    } finally {
      setLoading(false)
    }
  }

  async function registerForTournament() {
    if (!tournament) {
      return
    }

    setError('')
    setSuccess('')

    const cleanName =
      displayName.trim()

    if (cleanName.length < 3) {
      setError(
        'Leaderboard name must be at least 3 characters.'
      )
      return
    }

    if (cleanName.length > 30) {
      setError(
        'Leaderboard name cannot be longer than 30 characters.'
      )
      return
    }

    if (!acceptRules) {
      setError(
        'You need to accept the Tournament Rules before registering.'
      )
      return
    }

    setRegistering(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      if (!user) {
        throw new Error(
          'Please sign in to your FAM account before registering.'
        )
      }

      const {
        data: rpcData,
        error: rpcError,
      } = await supabase.rpc(
        'register_for_tournament',
        {
          p_tournament_id:
            tournament.id,

          p_display_name:
            cleanName,

          p_accept_rules:
            true,

          p_notify_30_minutes_before:
            notifyReminder,
        }
      )

      console.log(
        'Registration RPC data:',
        rpcData
      )

      console.log(
        'Registration RPC error:',
        rpcError
      )

      if (rpcError) {
        throw rpcError
      }

      const {
        data: registrationData,
        error: registrationError,
      } = await supabase
        .from('tournament_registrations')
        .select(`
          id,
          display_name,
          notify_30_minutes_before,
          status
        `)
        .eq(
          'tournament_id',
          tournament.id
        )
        .eq(
          'user_id',
          user.id
        )
        .single()

      if (registrationError) {
        throw registrationError
      }

      setRegistration(
        registrationData as Registration
      )

      setSuccess(
        'You are registered for the Mathematics Paper 1 Exam Challenge.'
      )
    } catch (err: unknown) {
      console.error(
        'Tournament registration failed:',
        err
      )

      setError(
        getErrorMessage(err)
      )
    } finally {
      setRegistering(false)
    }
  }

  const registrationOpen =
    useMemo(() => {
      if (!tournament) {
        return false
      }

      const opens =
        new Date(
          tournament.registration_opens_at
        ).getTime()

      const closes =
        new Date(
          tournament.registration_closes_at
        ).getTime()

      return (
        now >= opens &&
        now <= closes
      )
    }, [tournament, now])

  const tournamentStarted =
    useMemo(() => {
      if (!tournament) {
        return false
      }

      return (
        now >=
        new Date(
          tournament.starts_at
        ).getTime()
      )
    }, [tournament, now])

  const tournamentEnded =
    useMemo(() => {
      if (!tournament) {
        return false
      }

      return (
        now >
        new Date(
          tournament.ends_at
        ).getTime()
      )
    }, [tournament, now])

  const countdownTarget =
    useMemo(() => {
      if (!tournament) {
        return null
      }

      if (!tournamentStarted) {
        return new Date(
          tournament.starts_at
        ).getTime()
      }

      return new Date(
        tournament.ends_at
      ).getTime()
    }, [
      tournament,
      tournamentStarted,
    ])

  if (loading) {
    return (
      <div className="stack-lg">
        <section className="section-block">
          <p>
            Loading tournament...
          </p>
        </section>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="stack-lg">
        <section className="section-block">
          <h1>
            Tournament unavailable
          </h1>

          <p>
            {error ||
              'There is currently no active FAM tournament.'}
          </p>

          <button
            type="button"
            className="button primary"
            onClick={() => {
              void loadTournament()
            }}
          >
            Try again
          </button>
        </section>
      </div>
    )
  }

  const maximumScore =
    tournament.question_count *
    tournament.points_per_correct

  return (
    <div className="stack-lg">
      <section className="tournament-hero">
        <div className="tournament-hero-copy">
          <span className="eyebrow">
            FAM MATRIC TOURNAMENT
          </span>

          <h1>
            Mathematics Paper 1
            <br />
            Exam Challenge
          </h1>

          <p>
            Test your exam readiness,
            protect your lives and climb
            the FAM leaderboard.
          </p>

          <div className="tournament-prize">
            <Trophy size={22} />

            <div>
              <strong>
                Win R
                {tournament.prize_cash}
              </strong>

              <span>
                +{' '}
                {
                  tournament.premium_months
                }{' '}
                months FAM Premium
              </span>
            </div>
          </div>
        </div>

        <div className="tournament-countdown-card">
          <span>
            {tournamentEnded
              ? 'Tournament ended'
              : tournamentStarted
                ? 'Tournament ends in'
                : 'Tournament starts in'}
          </span>

          <strong>
            {countdownTarget
              ? formatCountdown(
                  countdownTarget -
                    now
                )
              : '--:--:--'}
          </strong>

          <small>
            {formatDateTime(
              tournament.starts_at
            )}
          </small>
        </div>
      </section>

      <section className="tournament-meta-grid">
        <article>
          <strong>
            {tournament.question_count}
          </strong>

          <span>
            Questions
          </span>
        </article>

        <article>
          <strong>
            {maximumScore}
          </strong>

          <span>
            Maximum points
          </span>
        </article>

        <article>
          <strong>
            {Array.from({
              length:
                tournament.starting_lives,
            })
              .map(() => '❤️')
              .join('')}
          </strong>

          <span>
            {tournament.starting_lives}{' '}
            lives
          </span>
        </article>

        <article>
          <strong>
            FREE
          </strong>

          <span>
            Entry
          </span>
        </article>
      </section>

      <section className="tournament-registration-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              REGISTRATION
            </span>

            <h2>
              {registration
                ? 'You’re in.'
                : 'Enter the challenge'}
            </h2>
          </div>
        </div>

        {registration ? (
          <div className="tournament-registered">
            <CheckCircle2
              size={34}
            />

            <div>
              <strong>
                You're registered
              </strong>

              <p>
                Leaderboard name:{' '}
                <b>
                  {
                    registration.display_name
                  }
                </b>
              </p>

              {registration
                .notify_30_minutes_before && (
                <p>
                  We’ll remind you
                  30 minutes before
                  the challenge starts.
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {!registrationOpen ? (
              <div className="tournament-status-message">
                <Clock3 size={20} />

                <span>
                  {tournamentStarted
                    ? 'Registration has closed.'
                    : 'Registration is not open yet.'}
                </span>
              </div>
            ) : (
              <div className="tournament-form">
                <label>
                  <span>
                    Leaderboard name
                  </span>

                  <input
                    type="text"
                    value={displayName}
                    maxLength={30}
                    placeholder="e.g. SiphiweZ"
                    onChange={(
                      event
                    ) =>
                      setDisplayName(
                        event.target
                          .value
                      )
                    }
                  />

                  <small>
                    This name will
                    be visible on the
                    public leaderboard.
                  </small>
                </label>

                <label className="tournament-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      acceptRules
                    }
                    onChange={(
                      event
                    ) =>
                      setAcceptRules(
                        event.target
                          .checked
                      )
                    }
                  />

                  <span>
                    I accept the{' '}
                    <Link to="/tournament/rules">
                      Tournament Rules
                    </Link>
                    .
                  </span>
                </label>

                <label className="tournament-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      notifyReminder
                    }
                    onChange={(
                      event
                    ) =>
                      setNotifyReminder(
                        event.target
                          .checked
                      )
                    }
                  />

                  <span>
                    Remind me 30
                    minutes before the
                    tournament starts.
                  </span>
                </label>

                <button
                  className="button primary"
                  type="button"
                  disabled={
                    registering
                  }
                  onClick={
                    registerForTournament
                  }
                >
                  {registering
                    ? 'Registering...'
                    : 'Register FREE'}

                  {!registering && (
                    <ArrowRight
                      size={18}
                    />
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        {success && (
          <p className="form-success">
            {success}
          </p>
        )}
      </section>

      <section className="tournament-rules-preview">
        <article>
          <Heart size={20} />

          <div>
            <strong>
              3 lives
            </strong>

            <p>
              Every wrong answer
              costs one life. Lose
              all three and your
              challenge ends.
            </p>
          </div>
        </article>

        <article>
          <Trophy size={20} />

          <div>
            <strong>
              {
                tournament.points_per_correct
              }{' '}
              points per correct
              answer
            </strong>

            <p>
              Score as high as
              possible and climb
              the leaderboard.
            </p>
          </div>
        </article>

        <article>
          <LockKeyhole
            size={20}
          />

          <div>
            <strong>
              One official attempt
            </strong>

            <p>
              Everyone gets one
              official attempt for
              this tournament.
            </p>
          </div>
        </article>
      </section>

      <div className="tournament-links">
        <Link to="/tournament/rules">
          View Tournament Rules
        </Link>

        <Link to="/leaderboard">
          View Leaderboard →
        </Link>
      </div>
    </div>
  )
}