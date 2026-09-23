import { useEffect, useRef, useState } from 'react';
import { VisuallyHidden } from '@open-design/components';
import { Icon } from './Icon';
import { useI18n } from '../i18n';
import {
  cancelVelaLogin,
  fetchVelaLoginStatus,
  startVelaLogin,
  type VelaLoginStatus,
} from '../providers/daemon';
import {
  AMR_LOGIN_POLL_INTERVAL_MS,
  amrLoginPollOutcome,
  isAmrSessionAuthenticated,
  notifyAmrLoginStatusChanged,
} from './amrLoginPolling';
import {
  notifyTeamProjectsChanged,
  notifyWorkspaceBillingRefresh,
  notifyWorkspaceContextRefresh,
} from '../collab/useWorkspaceContext';

const DISMISSED_KEY = 'od.entry.cloudSignInTip.dismissed';

/**
 * recvqbkcLqIFH7: a user who ever closed this card (back when it had a close
 * button) had that dismissal persist in localStorage FOREVER — including
 * through a later real sign-in and sign-out. Since this card is the rail's
 * only visible sign-in entry point once `context` goes back to null, that
 * stale flag silently deleted the user's only way back in: the rail footer
 * rendered empty, with no error and no other affordance.
 *
 * The card no longer has a close button (nothing sets this key anymore), so
 * this is now legacy cleanup for accounts that dismissed it before that
 * change shipped — EntryNavRail still calls it on every real sign-out so a
 * pre-existing stale flag can't resurface the bug.
 */
export function resetCloudSignInTipDismissal(): void {
  try {
    window.localStorage.removeItem(DISMISSED_KEY);
  } catch {
    // best-effort persistence
  }
}

type TipState = 'idle' | 'signing' | 'error';

/**
 * recvqgpXSYFNTq: the rail's bottom-left callout slot goes visibly blank
 * between "sign-in just succeeded" and "the workspace context resolved" —
 * `CloudSignInTip` unmounts the instant `finishSignedIn()` fires (see
 * `useWorkspaceContext`'s `markLoading`), but the account row above only
 * appears once `GET /api/workspace/context` answers, which is a real vela
 * round trip and not instantaneous. `EntryShell` renders THIS in the exact
 * same footer slot for that one window (`!workspaceContext && workspaceLoading`)
 * so the callout hands off to a loading state instead of disappearing into
 * nothing. Deliberately inert (no button semantics, no dismiss, no click
 * handler) — this is a status readout, not another affordance to interact
 * with while the real re-read is already in flight.
 *
 * Shaped as a skeleton of the account row it is standing in for
 * (`.entry-nav-rail__account-trigger`'s avatar + name, see entry-layout.css)
 * rather than as its own callout card — product feedback (2026-07-24) was
 * that the previous spinner+"Loading…" card read as a distinct, separate
 * notification, and visibly jumped in size/position once the real avatar
 * row landed. Matching the real row's footprint keeps the loading→loaded
 * swap reading as one continuous element filling in, not two different
 * elements trading places. The "Loading" text survives for assistive tech
 * via `VisuallyHidden` — sighted users read the shimmer itself as the status.
 */
export function RailAccountSyncTip() {
  const { t } = useI18n();
  return (
    <div
      className="entry-rail-account-skeleton"
      role="status"
      aria-live="polite"
      data-testid="entry-rail-account-sync-tip"
    >
      <span className="entry-rail-account-skeleton__avatar" aria-hidden />
      <span className="entry-rail-account-skeleton__name" aria-hidden />
      <VisuallyHidden>
        {t('entry.cloudCalloutTitle')} {t('common.loading')}
      </VisuallyHidden>
    </div>
  );
}

export function RailAccountRecoveryTip() {
  const { t } = useI18n();
  return (
    <div
      className="entry-rail-account-recovery"
      role="status"
      aria-live="polite"
      data-testid="entry-rail-account-recovery-tip"
    >
      <span className="entry-rail-account-recovery__spinner" aria-hidden />
      <span className="entry-rail-account-recovery__text">
        {t('entry.cloudRecovering')}
      </span>
    </div>
  );
}

/**
 * The signed-out rail's bottom callout (#5517 "OpenDesign Cloud 版" card).
 * The demo's card jumps to a mock sign-in; the product card IS the sign-in:
 * clicking it kicks off the same vela device-auth flow the onboarding/AMR
 * pill uses — pending state with a spinner + cancel + the manual activation
 * link fallback — and on success every workspace surface is nudged to
 * re-read, which swaps the rail to the signed-in form (unmounting the card).
 */
export function CloudSignInTip() {
  return null; // fork: cloud sign-in UI removed
}
