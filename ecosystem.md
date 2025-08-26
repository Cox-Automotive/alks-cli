# ALKS Ecosystem Overview

This document describes the relationship between the `alks-cli` repository and the four related repositories in the ALKS ecosystem:

## 1. alks-cli (this repository)

- **Purpose:** Provides a command-line interface (CLI) for interacting with ALKS services, allowing users to manage AWS keys, roles, and credentials from the terminal.
- **Dependencies:**
  - Uses the `alks.js` library for core API interactions with the ALKS backend.
  - Integrates with ALKSWeb and ALKS backend for user authentication, key management, and other operations.

## 2. alks.js (local)

- **Purpose:** JavaScript/TypeScript SDK for interacting with the ALKS API.
- **Relationship:**
  - Acts as the primary client library used by `alks-cli` to communicate with ALKS services.
  - Encapsulates API calls, authentication, and error handling, providing a reusable interface for both CLI and other Node.js applications.

## 3. ALKS (ETS-CloudAutomation/ALKS)

- **Purpose:** The core ALKS backend service, typically implemented in Java.
- **Relationship:**
  - Provides the main API endpoints consumed by both `alks.js` and, by extension, `alks-cli`.
  - Handles business logic, security, and integration with AWS and other internal systems.

## 4. ALKSWeb (ETS-CloudAutomation/ALKSWeb)

- **Purpose:** The web-based user interface for ALKS.
- **Relationship:**
  - Offers a graphical interface for the same operations available in `alks-cli`.
  - Shares backend services with `alks-cli` (via the ALKS API).
  - May use `alks.js` for some client-side API interactions.

## 5. ChangeMinder (ETS-CloudAutomation/ChangeMinder)

- **Purpose:** Change management and auditing tool within the ALKS ecosystem.
- **Relationship:**
  - Integrates with ALKS to track, audit, and manage changes made via both CLI and Web interfaces.
  - Ensures compliance and provides reporting for changes to AWS accounts and credentials.

---

## Summary

- `alks-cli` and `ALKSWeb` are user-facing tools for interacting with ALKS.
- Both rely on the `ALKS` backend for core functionality.
- `alks.js` is the shared SDK used by the CLI (and possibly the Web UI) to interact with the backend.
- `ChangeMinder` provides oversight and auditing for changes made through the ecosystem.
