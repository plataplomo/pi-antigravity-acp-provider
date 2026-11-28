import { describe, expect, it } from "vitest";

import { credentialIdentity, isGoogleLoginMarker, newGoogleLoginMarker } from "../src/auth.js";
import { MANAGED_AUTH_MARKER } from "../src/constants.js";

describe("Google login marker", () => {
	it("accepts the per-login marker and the bare legacy marker, never an API key", () => {
		expect(isGoogleLoginMarker(newGoogleLoginMarker())).toBe(true);
		expect(isGoogleLoginMarker(MANAGED_AUTH_MARKER)).toBe(true);
		expect(isGoogleLoginMarker("AIzaSyExampleKey")).toBe(false);
		expect(isGoogleLoginMarker(`${MANAGED_AUTH_MARKER}x`)).toBe(false);
	});

	it("keeps a legacy marker as a non-secret Google identity instead of hashing it as an API key", () => {
		expect(credentialIdentity(MANAGED_AUTH_MARKER)).toBe(MANAGED_AUTH_MARKER);
	});
});
