/**
 * Host permissions for Focus, granted one domain at a time.
 *
 * A declarativeNetRequest rule whose action is `redirect` only fires if the
 * extension holds host permission for the request URL. Rather than asking for
 * `*://*!/!*` up front — which makes Chrome warn "read and change all your data
 * on all websites" at install and pushes the listing into manual review — Focus
 * declares `optional_host_permissions` and asks for exactly the domain the user
 * just typed, at the moment they type it.
 *
 * Domains the user declines still get blocked; they fall back to a plain `block`
 * rule and Chrome's own error page instead of the branded blocked page.
 */

/** `youtube.com` → `*://*.youtube.com/*`, which also matches the bare domain. */
export function originPatternFor(domain: string): string {
  return `*://*.${domain}/*`;
}

export async function hasHostPermission(domain: string): Promise<boolean> {
  return chrome.permissions.contains({ origins: [originPatternFor(domain)] });
}

/**
 * Must be called synchronously from a user gesture — awaiting anything first
 * detaches the gesture and Chrome rejects the prompt.
 */
export async function requestHostPermission(domain: string): Promise<boolean> {
  return chrome.permissions.request({ origins: [originPatternFor(domain)] });
}

export async function removeHostPermission(domain: string): Promise<void> {
  await chrome.permissions.remove({ origins: [originPatternFor(domain)] });
}

/** Split a block list into the domains we can redirect and the ones we can only block. */
export async function partitionByPermission(domains: string[]): Promise<{
  redirectable: string[];
  blockOnly: string[];
}> {
  const redirectable: string[] = [];
  const blockOnly: string[] = [];
  for (const domain of domains) {
    if (await hasHostPermission(domain)) redirectable.push(domain);
    else blockOnly.push(domain);
  }
  return { redirectable, blockOnly };
}
