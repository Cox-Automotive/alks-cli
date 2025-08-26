# ticket.md

## Change Request Ticket Creation & Validation Logic for alks-cli

### Scope

All code changes for this story are implemented in the `alks-cli` repository.

### CLI Flow

- **Account & Role Selection:**
  - Users select an AWS account and role using CLI options or prompts.

- **Change Request Exemption:**
  - The CLI checks if the selected role is exempt from requiring a change request (mirroring ALKSWeb logic).
  - If exempt, keys are created directly.
  - If not exempt, further validation is required.

- **Feature Flag/Config:**
  - The CLI supports a config/feature flag to determine if change requests are required for the selected account/role.

- **Flag Validation:**
  - The CLI validates flags (`--ciid`, `--activity-type`, `--description`, `--chg-number`) for change request creation.
  - If required flags are missing, the CLI prompts the user or exits with an error.

- **Change Request Flow:**
  - If a change request is required, the CLI collects necessary details and passes them to ALKS.js/ALKS backend for processing.

- **Key Creation:**
  - If all validations pass (exempt, non-prod, or feature flag disabled), keys are created.
  - If a change request is required, the CLI passes the details to the backend for validation and approval.

- **Error Handling:**
  - The CLI handles backend validation errors and provides user feedback.

### Consistency

This logic ensures that change request ticket creation and validation in `alks-cli` is consistent with ALKSWeb and supports ChangeMinder audit requirements.
