/**
 * CRISIS GUARDRAIL — DO NOT WEAKEN. (issue #25)
 *
 * These invariants must hold regardless of ANY future monetization work
 * (issues #23–#30). See AGENTS.md → "Crisis UX is sacred".
 *
 *   A. The 119 SEJIWA / Kemenkes RI hotline is always reachable.
 *   B. Crisis detection is never gated and never delayed.
 *   C. Crisis UI is never auto-dismissed — only explicit user action closes it.
 *   D. An active takeover locks the ordinary chat path.
 *
 * The crisis path is also anonymous by design: this whole file drives the flow
 * with NO auth/login setup (there is no auth surface in the app yet). When
 * optional accounts land (#29), add an explicit "reachable while logged out"
 * assertion here.
 *
 * This file is intentionally self-contained and partly overlaps other crisis
 * tests. That redundancy is the point — the guardrail must survive even if the
 * other tests are deleted. Do not "DRY it up" by removing assertions.
 */
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CrisisTakeover } from '@/components/chat/crisis-takeover'
import { CrisisBanner } from '@/components/chat/crisis-banner'
import { ChatExperience } from '@/components/chat/chat-experience'
import { DISCLAIMER_KEY } from '@/components/chat/disclaimer-screen'
import { detectCrisis } from '@/lib/chat/crisis-detection'
import { streamChat } from '@/lib/api/chat-client'

jest.mock('@/lib/api/chat-client', () => ({
  streamChat: jest.fn(),
}))

const mockedStreamChat = streamChat as jest.MockedFunction<typeof streamChat>

describe('Group A — 119 SEJIWA hotline is always reachable', () => {
  it('takeover exposes a tel:119 link naming SEJIWA', () => {
    render(<CrisisTakeover onResume={jest.fn()} />)

    const link = screen.getByRole('link', { name: /119.*SEJIWA/i })
    expect(link).toHaveAttribute('href', 'tel:119')
  })

  it('banner exposes a tel:119 link to 119 SEJIWA', () => {
    render(<CrisisBanner onContinue={jest.fn()} />)

    const link = screen.getByRole('link', { name: /Hubungi 119 SEJIWA/i })
    expect(link).toHaveAttribute('href', 'tel:119')
  })
})
