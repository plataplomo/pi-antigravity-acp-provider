import { createHash, randomUUID } from "node:crypto";

import { inspectAntigravityAuth } from "./acp/antigravity.js";
import { providerAcpDirectory } from "./acp/credential-storage.js";
import { MANAGED_AUTH_MARKER } from "./constants.js";

export function newGoogleLoginMarker(): string {
	return `${MANAGED_AUTH_MARKER}:${randomUUID()}`;
}

// Fork (arco): also accept the bare pre-#112 marker. Long-lived Pi processes that still run the old
// provider can write it back into auth.json; without this it would be sent to the server as an API key.
export function isGoogleLoginMarker(value: string): boolean {
	return value === MANAGED_AUTH_MARKER || value.startsWith(`${MANAGED_AUTH_MARKER}:`);
}

export function hasSavedGoogleLogin(): boolean {
	return inspectAntigravityAuth(providerAcpDirectory(), {}).status === "oauth-refreshable";
}

export function credentialIdentity(apiKey: string | undefined): string {
	if (!apiKey) return "ambient";
	if (isGoogleLoginMarker(apiKey)) return apiKey;
	return `api-key:${createHash("sha256").update(apiKey).digest("hex")}`;
}
