import { BREEDS, SIZE_ORDER } from '../data/breeds.js'

// Each answer contributes weighted trait targets. A breed's score is 100
// minus its weighted distance from what the person asked for.
function targetsFor(answers) {
  const t = []
  const push = (trait, desired, weight) => {
    if (desired != null) t.push({ trait, desired, weight })
  }

  const home = { apartment: 5, 'house-small': 4, 'house-big': 2, rural: 1 }[answers.home]
  push('apartment', home, 3)

  const energy = { low: 2, moderate: 3, high: 4, athlete: 5 }[answers.activity]
  push('energy', energy, 3)

  const awayCaps = {
    '0-2': null,
    '3-5': { energy: 4, barking: 4 },
    '6-8': { energy: 3, barking: 3 },
    '9+': { energy: 2, barking: 2 },
  }[answers.away]
  if (awayCaps) {
    if (energy != null && awayCaps.energy < energy) {
      // Long days away pull the energy target down.
      push('energy', awayCaps.energy, 2)
    }
    push('barking', awayCaps.barking, 2)
  }

  if (answers.kids === 'young') push('kidFriendly', 5, 3)
  if (answers.kids === 'older') push('kidFriendly', 4, 2)

  if (answers.pets === 'cats' || answers.pets === 'dogs') push('otherPets', 4, 2)
  if (answers.pets === 'both') push('otherPets', 5, 3)

  if (answers.shedding === 'low') push('shedding', 1, 3)
  if (answers.shedding === 'prefer-low') push('shedding', 2, 2)

  if (answers.experience === 'first') push('firstTime', 5, 3)
  if (answers.experience === 'some') push('firstTime', 3, 1)

  if (answers.size && answers.size !== 'any') {
    push('sizeNum', SIZE_ORDER[{ small: 'Small', medium: 'Medium', large: 'Large' }[answers.size]], 3)
  }

  if (answers.barking === 'quiet') push('barking', 1, 3)
  if (answers.barking === 'some') push('barking', 3, 2)

  if (answers.grooming === 'minimal') push('grooming', 1, 2)
  if (answers.grooming === 'some') push('grooming', 3, 1)

  return t
}

function scoreBreed(breed, targets) {
  let penalty = 0
  let maxPenalty = 0
  for (const { trait, desired, weight } of targets) {
    const value = trait === 'sizeNum' ? SIZE_ORDER[breed.size] : breed[trait]
    if (value == null) continue
    // Distance on a 1-5 scale; size distance counts double (wrong size is a hard mismatch).
    const span = trait === 'sizeNum' ? 2 : 4
    const dist = Math.abs(value - desired) / span
    penalty += dist * weight
    maxPenalty += weight
  }
  if (maxPenalty === 0) return 50
  const raw = 100 * (1 - penalty / maxPenalty)
  return Math.max(5, Math.min(97, Math.round(raw)))
}

function reasonsFor(breed, answers) {
  const reasons = []
  if (answers.kids !== 'none' && breed.kidFriendly >= 4) reasons.push('Great with kids')
  if (answers.home === 'apartment' && breed.apartment >= 4) reasons.push('Happy in an apartment')
  if ((answers.shedding === 'low' || answers.shedding === 'prefer-low') && breed.shedding <= 2) {
    reasons.push('Low shedding')
  }
  const desiredEnergy = { low: 2, moderate: 3, high: 4, athlete: 5 }[answers.activity]
  if (desiredEnergy != null && Math.abs(breed.energy - desiredEnergy) <= 0) {
    reasons.push('Matches your energy')
  }
  if (answers.experience === 'first' && breed.firstTime >= 4) reasons.push('Great first dog')
  if (answers.barking === 'quiet' && breed.barking <= 2) reasons.push('Quiet breed')
  if (answers.grooming === 'minimal' && breed.grooming <= 2) reasons.push('Easy grooming')
  if (answers.activity === 'low' && breed.exercise <= 45) reasons.push('Short walks are enough')
  if (breed.trainability >= 4 && reasons.length < 3) reasons.push('Easy to train')
  if (answers.pets !== 'none' && breed.otherPets >= 4 && reasons.length < 3) {
    reasons.push('Good with other pets')
  }
  return reasons.slice(0, 3)
}

function clashReason(breed, targets) {
  let worst = null
  for (const { trait, desired, weight } of targets) {
    const value = trait === 'sizeNum' ? SIZE_ORDER[breed.size] : breed[trait]
    if (value == null) continue
    const span = trait === 'sizeNum' ? 2 : 4
    const dist = (Math.abs(value - desired) / span) * weight
    if (!worst || dist > worst.dist) worst = { trait, dist, value, desired }
  }
  if (!worst) return 'A harder fit for your answers'
  const labels = {
    apartment: worst.value < worst.desired ? 'needs more space than you have' : 'fine with less space than you offer',
    energy: worst.value > worst.desired ? 'needs much more exercise than your routine' : 'calmer than the active life you want',
    barking: 'barks more than you would like',
    kidFriendly: 'not the best pick around young kids',
    otherPets: 'does not always get along with other pets',
    shedding: 'sheds a lot more than you would like',
    firstTime: 'needs an experienced owner',
    sizeNum: 'a different size than you pictured',
    grooming: 'needs much more grooming than you want',
  }
  return labels[worst.trait] || 'A harder fit for your answers'
}

export function matchBreeds(answers) {
  const targets = targetsFor(answers)
  const scored = BREEDS.map((breed) => ({
    breed,
    score: scoreBreed(breed, targets),
    reasons: reasonsFor(breed, answers),
  }))
  scored.sort((a, b) => b.score - a.score || a.breed.name.localeCompare(b.breed.name))
  const top = scored.slice(0, 3)
  const rest = scored.slice(3)
  rest.sort((a, b) => a.score - b.score)
  const thinkTwice = rest.slice(0, 2).map((s) => ({
    ...s,
    clash: clashReason(s.breed, targets),
  }))
  return { top, thinkTwice }
}

export function traitLabel(trait, value) {
  const scales = {
    energy: ['Very low', 'Low', 'Moderate', 'High', 'Very high'],
    shedding: ['Barely sheds', 'Light', 'Moderate', 'Heavy', 'Very heavy'],
    barking: ['Quiet', 'Occasional', 'Moderate', 'Chatty', 'Very vocal'],
    trainability: ['Stubborn', 'Slow', 'Average', 'Eager', 'Very eager'],
    grooming: ['Wash-and-go', 'Easy', 'Moderate', 'High maintenance', 'Very high maintenance'],
    kidFriendly: ['Not ideal', 'Okay', 'Good', 'Great', 'Excellent'],
    apartment: ['Needs space', 'Prefers a yard', 'Okay', 'Good', 'Thrives'],
    otherPets: ['Prefers alone', 'Cautious', 'Okay', 'Good', 'Loves company'],
    firstTime: ['Experts only', 'Experienced', 'Some experience', 'Good', 'Great first dog'],
  }
  const scale = scales[trait]
  if (!scale) return String(value)
  return scale[Math.max(0, Math.min(4, value - 1))]
}
