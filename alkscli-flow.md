# ALKS CLI Change Request Flow

This document describes how the ALKS CLI tool interacts with the following repositories when generating a change request:

- ALKS.js
- ALKS
- ChangeMinder
- ChangeAPI

---

## 1. User Requests Admin Keys via ALKS CLI

- The user runs a command in the ALKS CLI to request Admin Keys.
- The CLI validates user credentials and command parameters.

## 2. ALKS CLI Uses ALKS.js

- ALKS CLI leverages the ALKS.js library to communicate with the ALKS backend API.
- ALKS.js manages authentication, API requests, and response handling.
- The Admin Key request is sent to the ALKS backend using ALKS.js.

## 3. ALKS Backend (ALKS)

- The ALKS backend receives the request from ALKS CLI (via ALKS.js).
- It checks account policies, user roles, and key creation rules.
- If Admin Key creation requires a change request, ALKS responds with a prompt or error indicating that a change request is needed.

## 4. CLI Prompts for Change Request

- The CLI detects the response from ALKS and prompts the user to create a change request.
- The CLI collects details for the change request (reason, justification, etc.) from the user interactively or via command flags.

## 5. ChangeMinder Integration

- ALKS CLI sends the change request details to ChangeMinder, either directly or via an API call.
- ChangeMinder tracks, manages, and audits change requests related to Admin Key creation.
- ChangeMinder may notify approvers or trigger workflows for review and approval.

## 6. ChangeAPI Interaction

- ALKS CLI or ChangeMinder may use ChangeAPI to programmatically create, update, or query change requests.
- ChangeAPI provides endpoints for change request lifecycle management (creation, status, approval, etc.).
- ChangeAPI ensures integration with other systems and maintains audit trails.

## 7. Completion & Notification

- Once the change request is approved (via ChangeMinder/ChangeAPI), ALKS CLI is notified (polling or callback).
- ALKS CLI re-initiates the Admin Key creation process using ALKS.js and ALKS backend.
- Upon success, the CLI outputs the Admin Keys to the user.

---

## Summary Diagram

```text
User → ALKS CLI → ALKS.js → ALKS
           ↓
      ChangeMinder → ChangeAPI
           ↓
        Approval
           ↓
      ALKS CLI → ALKS.js → ALKS
           ↓
         Admin Keys
```

---

This flow ensures secure, auditable, and policy-compliant Admin Key creation using the CLI and integrated systems.
