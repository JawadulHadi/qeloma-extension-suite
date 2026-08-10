import { FocusState, storageGet, storageSet } from '@qeloma/shared';
import { partitionByPermission } from '../lib/host-permissions';

const STORAGE_KEY = 'focus_state';
const TICK_ALARM = 'focus-tick';
const SESSION_END_ALARM = 'focus-session-end';

const DEFAULT_STATE: FocusState = {
  blockedDomains: [],
  strictMode: true,
  activeSession: null,
  history: [],
};

async function getState(): Promise<FocusState> {
  return storageGet<FocusState>(STORAGE_KEY, DEFAULT_STATE);
}

function conditionFor(domain: string): chrome.declarativeNetRequest.RuleCondition {
  return {
    urlFilter: `||${domain}^`,
    resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
  };
}

async function syncBlockingRules(state: FocusState): Promise<void> {
  const shouldBlock = state.strictMode || state.activeSession !== null;
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map((rule) => rule.id);

  let addRules: chrome.declarativeNetRequest.Rule[] = [];

  if (shouldBlock) {
    // A redirect rule is silently ignored without host permission for the target
    // site, so only domains the user has granted get the branded blocked page.
    // The rest still get blocked — just with Chrome's own error page.
    const { redirectable, blockOnly } = await partitionByPermission(state.blockedDomains);
    let nextId = 1;

    addRules = [
      ...redirectable.map((domain) => ({
        id: nextId++,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
          redirect: { extensionPath: `/blocked.html?domain=${encodeURIComponent(domain)}` },
        },
        condition: conditionFor(domain),
      })),
      ...blockOnly.map((domain) => ({
        id: nextId++,
        priority: 1,
        action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
        condition: conditionFor(domain),
      })),
    ];
  }

  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
}

async function updateBadge(state: FocusState): Promise<void> {
  if (!state.activeSession) {
    await chrome.action.setBadgeText({ text: '' });
    return;
  }
  const endsAt = state.activeSession.startedAt + state.activeSession.plannedMinutes * 60_000;
  const remainingMinutes = Math.max(0, Math.ceil((endsAt - Date.now()) / 60_000));
  await chrome.action.setBadgeText({ text: String(remainingMinutes) });
  await chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
}

async function endActiveSessionIfDue(): Promise<void> {
  const state = await getState();
  if (!state.activeSession) return;
  const endsAt = state.activeSession.startedAt + state.activeSession.plannedMinutes * 60_000;
  if (Date.now() < endsAt) return;

  const finished = { ...state.activeSession, endedAt: Date.now(), completed: true };
  const next: FocusState = {
    ...state,
    activeSession: null,
    history: [finished, ...state.history].slice(0, 50),
  };
  await storageSet(STORAGE_KEY, next);
  await chrome.alarms.clear(TICK_ALARM);
  await chrome.alarms.clear(SESSION_END_ALARM);
  await syncBlockingRules(next);
  await updateBadge(next);
}

async function reactToStateChange(): Promise<void> {
  const state = await getState();
  await syncBlockingRules(state);
  await updateBadge(state);

  if (state.activeSession) {
    await chrome.alarms.create(TICK_ALARM, { periodInMinutes: 1 });
    const endsAt = state.activeSession.startedAt + state.activeSession.plannedMinutes * 60_000;
    await chrome.alarms.create(SESSION_END_ALARM, { when: endsAt });
  } else {
    await chrome.alarms.clear(TICK_ALARM);
    await chrome.alarms.clear(SESSION_END_ALARM);
  }
}

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(reactToStateChange);
  chrome.runtime.onStartup.addListener(reactToStateChange);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && STORAGE_KEY in changes) {
      reactToStateChange();
    }
  });

  // Granting or revoking a domain flips it between the branded blocked page and
  // a plain block, so the rule set has to be rebuilt.
  chrome.permissions.onAdded.addListener(reactToStateChange);
  chrome.permissions.onRemoved.addListener(reactToStateChange);

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === SESSION_END_ALARM) {
      await endActiveSessionIfDue();
    } else if (alarm.name === TICK_ALARM) {
      await endActiveSessionIfDue();
      const state = await getState();
      await updateBadge(state);
    }
  });

  reactToStateChange();
});
