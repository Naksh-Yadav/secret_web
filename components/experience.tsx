'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { relationship } from '@/lib/relationship'

type Scene = 'boot' | 'identity' | 'file' | 'origin' | 'chaos' | 'distance' | 'package' | 'letter' | 'transmission' | 'reveal' | 'ending'
type Progress = { scene: Scene; clues: string[]; secrets: string[]; puzzle: boolean; voiceCompleted: boolean; ending?: 'normal' | 'secret' | 'ultra' }

const initialProgress: Progress = { scene: 'boot', clues: [], secrets: [], puzzle: false, voiceCompleted: false }
const stages: Scene[] = ['boot', 'identity', 'file', 'origin', 'chaos', 'distance', 'package', 'letter', 'transmission', 'reveal', 'ending']

function haptic(ms = 12) { if ('vibrate' in navigator) navigator.vibrate(ms) }
function eventLog(event: string, stage: Scene, context?: Record<string, string>) {
  try { const sessionId = sessionStorage.getItem('archive-session') || crypto.randomUUID(); sessionStorage.setItem('archive-session', sessionId); void fetch('/api/discord-event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event, stage, sessionId, context }) }).catch(() => {}) } catch {}
}

export default function Experience() {
  const [progress, setProgress] = useState<Progress>(initialProgress)
  const [bootLine, setBootLine] = useState(0)
  const [wrong, setWrong] = useState(false)
  const [hold, setHold] = useState(0)
  const [opened, setOpened] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [audioStarted, setAudioStarted] = useState(false)
  const [dragged, setDragged] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const sceneIndex = stages.indexOf(progress.scene)
  const act = sceneIndex > 7 ? 'warm' : sceneIndex > 3 ? 'chaos' : 'mystery'

  useEffect(() => { try { const saved = localStorage.getItem('jannuh-archive-progress'); if (saved) setProgress({ ...initialProgress, ...JSON.parse(saved) }) } catch {} }, [])
  useEffect(() => { try { localStorage.setItem('jannuh-archive-progress', JSON.stringify(progress)) } catch {} }, [progress])
  useEffect(() => { if (progress.scene !== 'boot') return; const timer = setInterval(() => setBootLine((v) => Math.min(v + 1, 4)), 650); return () => clearInterval(timer) }, [progress.scene])

  const advance = (scene: Scene, event: string, context?: Record<string, string>) => { haptic(); setProgress((p) => ({ ...p, scene })); eventLog(event, scene, context) }
  const addSecret = (id: string) => { if (progress.secrets.includes(id)) return; haptic(25); setProgress((p) => ({ ...p, secrets: [...p.secrets, id] })); eventLog('SECRET_FOUND', progress.scene, { secret: id }) }
  const startHold = () => { if (holdTimer.current) return; holdTimer.current = setInterval(() => setHold((v) => { if (v >= 100) { if (holdTimer.current) clearInterval(holdTimer.current); holdTimer.current = null; setProgress((p) => ({ ...p, puzzle: true })); eventLog('PUZZLE_SOLVED', 'file'); haptic(35); return 100 } return v + 4 }), 40) }
  const stopHold = () => { if (holdTimer.current) clearInterval(holdTimer.current); holdTimer.current = null; if (hold < 100) setHold(0) }
  const finish = () => { const ending = progress.secrets.length >= 3 ? 'ultra' : progress.secrets.length >= 1 ? 'secret' : 'normal'; setProgress((p) => ({ ...p, scene: 'ending', ending })); eventLog(ending === 'normal' ? 'EXPERIENCE_COMPLETED' : `${ending.toUpperCase()}_ENDING`, 'ending') }

  const progressLabel = useMemo(() => `${String(Math.max(sceneIndex + 1, 1)).padStart(2, '0')} / ${String(stages.length).padStart(2, '0')}`, [sceneIndex])

  if (progress.scene === 'boot') return <main className="archive boot" onClick={() => bootLine >= 4 && setProgress((p) => ({ ...p, scene: 'identity' }))}><div className="grain" /><div className="boot-mark">◒</div><div className="terminal-lines"><p>INITIALIZING<span className="blink">_</span></p>{bootLine > 0 && <p>PERSONAL ARCHIVE</p>}{bootLine > 1 && <p className="dim">-----------------</p>}{bootLine > 2 && <p>SUBJECT: J</p>}{bootLine > 3 && <p className="accent">ACCESS REQUEST DETECTED</p>}</div><div className="boot-footer">{bootLine >= 4 ? 'TAP TO CONTINUE' : 'PLEASE REMAIN SUSPICIOUS'}</div></main>

  return <main className={`archive ${act}`}>
    <div className="ambient" /><div className="grain" />
    <header className="hud"><span className="case-id">PDB / ARCHIVE-07</span><span>{progressLabel}</span><button aria-label="Tap for a secret" className="tiny-dot" onClick={() => { const next = tapCount + 1; setTapCount(next); if (next >= 5) addSecret('hidden-title') }}>·</button></header>
    <section className="scene" aria-live="polite">
      {progress.scene === 'identity' && <><div className="eyebrow">IDENTITY REQUIRED</div><h1>Identify yourself.</h1><p className="lede">The archive has been waiting. It is being very dramatic about this.</p><div className="choice-list"><button onClick={() => { setWrong(true); haptic() }}>Someone suspicious</button><button onClick={() => { setWrong(true); haptic() }}>Obviously the good boy&apos;s mommy</button><button className="correct" onClick={() => advance('file', 'IDENTITY_CONFIRMED')}>Jannuh</button></div>{wrong && <p className="error-line">ACCESS DENIED. <span>nice try.</span></p>}</>}
      {progress.scene === 'file' && <><div className="eyebrow">PERSONAL FILE / 01</div><h1>Something was found.</h1><div className="file-card"><div className="file-top"><span>CLASSIFIED</span><span>11—JUL</span></div><div className="file-symbol">?</div><p>There is a clue in here. It is protected by an extremely sophisticated security system.</p><div className="hold-ring" style={{ '--hold': `${hold * 3.6}deg` } as React.CSSProperties}><button onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}>HOLD TO DECRYPT</button></div><small>{hold ? `${hold}% DECRYPTED` : 'press and hold'}</small></div>{progress.puzzle && <button className="primary-action" onClick={() => advance('origin', 'FIRST_CLUE_FOUND')}>OPEN DECRYPTED FILE →</button>}</>}
      {progress.scene === 'origin' && <><div className="eyebrow">ORIGIN TRACE</div><h1>Well… technically<br />I met you.</h1><p className="lede">The archive places the first signal around here.</p><div className="timeline"><div className="tick faded">09</div><div className="tick active">11 <span>JUL</span></div><div className="tick faded">14</div></div><div className="origin-note"><span>ORIGIN FOUND</span><strong>{relationship.origin}</strong><p>Subject J detected.</p></div><button className="primary-action" onClick={() => advance('chaos', 'PUZZLE_SOLVED')}>CONTINUE INVESTIGATION →</button></>}
      {progress.scene === 'chaos' && <><div className="eyebrow">UNAUTHORIZED MODULE</div><h1>Chaos room.</h1><p className="lede">A totally normal certification process. Please do not question the machine.</p><div className="cert"><span>GOOD BOY STATUS</span><div className="meter"><i /></div><strong>82%</strong><p>Analyzing…</p><p className="result">Unfortunately…<br /><b>yes.</b></p></div><button className="secret-object" onClick={() => addSecret('suspicious-dot')}>[ suspicious object ]</button><button className="primary-action" onClick={() => advance('distance', 'CHAOS_ROOM_ENTERED')}>I ACCEPT THIS RESULT →</button></>}
      {progress.scene === 'distance' && <><div className="eyebrow">SIGNAL CHECK</div><h1>Annoyingly far away.</h1><div className="signal-map"><div><span className="signal-dot" />YOU<small>ONLINE</small></div><div className="signal-line" /><div><span className="signal-dot warm-dot" />HER<small>ONLINE</small></div></div><p className="signal-caption">distance detected<br /><b>connection: still working</b></p><button className="primary-action" onClick={() => advance('package', 'MEMORY_OPENED')}>CHECK NEXT OBJECT →</button></>}
      {progress.scene === 'package' && <><div className="eyebrow">OBJECT #07 / EASTER EGG</div><h1>The package<br />investigation.</h1><div className="package-file"><span>STATUS</span><strong>NOT YET RECOVERED</strong><span>KNOWN CONTENTS</span>{relationship.packageContents.map((item) => <p key={item}>+ {item}</p>)}<span>EXPECTED RECOVERY</span><strong>AFTER 21 OCT / ???</strong></div><button className="primary-action" onClick={() => { addSecret('package-file'); advance('letter', 'PACKAGE_OPENED') }}>CLOSE FILE →</button></>}
      {progress.scene === 'letter' && <><div className="eyebrow">PERSONAL FILE / TO: JANNUH</div><h1>A document<br />from your good boy.</h1>{!opened ? <button className="letter-stub" onClick={() => { setOpened(true); eventLog('LETTER_OPENED', 'letter') }}><span>PRIVATE</span><strong>OPEN LETTER</strong><small>tap to unseal</small></button> : <div className="letter"><span className="letter-line">FOR JANNUH,</span>{relationship.letter.map((line) => <p key={line}>{line}</p>)}</div>} {opened && <button className="primary-action" onClick={() => advance('transmission', 'LETTER_OPENED')}>FINAL TRANSMISSION →</button>}</>}
      {progress.scene === 'transmission' && <><div className="eyebrow">AUDIO FILE FOUND</div><h1>Final<br />transmission.</h1><div className="audio-file"><span>FROM: your good boy</span><div className="waveform">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ height: `${18 + ((i * 17) % 42)}%` }} />)}</div><button onClick={() => { setAudioStarted(true); setProgress((p) => ({ ...p, voiceCompleted: true })); eventLog('VOICE_COMPLETED', 'transmission'); haptic(20) }}>{audioStarted ? 'TRANSMISSION RECEIVED' : '▶  PLAY AUDIO FILE'}</button><small>{audioStarted ? '00:12 / 00:12' : 'audio/voice-note.mp3 · no autoplay'}</small></div>{audioStarted && <button className="primary-action" onClick={() => advance('reveal', 'FINAL_REVEAL_REACHED')}>CONTINUE →</button>}</>}
      {progress.scene === 'reveal' && <><div className="reveal"><span>CASE STATUS</span><div className="full-meter" /><p>...</p><h1>Actually.</h1><p>There was never a case.</p><strong>I just wanted an excuse<br />to make you something.</strong></div><button className="primary-action" onClick={finish}>CLOSE THE FILE →</button></>}
      {progress.scene === 'ending' && <><div className="ending"><span className="eyebrow">CASE CLOSED</span><h1>Jannuh successfully<br />completed the investigation.</h1><p>Evidence recovered: <b>████████████</b></p><p>Good boy status: <b>CONFIRMED</b></p>{progress.ending === 'secret' && <div className="secret-ending">SECRET ENDING UNLOCKED.<br />you really clicked everything.<br />respect.</div>}{progress.ending === 'ultra' && <div className="secret-ending">{relationship.endings.ultra.join('\n')}</div>}<p className="signature">For Jannuh.<br />From your good boy.</p></div><button className="primary-action" onClick={() => { localStorage.removeItem('jannuh-archive-progress'); location.reload() }}>START OVER</button></>}
    </section>
    <footer className="scene-footer"><span>ANONYMOUS SESSION</span><button onClick={() => { setDragged(true); addSecret('footer-tap') }}>{dragged ? 'you found something.' : '◌'}</button></footer>
  </main>
}
