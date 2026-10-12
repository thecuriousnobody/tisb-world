/**
 * Track record (About → /about#record). Drawn only from Rajeev's LinkedIn
 * profile — don't add claims that aren't there; this page gets shown to
 * investors. Framing he chose: "close to two decades of Caterpillar embedded
 * systems product development" (June 2005 – Nov 2022).
 *
 * Kept to the salient roles, with the ones where he led or built teams up
 * front. The six-month telematics test-automation stint (2019) is folded out.
 */

export interface Role {
  years: string
  title: string
  /** Where, when it adds weight (e.g. Caterpillar India). */
  place?: string
  points: string[]
}

export const RECORD_LEAD =
  'Caterpillar, 2005–2022: electrohydraulic controls, systems integration, hardware-in-the-loop validation, and autonomous mining trucks — from first design to fleets in the field.'

export const roles: Role[] = [
  {
    years: '2019 – 2022',
    title: 'Automation Engineering Specialist — Autonomous Mining Trucks',
    points: [
      'Built analytics in Python, MATLAB, SQL and C++ that diagnosed operational issues across the autonomous truck fleet, feeding the autonomy software teams.',
      'Wrote the embedded C/C++ interfacing that extended truck autonomy to more Caterpillar truck models; prototyped ML to classify truck operations.',
    ],
  },
  {
    years: '2017 – 2019',
    title: 'Machine Systems Test Champion',
    points: [
      'Moved costly field tests for mining and construction equipment onto hardware-in-the-loop rigs.',
      "Standardized embedded-software validation across Caterpillar's prime products; led a Six Sigma transformation of machine software validation.",
    ],
  },
  {
    years: '2013 – 2017',
    title: 'Team Leader → Engineering Specialist, Systems Integration & HIL',
    points: [
      'Built virtual test infrastructure for medium wheel loaders — digital machine twins, a virtual operator and virtual terrain running on dSPACE hardware-in-the-loop.',
      'Led software validation for the next-generation K, M and XE wheel loaders (hydraulics, steering, engine, payload, powertrain) and gave technical leadership to international loader teams; a variant-management system saved close to $200K over two years.',
    ],
  },
  {
    years: '2012 – 2013',
    title: 'International Service Engineer',
    place: 'Caterpillar India — Chennai',
    points: [
      "Set up, mentored and trained Caterpillar India's controls software validation and test team.",
      'Created the plant models and closed-loop test infrastructure the team verified control systems on.',
    ],
  },
  {
    years: '2009 – 2012',
    title: 'Senior Engineer — Systems Integration',
    points: [
      'Technical lead for system integration and test on the next-generation CVT medium wheel loader; rapid-prototyped new transmission control algorithms and worked pilot machine builds on the factory floor.',
    ],
  },
  {
    years: '2005 – 2009',
    title: 'Design Engineer — Electrohydraulic Controls',
    points: [
      'Designed and validated the implement electrohydraulic control software for H & K Series medium wheel loaders; built a prototype EH implement control system for an underground mining drill.',
    ],
  },
]

export const patents = [
  'Automated test management system for electronic control modules',
  'Linkage control system with position estimator backup',
  'Controlled motion in a hydraulically actuated system',
]

export const recognition = ["Chairman's Award finalist"]

export const education = [
  'M.S. Electrical Engineering — Wright State University',
  'B.E. Electrical & Electronics Engineering — Bangalore University',
]
