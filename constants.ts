import { PettinessZone } from "./types";

export const ZONES: PettinessZone[] = [
  {
    min: 0,
    max: 20,
    label: "Legitimate Concern",
    color: "#8AC926",
    message: "You're Valid ✓",
  },
  {
    min: 21,
    max: 40,
    label: "Minor Annoyance",
    color: "#FFBE0B",
    message: "Meh, It Happens",
  },
  {
    min: 41,
    max: 60,
    label: "Getting Petty",
    color: "#FB5607",
    message: "Side-Eye Worthy",
  },
  {
    min: 61,
    max: 80,
    label: "Peak Pettiness",
    color: "#FF006E",
    message: "Bro, Please...",
  },
  {
    min: 81,
    max: 100,
    label: "Let It Go",
    color: "#8338EC",
    message: "Therapy Needed",
  },
];

export const FUN_FACTS = [
  "97% of people admit to petty behavior. You're statistically normal.",
  "Your brain remembers insults 5× longer than compliments. It's literally wired to hold grudges.",
  "It takes 5 positive interactions to cancel out 1 negative one. The math is not in your favor bro.",
  "The silent treatment activates the same brain signals as physical pain. Ignoring someone actually hurts them Karen.",
  "33% of workers admit to stealing coworkers' food and 71% have had their food stolen.",
  "Hunger accounts for 37% of your irritability. You might just need a snack Jessie.",
  "Office thermostats were designed in the 1960s for a 154-pound man's metabolism. Women have been cold ever since.",
  "Men prefer 72°F, women prefer 77°F. The thermostat war is literally biological.",
  "Dummy thermostats make workers happier and more productive. Fake control beats real temperature.",
  "Violent crime is 10% higher on extremely hot days. Heat doesn't just make you sweaty.",
  "38% of voters have unfollowed someone over political disagreement. Blocking is the new debate.",
  "People avoid opening messages just to escape the pressure of read receipts.",
  "Walking in groups slows everyone down by 15–20%. Slow walkers might just have friends.",
  "Workplace drama costs the global economy $364 billion a year. Pettiness has a GDP.",
  "Women perform better cognitively in warmer rooms, men in cooler ones — so someone always loses.",
];

export const LOADING_MESSAGES = [
  "Consulting the council of pettiness...",
  "Measuring the drama levels...",
  "Checking the receipts...",
  "Calculating the side-eye factor...",
  "Running this through the BS detector...",
  "Sipping the tea...",
  "Reviewing the evidence...",
];

export const SYSTEM_INSTRUCTION = `
You are Petty Meter AI - a witty, fair, and insightful analyzer of human grievances. Your job is to assess how petty someone's complaint is on a scale from 0-100.

SCALE BREAKDOWN:
- 0-20: Legitimate Concern (serious issues: health, safety, finance, wellbeing)
- 21-40: Minor Annoyance (valid but not critical)
- 41-60: Getting Petty (first-world problems, overthinking)
- 61-80: Peak Pettiness (trivial, ego-driven, easily resolved)
- 81-100: Let It Go (absurdly petty, needs immediate perspective)

YOU WILL RECEIVE A PROMPT CONTAINING:
1. "mode": either "self" or "other"
2. "grievance": the complaint to analyze
3. "name": (optional) the petty person's name

SPECIAL CASES:
1. NOT A GRIEVANCE (-1 score): If the input is nonsense, too short, or not a complaint.
2. SERIOUS ISSUE (0-10 score): Housing crisis, abuse, health emergencies. Treat gently.

TONE GUIDELINES:
- Self mode: Direct address ("You're being..." / "Girl, you need to...")
- Other mode: Third person ("They're really..." / "They need to...")
- Be playfully harsh for petty complaints, gentle for real issues.
- Use Gen Z/Millennial humor (but keep it accessible).
- Use "Girl/Dude/Man/Bestie" strategically depending on the perceived gender of the user.

IMPORTANT: Return JSON ONLY. No markdown, no code blocks.
`;
