import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  cancelVelaLogin,
  fetchVelaLoginStatus,
  startVelaLogin,
  velaLogout,
  type VelaLoginStatus,
} from '../providers/daemon';
import { openExternalUrl } from '../providers/registry';
import { useAnalytics } from '../analytics/provider';
import {
  amrHandoffDeviceId,
  attributedAmrUrl,
  recordAmrEntry,
  type TrackingAmrEntrySource,
} from '../analytics/amr-attribution';
import { getResolvedDeviceId } from '../analytics/client';
import {
  beginAmrAuthTracking,
  confirmAmrAuthTracking,
  observeAmrAuthTracking,
  reconcileAmrAuthAttemptId,
  resolveAmrAuthTracking,
} from '../analytics/amr-auth';
import { useI18n } from '../i18n';
import {
  AMR_LOGIN_STATUS_EVENT,
  AMR_LOGIN_POLL_INTERVAL_MS,
  AMR_LOGIN_STARTUP_SETTLE_MS,
  amrLoginPollOutcome,
  amrLoginStatusEventReason,
  isAmrSessionAuthenticated,
  notifyAmrLoginStatusChanged,
} from './amrLoginPolling';
import {
  notifyTeamProjectsChanged,
  notifyWorkspaceBillingRefresh,
  notifyWorkspaceContextRefresh,
} from '../collab/useWorkspaceContext';
import { Icon, type IconName } from './Icon';
import { SignOutConfirmDialog } from './SignOutConfirmDialog';
import { amrConsoleUrlForProfile, amrProfileBadgeLabel } from '../runtime/amr-guidance';

interface AmrLoginPillProps {
  className?: string;
  hideSignedOutStatus?: boolean;
  hideSignedInStatus?: boolean;
  initialStatus?: VelaLoginStatus | null;
  skipInitialRefresh?: boolean;
  signInLabel?: string;
  signInIcon?: IconName;
  amrEntrySourceDetail?: TrackingAmrEntrySource;
  metricsConsent?: boolean;
  installationId?: string | null;
  showActivationDetails?: boolean;
  revealPendingCancelAction?: boolean;
  showConsoleAction?: boolean;
  iconOnlySignOut?: boolean;
  onSignInStarted?: () => void;
  onStatusChange?: (status: VelaLoginStatus | null) => void;
  onSignedOut?: () => void | Promise<void>;
}

const AMR_LOGIN_REUSE_ENTRY_SOURCES: readonly TrackingAmrEntrySource[] = [
  'settings_amr_agent_card',
  'chat_error_authorize_retry',
  'generation_preview_authorize_retry',
];

export type AmrAccountControlStatus =
  | 'signed-out'
  | 'signing-in'
  | 'canceled'
  | 'signed-in'
  | 'error';

export interface AmrAccountControlProps {
  status: AmrAccountControlStatus;
  className?: string;
  compact?: boolean;
  email?: string;
  errorMessage?: string | null;
  profile?: string;
  showProfileBadge?: boolean;
  showSignInAction?: boolean;
  hideSignedOutStatus?: boolean;
  hideSignedInStatus?: boolean;
  signInLabel?: string;
  signInIcon?: IconName;
  showConsoleAction?: boolean;
  consoleUrl?: string;
  iconOnlySignOut?: boolean;
  showCancelSignInAction?: boolean;
  // Activation URL surfaced while signing in, so the user can re-open the
  // sign-in page when the browser did not auto-open. The URL already carries
  // the device code (see parseVelaLoginActivation in the daemon's vela.ts), so
  // no separate code needs to be shown.
  activationUrl?: string;
  browserOpenFailed?: boolean;
  onSignIn?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSignOut?: (event: MouseEvent<HTMLButtonElement>) => void;
  onCancelSignIn?: (event: MouseEvent<HTMLButtonElement>) => void;
  onConsoleClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  signInDisabled?: boolean;
  signOutDisabled?: boolean;
  cancelSignInDisabled?: boolean;
}

const AMR_CANCELED_RESET_MS = 1500;

export function closeAmrActivationWindowBestEffort(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.opener == null) return false;
  try {
    window.close();
    return true;
  } catch {
    return false;
  }
}

function classNames(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}

export function AmrAccountControl({
  status,
  className,
  compact = false,
  email = '',
  errorMessage,
  profile,
  showProfileBadge = false,
  showSignInAction = true,
  hideSignedOutStatus = false,
  hideSignedInStatus = false,
  signInLabel,
  signInIcon,
  showConsoleAction = false,
  consoleUrl,
  iconOnlySignOut = false,
  showCancelSignInAction = false,
  activationUrl,
  browserOpenFailed = false,
  onSignIn,
  onSignOut,
  onCancelSignIn,
  onConsoleClick,
  signInDisabled = false,
  signOutDisabled = false,
  cancelSignInDisabled = false,
}: AmrAccountControlProps) {
  return null; // fork: cloud sign-in UI removed
}

// AMR-specific login pill that lives as a sibling inside the installed
// agent card. The pill polls `/api/integrations/vela/status` after a Sign-in
// click until the daemon reports loggedIn=true.
export function AmrLoginPill({
  className,
  hideSignedOutStatus = false,
  hideSignedInStatus = false,
  initialStatus = null,
  skipInitialRefresh = false,
  signInLabel,
  signInIcon,
  amrEntrySourceDetail,
  metricsConsent = false,
  installationId,
  showActivationDetails = false,
  revealPendingCancelAction = false,
  showConsoleAction = false,
  iconOnlySignOut = false,
  onSignInStarted,
  onStatusChange,
  onSignedOut,
}: AmrLoginPillProps) {
  return null; // fork: cloud sign-in UI removed
}
