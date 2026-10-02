export const relationship = {
  subject: 'Jannuh',
  aliases: ['Jannuh', 'Bauni', 'Mommy'],
  origin: 'Personality Database',
  approximateDate: '11 JUL',
  packageContents: ['rubber band', 'jhumka', 'letter', 'random tiny things', 'emotional damage'],
  letter: [
    "I could've just sent you a paragraph.",
    'But apparently my brain decided that was not enough.',
    'So I built you a tiny little place on the internet instead.',
    'You are annoyingly far away, but somehow still one of the easiest people to feel close to.',
    'Thank you for being my best mommy, my favorite person to bother, and the reason this ridiculous case exists.',
  ],
  endings: {
    normal: ['You found the clues.', 'You survived the nonsense.', 'You successfully investigated absolutely nothing.', 'For Jannuh. From your good boy.'],
    secret: ['You really clicked everything.', 'Respect.', 'The investigation is still fake, but your curiosity is unfortunately real.'],
    ultra: ['CASE FILE NOTE:', 'mommy better than ChatGPT remains an unverified but highly likely claim.', 'I am not accepting appeals.'],
  },
} as const

export type Relationship = typeof relationship
