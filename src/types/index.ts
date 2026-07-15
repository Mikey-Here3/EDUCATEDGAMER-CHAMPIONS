import type {
  Tournament,
  Registration,
  TeamMember,
  User,
} from '@/generated/prisma'

// ─── Tournament Types ────────────────────────────────────────────────────────

export type TournamentWithCount = Tournament & {
  _count: {
    registrations: number
  }
}

// ─── Registration Types ──────────────────────────────────────────────────────

export type RegistrationWithTournament = Registration & {
  tournament: Tournament
}

export type RegistrationWithMembers = Registration & {
  teamMembers: TeamMember[]
}

export type RegistrationFull = Registration & {
  tournament: Tournament
  teamMembers: TeamMember[]
  user: User | null
}

// ─── Session / Auth Types ────────────────────────────────────────────────────

export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: 'USER' | 'ADMIN'
}

// ─── Action Response Types ───────────────────────────────────────────────────

export type ActionResponse<T = undefined> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}
