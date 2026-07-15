import { z } from 'zod'

// ─── Tournament Validation ───────────────────────────────────────────────────

export const tournamentSchema = z.object({
  name: z.string().min(3, 'Tournament name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase alphanumeric with hyphens'
  ),
  game: z.string().min(1, 'Game is required'),
  bannerImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  type: z.enum(['SOLO', 'SQUAD', 'BOTH']),
  status: z.enum(['UPCOMING', 'LIVE', 'COMPLETED']).default('UPCOMING'),
  maxSlots: z.coerce.number().int().min(2, 'Minimum 2 slots required'),
  entryFee: z.coerce.number().min(0, 'Entry fee cannot be negative'),
  prizePool: z.string().optional(),
  startDate: z.coerce.date({ message: 'Valid start date is required' }),
  endDate: z.coerce.date().optional(),
  rules: z.string().optional(),
  discordLink: z.string().url().optional().or(z.literal('')),
  whatsappLink: z.string().url().optional().or(z.literal('')),
  youtubeLink: z.string().url().optional().or(z.literal('')),
})

export type TournamentFormData = z.infer<typeof tournamentSchema>

// ─── Solo Registration Validation ────────────────────────────────────────────

export const registrationSchema = z.object({
  tournamentId: z.string().min(1, 'Tournament ID is required'),
  playerName: z.string().min(2, 'Player name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'WhatsApp number is required'),
  gamertag: z.string().min(2, 'Nickname must be at least 2 characters'),
  gameUID: z.string().min(5, 'UID is required'),
  paymentScreenshot: z.string().optional(),
  uidScreenshot: z.string().min(1, 'UID verification screenshot is required'),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>

// ─── Squad Registration Validation ───────────────────────────────────────────

export const teamMemberSchema = z.object({
  playerName: z.string().min(2, 'Player name must be at least 2 characters'),
  gamertag: z.string().min(2, 'Nickname must be at least 2 characters'),
  gameUID: z.string().min(5, 'UID is required'),
})

export const squadRegistrationSchema = z.object({
  tournamentId: z.string().min(1, 'Tournament ID is required'),
  teamName: z.string().min(2, 'Guild name must be at least 2 characters'),
  playerName: z.string().min(2, 'Captain name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'WhatsApp number is required'),
  gamertag: z.string().min(2, 'Captain nickname must be at least 2 characters'),
  gameUID: z.string().min(5, 'Captain UID is required'),
  paymentScreenshot: z.string().optional(),
  uidScreenshot: z.string().min(1, 'UID verification screenshot is required'),
  teamMembers: z
    .array(teamMemberSchema)
    .min(1, 'At least one team member is required')
    .max(5, 'Maximum 5 team members allowed'),
})

export type SquadRegistrationFormData = z.infer<typeof squadRegistrationSchema>
