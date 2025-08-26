# ServiceNow Change Request Ticket Issues

## 1. ServiceNow Ticket Not Created
- The ALKS CLI command with `--ciid`, `--activity-type`, and `--description` should trigger a change request via ChangeAPI/ChangeMinder, resulting in a ServiceNow ticket.
- No ticket appears to be created, which may be due to:
  - Broken or missing integration between ALKS CLI and ChangeAPI/ChangeMinder.
  - Parameters (`ciid`, `activity-type`, `description`) not passed or handled correctly in backend services.
  - Configuration issues in ALKS, ChangeMinder, or ChangeAPI repositories.
  - Silent failure in ticket creation (no error shown, but ticket not created).

## 2. No Link to ServiceNow Ticket Provided
- The CLI should display a link or ticket number if the change request is created.
- If no link is shown:
  - The CLI may not receive the ticket number or URL from the backend.
  - The code responsible for outputting the link may be missing or not triggered.
  - ServiceNow integration may not be returning the expected data.

## Recommendations
- Check the backend code and logs for ticket creation and response handling.
- Ensure the CLI is configured to display the ticket number and link when available.
- Validate the integration between ALKS CLI, ChangeAPI, ChangeMinder, and ServiceNow.
- Add error handling and user feedback for failed ticket creation.
