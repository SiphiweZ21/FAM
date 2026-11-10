import { useState } from 'react'
import { getGuestProfiles } from '../lib/guest'
import { migrateLegacyProgress } from '../lib/progress'

export default function LegacyLearningRecovery() {
  const [profiles, setProfiles] = useState(getGuestProfiles)
  const [selected, setSelected] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [belongsToMe, setBelongsToMe] = useState(false)
  if (!profiles.length) return null
  function download() {
    const saved: Record<string, string> = {}
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index)
      if (key && (/^fam-grade-(one|two|three|four|five|six|seven)-progress/.test(key) || key === 'fam-guest-profiles-v1')) saved[key] = localStorage.getItem(key) ?? ''
    }
    const link = document.createElement('a')
    const url = URL.createObjectURL(new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), saved }, null, 2)], { type: 'application/json' }))
    link.href = url; link.download = 'fam-previous-learning-backup.json'; link.click(); URL.revokeObjectURL(url)
  }
  async function recover() {
    if (busy || !selected || !belongsToMe) return
    setBusy(true); setMessage('')
    try {
      const result = await migrateLegacyProgress(selected)
      setMessage(result.migrated > 0 ? `Saved ${result.migrated} previous mission results to your account.` : 'There are no Grade 12 mission results to import from this saved learner.')
      setProfiles(getGuestProfiles()); setSelected(''); setBelongsToMe(false)
    } catch { setMessage('We could not import these results. Your saved copy remains on this device. Please try again later.') }
    finally { setBusy(false) }
  }
  return <details className="legacy-learning-recovery"><summary>Previous learning saved on this device</summary><p>Guest profiles have been retired. Your older data remains available for recovery. Download a backup before importing results.</p><button type="button" className="button secondary full" onClick={download}>Download previous learning</button><label><span>Saved learner with Grade 12 results</span><select value={selected} onChange={event => {setSelected(event.target.value); setBelongsToMe(false)}} disabled={busy}><option value="">Choose previous results</option>{profiles.filter(profile => profile.gradeId === 'grade-12' && profile.progress.length > 0).map(profile => <option key={profile.id} value={profile.id}>{profile.nickname}</option>)}</select></label><label><input type="checkbox" checked={belongsToMe} onChange={event => setBelongsToMe(event.target.checked)} disabled={busy} /> These results belong to the learner using this signed-in account.</label><button type="button" className="button primary full" disabled={!selected || !belongsToMe || busy} onClick={() => void recover()}>{busy ? 'Importing...' : 'Import previous mission results'}</button><p>Earlier lower-grade learning is included in the downloadable backup.</p>{message && <p role="status">{message}</p>}</details>
}
