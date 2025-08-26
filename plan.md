# Implementation Plan for ALKS CLI Enhancements

This plan outlines the steps to update the `alks-cli` to support new input parameters for Change Request (CR) validation and integration with ALKS Core parameters, as described in `story.md` and within the context of the ALKS ecosystem (`ecosystem.md`).

---

## 1. Requirements Overview

- Extend `alks session open` and `alks session console` commands to support ChangeAPI integration:
	- Users can create a new ChangeAPI ticket with:
		- `alks sessions open -a <account> -r <role> --ciid <ciid> --activity-type <type> --description "<desc>"`
		- All three switches (`--ciid`, `--activity-type`, `--description`) are required if any one is used.
	- Users can provide a pre-generated change request ticket number:
		- `alks sessions open -a <account> -r <role> --chg-number <number>`
	- Users can open an account in the AWS console while creating a change request ticket:
		- `alks sessions console -a <account> -r <role> --ciid <ciid> --activity-type <type> --description "<desc>"`
- Enforce ChangeMinder logic: when assuming roles that require a change request, users must either create a new request or provide an existing request ID.
- Integrate with new ALKS Core parameters.
- Ensure compatibility with the latest `alks.js` SDK and ALKS backend.
- Maintain audit/compliance integration with ChangeMinder.

## 2. Dependencies

- `alks.js` (local): Ensure the SDK supports new ALKS Core parameters and CR validation endpoints.
- `ALKS` (backend): API endpoints for new parameters and CR validation must be available.
- `ALKSWeb`: Reference for UI/UX and parameter handling.
- `ChangeMinder`: Confirm audit events are generated for new CLI actions.

## 3. Implementation Steps

### a. Discovery & Design

- Review ALKS backend and `alks.js` for new parameter support and ChangeAPI integration.
- Review `ALKSWeb` for parameter usage, validation logic, and ChangeMinder enforcement.
- Confirm audit requirements and ChangeMinder logic with ChangeMinder team.

### b. CLI Enhancements

- Extend `alks session open` and `alks session console` commands to support new switches and logic:
	- Implement required logic for `--ciid`, `--activity-type`, and `--description` (all required if any used)
	- Implement support for `--chg-number` for pre-generated change requests
	- Enforce ChangeMinder requirements for roles that require change requests
- Add input validation and helpful error messages
- Update help documentation and usage examples

### c. SDK Integration

- Upgrade or patch `alks.js` dependency as needed.
- Refactor CLI code to use new/updated SDK methods for CR validation and parameter passing.

### d. Backend/API Integration

- Test CLI against ALKS backend for new parameter flows.
- Handle API errors and edge cases gracefully.

### e. Auditing & Compliance

- Ensure all new CLI actions are logged and auditable by ChangeMinder.
- Add or update audit event generation as needed.

### f. Testing

- Add/expand unit and integration tests for new CLI features.
- Perform end-to-end tests with ALKS backend and ChangeMinder.

### g. Documentation

- Update CLI documentation to describe new parameters and flows.
- Communicate changes to users and stakeholders.

## 4. Timeline & Milestones

- **Week 1:** Discovery, design, and dependency upgrades.
- **Week 2:** CLI and SDK implementation.
- **Week 3:** Backend integration, auditing, and compliance.
- **Week 4:** Testing, documentation, and release.

## 5. Risks & Mitigations

- **Backend/API changes delayed:** Coordinate closely with ALKS backend team.
- **SDK/API incompatibility:** Early integration testing and communication with SDK maintainers.
- **Audit gaps:** Early review with ChangeMinder team.

---

## 6. Success Criteria

- CLI supports new/existing CR parameters and workload/component ID for session commands
- All changes are auditable and compliant, with ChangeMinder logic enforced
- Documentation and tests are up to date
- No regressions in existing CLI functionality
