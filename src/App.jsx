import { useMemo, useState } from 'react'
import { BREEDS, QUIZ } from './data/breeds'
import { matchBreeds, traitLabel } from './lib/match'

const SIZE_FILTERS = ['All sizes', 'Small', 'Medium', 'Large']

function TraitBar({ label, value, max = 5 }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="w-28 shrink-0 font-semibold text-gray-600">{label}</span>
      <span className="flex gap-1">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 w-5 rounded-full ${i < value ? 'bg-paw-green' : 'bg-gray-200'}`}
          />
        ))}
      </span>
      <span className="w-28 shrink-0 text-right text-xs font-bold text-paw-green">
        {traitLabel(label.toLowerCase().replace(' ', ''), value)}
      </span>
    </div>
  )
}

function BreedCard({ breed, score, reasons, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="w-full rounded-3xl bg-white p-5 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-xl font-semibold leading-tight text-paw-dark">{breed.name}</h3>
          <p className="mt-1 text-sm font-bold text-gray-500">
            {breed.size} · {breed.weight} · {breed.lifespan}
          </p>
        </div>
        {score != null && (
          <span className="shrink-0 rounded-full bg-paw-green px-3 py-1 text-sm font-extrabold text-white">
            {score}% match
          </span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{breed.desc}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {breed.temperament.map((t) => (
          <span key={t} className="rounded-full bg-paw-cream px-2.5 py-1 text-xs font-bold text-paw-dark">
            {t}
          </span>
        ))}
      </div>
      {reasons && reasons.length > 0 && (
        <div className="mt-3 space-y-1">
          {reasons.map((r) => (
            <p key={r} className="text-sm font-bold text-paw-green">✓ {r}</p>
          ))}
        </div>
      )}
      <p className="mt-3 text-sm font-bold text-paw-coral">See full details →</p>
    </button>
  )
}

function BreedModal({ breed, onClose }) {
  if (!breed) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-paw-dark">{breed.name}</h2>
            <p className="mt-1 font-bold text-gray-500">
              {breed.size} · {breed.weight} · {breed.lifespan} · {breed.exercise} min exercise a day
            </p>
          </div>
          <button onClick={onClose} className="rounded-full bg-gray-100 px-3 py-1.5 text-lg font-bold text-gray-600">
            ✕
          </button>
        </div>
        <p className="mt-4 leading-relaxed text-gray-700">{breed.desc}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {breed.goodFor.map((g) => (
            <span key={g} className="rounded-full bg-paw-green px-3 py-1 text-xs font-bold text-white">
              {g}
            </span>
          ))}
        </div>
        <div className="mt-5 space-y-2 rounded-2xl bg-paw-cream p-4">
          <TraitBar label="Energy" value={breed.energy} />
          <TraitBar label="Shedding" value={breed.shedding} />
          <TraitBar label="Barking" value={breed.barking} />
          <TraitBar label="Trainability" value={breed.trainability} />
          <TraitBar label="Kid friendly" value={breed.kidFriendly} />
          <TraitBar label="Apartment" value={breed.apartment} />
          <TraitBar label="Other pets" value={breed.otherPets} />
          <TraitBar label="Grooming" value={breed.grooming} />
          <TraitBar label="First time" value={breed.firstTime} />
        </div>
        <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>Health note:</strong> {breed.health}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Every dog is an individual — meet the dog in person, and consider a shelter or rescue first.
        </p>
      </div>
    </div>
  )
}

const FAQS = [
  {
    q: 'How does PawMatch pick my dog breeds?',
    a: 'You answer 10 questions about your home, activity level, schedule, kids, other pets, allergies, experience, size, barking and grooming. PawMatch scores 48 breeds against your answers and shows your top 3 matches with the reasons why, plus breeds to think twice about.',
  },
  {
    q: 'Is PawMatch free?',
    a: 'Yes. The quiz, your matches and the full breed guide are all free, with no sign-up.',
  },
  {
    q: 'Should I adopt or buy from a breeder?',
    a: 'Shelters and rescues are a great first stop — many have purebreds as well as mixed breeds, and staff can help match you in person. If you go to a breeder, look for one who health-tests their dogs and lets you meet the parents.',
  },
  {
    q: 'What is the best dog for an apartment?',
    a: 'Lower-energy, quieter breeds tend to do best in apartments — French Bulldogs, Cavalier King Charles Spaniels, Pugs, Boston Terriers and Greyhounds are popular apartment picks. Take the quiz to see which ones fit your whole lifestyle, not just your home.',
  },
  {
    q: 'What is the best dog for first-time owners?',
    a: 'Easy-going, trainable breeds are the safest first dogs — Labradors, Golden Retrievers, Cavaliers, Pugs, Boston Terriers and Havanese are all strong first-time picks.',
  },
  {
    q: 'Is this advice a substitute for a vet?',
    a: 'No. PawMatch gives general guidance based on typical breed traits, but every dog is an individual. Talk to a vet, a trainer or a rescue about any dog before you commit.',
  },
]

export default function App() {
  const [view, setView] = useState('home')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [sizeFilter, setSizeFilter] = useState('All sizes')
  const [copied, setCopied] = useState(false)

  const startQuiz = () => {
    setAnswers({})
    setStep(0)
    setResults(null)
    setView('quiz')
    window.scrollTo({ top: 0 })
  }

  const answerQuestion = (value) => {
    const q = QUIZ[step]
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    if (step + 1 < QUIZ.length) {
      setStep(step + 1)
    } else {
      setResults(matchBreeds(next))
      setView('results')
    }
    window.scrollTo({ top: 0 })
  }

  const filteredBreeds = useMemo(() => {
    return BREEDS.filter((b) => {
      if (sizeFilter !== 'All sizes' && b.size !== sizeFilter) return false
      if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, sizeFilter])

  const shareText = () => {
    if (!results) return ''
    const lines = results.top.map((r, i) => `${i + 1}. ${r.breed.name} — ${r.score}% match`)
    return `My PawMatch results:\n${lines.join('\n')}\nFind your match: ${window.location.href}`
  }

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(shareText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-h-screen bg-paw-cream font-body text-gray-800">
      <header className="sticky top-0 z-40 border-b border-amber-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button onClick={() => setView('home')} className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <span className="font-display text-2xl font-semibold text-paw-dark">
              Paw<span className="text-paw-green">Match</span>
            </span>
          </button>
          <nav className="flex items-center gap-1">
            <button
              onClick={startQuiz}
              className="rounded-full bg-paw-green px-4 py-2 text-sm font-extrabold text-white shadow hover:brightness-110"
            >
              Take the quiz
            </button>
            <button
              onClick={() => setView('breeds')}
              className="rounded-full px-4 py-2 text-sm font-extrabold text-paw-dark hover:bg-paw-cream"
            >
              Breeds
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16">
        {view === 'home' && (
          <>
            <section className="pt-10 text-center sm:pt-16">
              <p className="text-6xl">🐶</p>
              <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-paw-dark sm:text-6xl">
                Find the dog that fits <span className="text-paw-green">your life</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
                Answer 10 quick questions about your home, your schedule and your lifestyle.
                We will match you with the breeds that fit — and tell you honestly which ones to think twice about.
              </p>
              <button
                onClick={startQuiz}
                className="mt-6 rounded-full bg-paw-green px-8 py-4 font-display text-xl font-semibold text-white shadow-lg hover:brightness-110"
              >
                Find my match →
              </button>
              <p className="mt-3 text-sm font-bold text-gray-500">Free · No sign-up · 48 breeds · About 2 minutes</p>
            </section>

            <section className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { emoji: '📝', title: '1. Answer 10 questions', text: 'Home, activity, schedule, kids, pets, allergies and more.' },
                { emoji: '🎯', title: '2. Get your top 3', text: 'Your best matches with a score and the reasons why they fit.' },
                { emoji: '🐕', title: '3. Meet your match', text: 'Read the full breed guide, then check shelters and rescues first.' },
              ].map((s) => (
                <div key={s.title} className="rounded-3xl bg-white p-5 text-center shadow-md">
                  <p className="text-4xl">{s.emoji}</p>
                  <h2 className="mt-2 font-display text-lg font-semibold text-paw-dark">{s.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{s.text}</p>
                </div>
              ))}
            </section>

            <section className="mt-12">
              <h2 className="text-center font-display text-2xl font-semibold text-paw-dark sm:text-3xl">
                A few favourites to browse
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {['labrador', 'french-bulldog', 'cavalier', 'golden'].map((id) => {
                  const breed = BREEDS.find((b) => b.id === id)
                  return <BreedCard key={id} breed={breed} onOpen={() => setSelected(breed)} />
                })}
              </div>
              <div className="mt-5 text-center">
                <button
                  onClick={() => setView('breeds')}
                  className="rounded-full bg-paw-dark px-6 py-3 font-display font-semibold text-white shadow hover:brightness-110"
                >
                  Browse all 48 breeds →
                </button>
              </div>
            </section>

            <section className="mt-12 rounded-3xl bg-paw-green p-6 text-center text-white shadow-lg sm:p-8">
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">Found your match?</h2>
              <p className="mx-auto mt-2 max-w-xl leading-relaxed text-green-100">
                Once your new best friend comes home, keep every memory in TimePawz — photos,
                milestones and their whole story in one beautiful scrapbook.
              </p>
              <a
                href="https://timepawz.site"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-full bg-white px-6 py-3 font-display font-semibold text-paw-green shadow hover:brightness-95"
              >
                Visit TimePawz →
              </a>
            </section>

            <section className="mt-12">
              <h2 className="text-center font-display text-2xl font-semibold text-paw-dark sm:text-3xl">
                Questions, answered
              </h2>
              <div className="mx-auto mt-5 max-w-3xl space-y-3">
                {FAQS.map((f) => (
                  <details key={f.q} className="rounded-2xl bg-white p-4 shadow-md">
                    <summary className="cursor-pointer font-display text-lg font-semibold text-paw-dark">
                      {f.q}
                    </summary>
                    <p className="mt-2 leading-relaxed text-gray-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'quiz' && (
          <section className="mx-auto max-w-2xl pt-10">
            <div className="flex items-center justify-between text-sm font-bold text-gray-500">
              <span>
                Question {step + 1} of {QUIZ.length}
              </span>
              <button onClick={() => setView('home')} className="underline">
                Exit quiz
              </button>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-paw-green transition-all"
                style={{ width: `${((step + 1) / QUIZ.length) * 100}%` }}
              />
            </div>
            <h1 className="mt-6 text-center font-display text-3xl font-semibold text-paw-dark sm:text-4xl">
              {QUIZ[step].question}
            </h1>
            <div className="mt-6 space-y-3">
              {QUIZ[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => answerQuestion(opt.value)}
                  className="w-full rounded-2xl bg-white p-4 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <span className="font-display text-lg font-semibold text-paw-dark">{opt.label}</span>
                  <span className="block text-sm text-gray-500">{opt.hint}</span>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mt-4 font-bold text-gray-500 underline"
              >
                ← Back
              </button>
            )}
          </section>
        )}

        {view === 'results' && results && (
          <section className="pt-10">
            <div className="text-center">
              <p className="text-5xl">🎉</p>
              <h1 className="mt-3 font-display text-3xl font-semibold text-paw-dark sm:text-4xl">
                Your top matches
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-gray-600">
                Based on your answers, these breeds fit your life best. Remember: every dog is an
                individual — meet the dog in person before you decide.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {results.top.map((r, i) => (
                <div key={r.breed.id} className={i === 0 ? 'sm:col-span-1' : ''}>
                  <div className="mb-2 text-center">
                    <span className="rounded-full bg-paw-gold px-3 py-1 text-sm font-extrabold text-paw-dark">
                      {i === 0 ? '🏆 Best match' : i === 1 ? '🥈 Runner-up' : '🥉 Third place'}
                    </span>
                  </div>
                  <BreedCard breed={r.breed} score={r.score} reasons={r.reasons} onOpen={() => setSelected(r.breed)} />
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={copyResults}
                className="rounded-full bg-paw-green px-6 py-3 font-display font-semibold text-white shadow hover:brightness-110"
              >
                {copied ? 'Copied! ✓' : 'Copy my results to share'}
              </button>
              <button
                onClick={startQuiz}
                className="ml-2 rounded-full bg-white px-6 py-3 font-display font-semibold text-paw-dark shadow hover:brightness-95"
              >
                Retake the quiz
              </button>
            </div>

            <div className="mt-10 rounded-3xl bg-white p-6 shadow-md">
              <h2 className="font-display text-2xl font-semibold text-paw-dark">Think twice about these</h2>
              <p className="mt-1 text-gray-600">
                Not bad dogs — just a harder fit for the life you described. If your heart is set on one,
                talk to owners and breeders first.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {results.thinkTwice.map((r) => (
                  <div key={r.breed.id} className="rounded-2xl bg-amber-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold text-paw-dark">{r.breed.name}</h3>
                      <span className="shrink-0 rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-extrabold text-amber-900">
                        {r.score}% match
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">
                      Why it clashes: {r.clash}.
                    </p>
                    <button
                      onClick={() => setSelected(r.breed)}
                      className="mt-2 text-sm font-bold text-paw-coral underline"
                    >
                      See full details →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-paw-green p-6 text-center text-white shadow-lg">
              <h2 className="font-display text-2xl font-semibold">Ready to meet your match?</h2>
              <p className="mx-auto mt-2 max-w-xl leading-relaxed text-green-100">
                Start with shelters and rescues near you — many have purebreds as well as mixed breeds,
                and the staff will help you find the right personality, not just the right breed.
              </p>
            </div>
          </section>
        )}

        {view === 'breeds' && (
          <section className="pt-10">
            <h1 className="text-center font-display text-3xl font-semibold text-paw-dark sm:text-4xl">
              Browse all 48 breeds
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
              Tap any breed for the full picture — temperament, exercise, grooming, health and who it suits best.
            </p>
            <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search breeds…"
                className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3 font-semibold shadow-sm outline-none focus:border-paw-green"
              />
              <div className="flex gap-2 overflow-x-auto">
                {SIZE_FILTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSizeFilter(s)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-extrabold shadow-sm ${
                      sizeFilter === s ? 'bg-paw-dark text-white' : 'bg-white text-paw-dark'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-4 text-center text-sm font-bold text-gray-500">
              Showing {filteredBreeds.length} of {BREEDS.length} breeds
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {filteredBreeds.map((b) => (
                <BreedCard key={b.id} breed={b} onOpen={() => setSelected(b)} />
              ))}
            </div>
            {filteredBreeds.length === 0 && (
              <p className="mt-8 text-center font-bold text-gray-500">
                No breeds match that search — try a different name.
              </p>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-amber-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center text-sm leading-relaxed text-gray-500">
          <p className="font-display text-lg font-semibold text-paw-dark">🐾 PawMatch</p>
          <p className="mx-auto mt-2 max-w-2xl">
            PawMatch gives general guidance based on typical breed traits. Every dog is an individual,
            and breed alone never tells the whole story. Always meet the dog, talk to a vet or trainer,
            and consider adopting from a shelter or rescue first.
          </p>
          <p className="mt-3">
            Made with care for dog lovers. ·{' '}
            <a href="https://timepawz.site" target="_blank" rel="noreferrer" className="font-bold text-paw-green underline">
              TimePawz
            </a>{' '}
            ·{' '}
            <a href="https://paul124592-art-merry-t8we.bolt.host" target="_blank" rel="noreferrer" className="font-bold text-paw-green underline">
              Merry Paws
            </a>
          </p>
        </div>
      </footer>

      <BreedModal breed={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
