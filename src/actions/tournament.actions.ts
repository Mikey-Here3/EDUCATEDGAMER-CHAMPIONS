'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { tournamentSchema } from '@/lib/validators'
import type { ActionResponse, TournamentWithCount } from '@/types'
import type { Tournament } from '@/generated/prisma'

// ─── Public Actions ──────────────────────────────────────────────────────────

export async function getTournaments(): Promise<ActionResponse<TournamentWithCount[]>> {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    })

    return {
      success: true,
      message: 'Tournaments fetched successfully',
      data: tournaments,
    }
  } catch (error) {
    console.error('[getTournaments]', error)
    return {
      success: false,
      message: 'Failed to fetch tournaments',
    }
  }
}

export async function getTournamentBySlug(
  slug: string
): Promise<ActionResponse<TournamentWithCount>> {
  try {
    if (!slug) {
      return { success: false, message: 'Slug is required' }
    }

    const tournament = await prisma.tournament.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    })

    if (!tournament) {
      return { success: false, message: 'Tournament not found' }
    }

    return {
      success: true,
      message: 'Tournament fetched successfully',
      data: tournament,
    }
  } catch (error) {
    console.error('[getTournamentBySlug]', error)
    return {
      success: false,
      message: 'Failed to fetch tournament',
    }
  }
}

// ─── Admin Actions ───────────────────────────────────────────────────────────

export async function createTournament(
  data: unknown
): Promise<ActionResponse<Tournament>> {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized: Admin access required' }
    }

    const parsed = tournamentSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path.join('.')
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(issue.message)
      }
      return {
        success: false,
        message: 'Validation failed',
        errors: fieldErrors,
      }
    }

    // Check for duplicate slug
    const existing = await prisma.tournament.findUnique({
      where: { slug: parsed.data.slug },
    })
    if (existing) {
      return { success: false, message: 'A tournament with this slug already exists' }
    }

    const tournament = await prisma.tournament.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        game: parsed.data.game,
        bannerImage: parsed.data.bannerImage || null,
        description: parsed.data.description || null,
        type: parsed.data.type,
        status: parsed.data.status,
        maxSlots: parsed.data.maxSlots,
        entryFee: parsed.data.entryFee,
        prizePool: parsed.data.prizePool || null,
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate || null,
        rules: parsed.data.rules || null,
        discordLink: parsed.data.discordLink || null,
        whatsappLink: parsed.data.whatsappLink || null,
        youtubeLink: parsed.data.youtubeLink || null,
      },
    })

    return {
      success: true,
      message: 'Tournament created successfully',
      data: tournament,
    }
  } catch (error) {
    console.error('[createTournament]', error)
    return {
      success: false,
      message: 'Failed to create tournament',
    }
  }
}

export async function updateTournament(
  id: string,
  data: unknown
): Promise<ActionResponse<Tournament>> {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized: Admin access required' }
    }

    if (!id) {
      return { success: false, message: 'Tournament ID is required' }
    }

    const parsed = tournamentSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path.join('.')
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(issue.message)
      }
      return {
        success: false,
        message: 'Validation failed',
        errors: fieldErrors,
      }
    }

    // Check slug uniqueness (excluding current tournament)
    const existingSlug = await prisma.tournament.findFirst({
      where: {
        slug: parsed.data.slug,
        NOT: { id },
      },
    })
    if (existingSlug) {
      return { success: false, message: 'A tournament with this slug already exists' }
    }

    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        game: parsed.data.game,
        bannerImage: parsed.data.bannerImage || null,
        description: parsed.data.description || null,
        type: parsed.data.type,
        status: parsed.data.status,
        maxSlots: parsed.data.maxSlots,
        entryFee: parsed.data.entryFee,
        prizePool: parsed.data.prizePool || null,
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate || null,
        rules: parsed.data.rules || null,
        discordLink: parsed.data.discordLink || null,
        whatsappLink: parsed.data.whatsappLink || null,
        youtubeLink: parsed.data.youtubeLink || null,
      },
    })

    return {
      success: true,
      message: 'Tournament updated successfully',
      data: tournament,
    }
  } catch (error) {
    console.error('[updateTournament]', error)
    return {
      success: false,
      message: 'Failed to update tournament',
    }
  }
}

export async function deleteTournament(
  id: string
): Promise<ActionResponse> {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized: Admin access required' }
    }

    if (!id) {
      return { success: false, message: 'Tournament ID is required' }
    }

    await prisma.tournament.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'Tournament deleted successfully',
    }
  } catch (error) {
    console.error('[deleteTournament]', error)
    return {
      success: false,
      message: 'Failed to delete tournament',
    }
  }
}
