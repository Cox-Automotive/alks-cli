# Implementation Details for ALKS CLI ChangeAPI Integration

This document describes how the requirements in `story.md` will be implemented in the `alks-cli` codebase.

---

## 1. Command Enhancements

### a. `alks session open`

- Update the command parser to accept new flags:
  - `--ciid <ciid>`
  - `--activity-type <type>`
  - `--description "<desc>"`
  - `--chg-number <number>`

- Validation logic:
  - If any of `--ciid`, `--activity-type`, or `--description` is provided, all three must be present.
  - If `--chg-number` is provided, the above three are not required.
  - Error messages for missing required flags.

- When all three switches are provided, call the ChangeAPI to create a new change request and use the returned ticket number in the session open flow.
- When `--chg-number` is provided, validate and use the existing change request in the session open flow.

### b. `alks session console`

- Add support for the same flags and validation logic as above.
- Integrate ChangeAPI ticket creation or use of existing ticket when opening the AWS console session.

## 2. ChangeAPI Integration

- Add or update code in the CLI to:
  - Call ChangeAPI endpoints for ticket creation.
  - Handle API responses, errors, and edge cases.
  - Store and pass the change request ticket number to ALKS backend as required.

## 3. ChangeMinder Logic Enforcement

- Identify roles/accounts that require a change request.
- Enforce that users must provide either a new or existing change request when assuming these roles.
- Add logic to block session open/console actions if requirements are not met.

## 4. SDK and Backend Updates

- Ensure the CLI uses the latest `alks.js` SDK with support for new parameters and change request flows.
- Update API calls to ALKS backend to include change request ticket numbers and any new required headers.

## 5. Auditing and Compliance

- Ensure all actions related to change requests are logged for auditing.
- Integrate with ChangeMinder for audit event generation as needed.

## 6. Testing

- Add unit tests for command parsing and validation logic.
- Add integration tests for ChangeAPI and ALKS backend flows.
- Add end-to-end tests for session open/console flows with change requests.

## 7. Documentation

- Update CLI help output and documentation to describe new flags and flows.
- Provide usage examples for both new and existing change request scenarios.

---

## Summary

This implementation will ensure that `alks-cli` enforces ChangeMinder requirements, integrates with ChangeAPI, and provides a clear, validated user experience for session management commands.
