import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  FileText
} from 'lucide-react'

import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="stack-lg">

      <section className="hero">
        <span className="eyebrow">
          GRADE 12 EXAM PREP
        </span>

        <h1>
          Prepare smarter.
          <br />
          Practise with purpose.
          <br />
          Build exam readiness.
        </h1>

        <p>
          Learn Grade 12 topics, practise
          exam-style questions, use past papers
          and track where you need more work.
        </p>

        <div className="home-hero-actions">
          <Link
            className="button primary"
            to="/subjects"
          >
            Start learning
            <ArrowRight size={17} />
          </Link>

          <Link
            className="button ghost"
            to="/dashboard"
          >
            View dashboard
          </Link>
        </div>
      </section>

      <section className="stats-grid">
        <article>
          <strong>17</strong>
          <span>Grade 12 subjects</span>
        </article>

        <article>
          <strong>10</strong>
          <span>questions per mission</span>
        </article>

        <article>
          <strong>1</strong>
          <span>free mission per subject</span>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              START HERE
            </span>

            <h2>
              What do you want to do?
            </h2>
          </div>
        </div>

        <div className="feature-grid">
          <Link
            to="/subjects"
            className="feature-card home-action-card"
          >
            <BookOpenCheck size={24} />

            <h3>
              Practise a subject
            </h3>

            <p>
              Choose a Grade 12 subject and
              complete short revision missions.
            </p>

            <span className="home-card-link">
              Choose subject
              <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="feature-card home-action-card"
          >
            <BarChart3 size={24} />

            <h3>
              Check your progress
            </h3>

            <p>
              See your subject readiness,
              learning coverage and topics that
              need more attention.
            </p>

            <span className="home-card-link">
              Open dashboard
              <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            to="/subjects"
            className="feature-card home-action-card"
          >
            <FileText size={24} />

            <h3>
              Use past papers
            </h3>

            <p>
              Open past examination papers and
              memorandums while you revise.
            </p>

            <span className="home-card-link">
              Find past papers
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </section>

      <section className="home-learning-flow">
        <div>
          <span className="eyebrow">
            HOW FAM HELPS
          </span>

          <h2>
            Turn revision into progress.
          </h2>

          <p>
            FAM connects learning, practice and
            progress so you can spend more time
            on the areas that need it most.
          </p>
        </div>

        <div className="home-flow-grid">
          <article>
            <strong>01</strong>
            <span>Learn</span>
            <p>
              Choose a subject and focus on one
              topic at a time.
            </p>
          </article>

          <article>
            <strong>02</strong>
            <span>Practise</span>
            <p>
              Answer exam-style questions in
              short missions.
            </p>
          </article>

          <article>
            <strong>03</strong>
            <span>Improve</span>
            <p>
              Use your results to identify what
              needs another revision session.
            </p>
          </article>
        </div>
      </section>

    </div>
  )
}