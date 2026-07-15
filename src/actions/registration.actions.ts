'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { registrationSchema, squadRegistrationSchema } from '@/lib/validators'
import type { ActionResponse, RegistrationWithTournament, RegistrationWithMembers } from '@/types'
import type { Registration } from '@/generated/prisma'

// ─── Registration Types (internal) ──────────────────────────────────────────

type RegisterInput = {
  type: 'SOLO' | 'SQUAD'
  tournamentId: string
  teamName?: string
  playerName: string
  email: string
  phone?: string
  gamertag: string
  gameUID?: string
  paymentScreenshot?: string
  uidScreenshot?: string
  teamMembers?: {
    playerName: string;
    gamertag: string;
    gameUID?: string;
  }[]
}

// ─── Public Actions ──────────────────────────────────────────────────────────

export async function registerForTournament(
  data: RegisterInput
): Promise<ActionResponse<Registration>> {
  try {
    // Validate based on registration type
    if (data.type === 'SQUAD') {
      const parsed = squadRegistrationSchema.safeParse(data)
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
    } else {
      const parsed = registrationSchema.safeParse(data)
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
    }

    // Check tournament exists and has available slots
    const tournament = await prisma.tournament.findUnique({
      where: { id: data.tournamentId },
      include: {
        _count: { select: { registrations: true } },
      },
    })

    if (!tournament) {
      return { success: false, message: 'Tournament not found' }
    }

    if (tournament._count.registrations >= tournament.maxSlots) {
      return { success: false, message: 'Tournament is full. No slots available.' }
    }

    if (tournament.status === 'COMPLETED') {
      return { success: false, message: 'This tournament has already ended' }
    }

    // Check if user is authenticated (optional — guests can register)
    const session = await auth()
    const userId = session?.user?.id || null

    // Check for duplicate registration by email for this tournament
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        tournamentId: data.tournamentId,
        email: data.email,
        status: { not: 'CANCELLED' },
      },
    })

    if (existingRegistration) {
      return {
        success: false,
        message: 'You have already registered for this tournament with this email',
      }
    }

    // Create registration with team members in a transaction
    const registration = await prisma.$transaction(async (tx) => {
      const reg = await tx.registration.create({
        data: {
          tournamentId: data.tournamentId,
          userId,
          teamName: data.teamName || null,
          playerName: data.playerName,
          email: data.email,
          phone: data.phone || null,
          gamertag: data.gamertag,
          gameUID: data.gameUID || null,
          type: data.type,
          paymentScreenshot: data.paymentScreenshot || null,
          uidScreenshot: data.uidScreenshot || null,
        },
      })

      // Create team members for squad registrations
      if (data.type === 'SQUAD' && data.teamMembers && data.teamMembers.length > 0) {
        await tx.teamMember.createMany({
          data: data.teamMembers.map((member) => ({
            registrationId: reg.id,
            playerName: member.playerName,
            gamertag: member.gamertag,
            gameUID: member.gameUID || null,
          })),
        })
      }

      // Increment registered count on tournament
      await tx.tournament.update({
        where: { id: data.tournamentId },
        data: { registeredCount: { increment: 1 } },
      })

      return reg
    })

    return {
      success: true,
      message: 'Registration successful! You will receive a confirmation once payment is verified.',
      data: registration,
    }
  } catch (error) {
    console.error('[registerForTournament]', error)
    return {
      success: false,
      message: 'Failed to register for tournament',
    }
  }
}

// ─── Admin / Query Actions ───────────────────────────────────────────────────

export async function getRegistrations(
  tournamentId: string
): Promise<ActionResponse<RegistrationWithMembers[]>> {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized: Admin access required' }
    }

    if (!tournamentId) {
      return { success: false, message: 'Tournament ID is required' }
    }

    const registrations = await prisma.registration.findMany({
      where: { tournamentId },
      include: { teamMembers: true },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      message: 'Registrations fetched successfully',
      data: registrations,
    }
  } catch (error) {
    console.error('[getRegistrations]', error)
    return {
      success: false,
      message: 'Failed to fetch registrations',
    }
  }
}

export async function getMyRegistrations(
  userId: string
): Promise<ActionResponse<RegistrationWithTournament[]>> {
  try {
    if (!userId) {
      return { success: false, message: 'User ID is required' }
    }

    const session = await auth()
    if (!session?.user || session.user.id !== userId) {
      return { success: false, message: 'Unauthorized' }
    }

    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: { tournament: true },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      message: 'Registrations fetched successfully',
      data: registrations,
    }
  } catch (error) {
    console.error('[getMyRegistrations]', error)
    return {
      success: false,
      message: 'Failed to fetch your registrations',
    }
  }
}

export async function updateRegistrationStatus(
  id: string,
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
): Promise<ActionResponse<Registration>> {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized: Admin access required' }
    }

    if (!id || !status) {
      return { success: false, message: 'Registration ID and status are required' }
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const
    if (!validStatuses.includes(status)) {
      return { success: false, message: 'Invalid status' }
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: { status },
    })

    // If cancelled, decrement the registered count
    if (status === 'CANCELLED') {
      await prisma.tournament.update({
        where: { id: registration.tournamentId },
        data: { registeredCount: { decrement: 1 } },
      })
    }

    return {
      success: true,
      message: `Registration status updated to ${status}`,
      data: registration,
    }
  } catch (error) {
    console.error('[updateRegistrationStatus]', error)
    return {
      success: false,
      message: 'Failed to update registration status',
    }
  }
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
): Promise<ActionResponse<Registration>> {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized: Admin access required' }
    }

    if (!id || !paymentStatus) {
      return { success: false, message: 'Registration ID and payment status are required' }
    }

    const validStatuses = ['PENDING', 'VERIFIED', 'REJECTED'] as const
    if (!validStatuses.includes(paymentStatus)) {
      return { success: false, message: 'Invalid payment status' }
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: { paymentStatus },
    })

    // If payment is verified, auto-confirm the registration
    if (paymentStatus === 'VERIFIED') {
      await prisma.registration.update({
        where: { id },
        data: { status: 'CONFIRMED' },
      })
    }

    return {
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: registration,
    }
  } catch (error) {
    console.error('[updatePaymentStatus]', error)
    return {
      success: false,
      message: 'Failed to update payment status',
    }
  }
}
