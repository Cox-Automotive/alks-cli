# US1626026: Update CLI to use new ALKS JS and new params

**Status:** In-Progress
**Plan Estimate:** 3
**Last Updated:** 2025-08-22

## Description

As a CRW engineer, I need to update the ALKS CLI to extend the `alks session open` and `alks session console` commands to support ChangeAPI integration and ChangeMinder logic. This includes:

- Allowing users to create a new ChangeAPI ticket with:
  - `alks sessions open -a <account> -r <role> --ciid <ciid> --activity-type <type> --description "<desc>"`
  - All three switches (`--ciid`, `--activity-type`, `--description`) are required if any one is used.
- Allowing users to provide a pre-generated change request ticket number:
  - `alks sessions open -a <account> -r <role> --chg-number <number>`
- Allowing users to open an account in the AWS console while creating a change request ticket:
  - `alks sessions console -a <account> -r <role> --ciid <ciid> --activity-type <type> --description "<desc>"`

This brings ChangeMinder logic into alks-cli: when assuming roles that require a change request, users must either create a new request or provide an existing request ID.

## Acceptance Criteria

- Update ALKS JS to send new headers for the ALKS clients
- Extend `alks session open` and `alks session console` commands to support ChangeAPI integration as described above
- Require all three switches (`--ciid`, `--activity-type`, `--description`) if any one is used
- Allow use of `--chg-number` for pre-generated change requests
- Ensure ChangeMinder logic is enforced in CLI for roles requiring change requests

## Implementation Notes

*No additional notes provided.*
