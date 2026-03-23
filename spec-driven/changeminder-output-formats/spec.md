# Specification: Add ChangeMinder Change Number to All Output Formats

**Feature ID:** F281658
**Version:** 1.0
**Status:** Draft
**Last Updated:** 2026-03-23

---

## Overview

When users run `alks sessions open` with ChangeMinder flags (`--ciid`, `--activity-type`, `--description`), a change ticket is successfully created in ChangeMinder, but six output formats (`creds`, `docker`, `terraformarg`, `terraformenv`, `aws`, `idea`) silently discard the ticket number, leaving users with no way to reference it. This is problematic for scripted workflows (like DLT's DLQ replay) that need to capture the change ticket number.

**Core Principle:** If a user requests a ticket, we tell them the ticket number—regardless of output format.

### Current State

- **Working Formats** (already include `changeNumber`): `json`, `env`, `powershell`, `linux`, `fishshell`
- **Missing Formats** (silently discard `changeNumber`): `creds`, `docker`, `terraformarg`, `terraformenv`, `aws`, `idea`
- The change ticket is created successfully regardless of output format, but the ticket number is lost for the six missing formats
- Implementation files:
  - `src/lib/getKeyOutput.ts` - Main output formatting logic
  - `src/lib/updateCreds.ts` - AWS credentials file writing (for `creds` format)

### Business Context

This issue was reported by Santiago Sandoval (DLT team) and independently confirmed by Nick Gibson via #alks-support thread. Santiago's team relies on `-o creds` for scripted DLQ replay workflows and needs the change ticket number written to the credentials file for audit and tracking purposes. The same gap applies to all other formats used across Cox Automotive engineering teams.

---

## Goals

### Primary Goal
Ensure all output formats include `changeNumber` when ChangeMinder flags are provided and a ticket is successfully created.

### Secondary Goals
1. Provide consistent user experience across all output formats when ChangeMinder integration is used
2. Enable scripted workflows to capture and use the change ticket number for compliance and audit trails

---

## Users

### Primary Users
- **DLT Team (Santiago Sandoval)** - DevOps engineers running scripted DLQ replay workflows using `-o creds` format, need change ticket numbers for compliance tracking
- **Nick Gibson's Team** - Platform engineers requiring ChangeMinder integration for infrastructure changes
- **ALKS CLI Users (General)** - Any Cox Automotive engineer using ChangeMinder with non-JSON output formats for AWS credential management

---

## Functional Requirements

### FR-1: Output changeNumber in `creds` format
**Priority:** Must Have
**Assigned to Goal:** Primary Goal

When ChangeMinder flags (`--ciid`, `--activity-type`, `--description`) are provided and a change ticket is successfully created, include `changeNumber` in the AWS credentials file output.

**Implementation Areas:**
- `src/lib/getKeyOutput.ts` - Add changeNumber to creds output generation
- `src/lib/updateCreds.ts` - Write changeNumber to `.aws/credentials` file

**Acceptance Criteria:**
- **AC-1.1:** Given a user runs `alks sessions open --ciid 123 --activity-type "Deploy" --description "DLQ replay" -o creds`, When a ChangeMinder ticket is successfully created, Then the changeNumber is written to the `.aws/credentials` file as a comment or metadata field
- **AC-1.2:** Given a user runs `alks sessions open -o creds` without ChangeMinder flags, When credentials are generated, Then the output remains unchanged from current behavior (backward compatibility)

---

### FR-2: Output changeNumber in `docker` format
**Priority:** Must Have
**Assigned to Goal:** Primary Goal

When ChangeMinder flags are provided and a change ticket is successfully created, include `changeNumber` in Docker environment argument format.

**Implementation Areas:**
- `src/lib/getKeyOutput.ts` - Add changeNumber to docker output generation

**Acceptance Criteria:**
- **AC-2.1:** Given a user runs `alks sessions open --ciid 123 -o docker`, When a ChangeMinder ticket is successfully created, Then the changeNumber is included in Docker `-e` environment argument format (e.g., `-e ALKS_CHANGE_NUMBER=CHG123456`)
- **AC-2.2:** Given a user runs `alks sessions open -o docker` without ChangeMinder flags, When credentials are generated, Then the output remains unchanged from current behavior

---

### FR-3: Output changeNumber in `terraformarg` format
**Priority:** Must Have
**Assigned to Goal:** Primary Goal

When ChangeMinder flags are provided and a change ticket is successfully created, include `changeNumber` in Terraform argument format with `ALKS` prefix.

**Implementation Areas:**
- `src/lib/getKeyOutput.ts` - Add changeNumber to terraformarg output generation

**Acceptance Criteria:**
- **AC-3.1:** Given a user runs `alks sessions open --ciid 123 -o terraformarg`, When a ChangeMinder ticket is successfully created, Then the changeNumber is included in Terraform argument format with ALKS prefix (e.g., `-var alks_change_number=CHG123456`)
- **AC-3.2:** Given a user runs `alks sessions open -o terraformarg` without ChangeMinder flags, When credentials are generated, Then the output remains unchanged from current behavior

---

### FR-4: Output changeNumber in `terraformenv` format
**Priority:** Must Have
**Assigned to Goal:** Primary Goal

When ChangeMinder flags are provided and a change ticket is successfully created, include `changeNumber` in Terraform environment variable format with `ALKS` prefix.

**Implementation Areas:**
- `src/lib/getKeyOutput.ts` - Add changeNumber to terraformenv output generation

**Acceptance Criteria:**
- **AC-4.1:** Given a user runs `alks sessions open --ciid 123 -o terraformenv`, When a ChangeMinder ticket is successfully created, Then the changeNumber is included as an ALKS-prefixed environment variable (e.g., `ALKS_CHANGE_NUMBER=CHG123456`)
- **AC-4.2:** Given a user runs `alks sessions open -o terraformenv` without ChangeMinder flags, When credentials are generated, Then the output remains unchanged from current behavior

---

### FR-5: Output changeNumber in `aws` format
**Priority:** Must Have
**Assigned to Goal:** Primary Goal

When ChangeMinder flags are provided and a change ticket is successfully created, include `changeNumber` in AWS CLI credential process format.

**Implementation Areas:**
- `src/lib/getKeyOutput.ts` - Add changeNumber to aws output generation

**Acceptance Criteria:**
- **AC-5.1:** Given a user runs `alks sessions open --ciid 123 -o aws`, When a ChangeMinder ticket is successfully created, Then the changeNumber is included in the AWS credential process JSON output
- **AC-5.2:** Given a user runs `alks sessions open -o aws` without ChangeMinder flags, When credentials are generated, Then the output remains unchanged from current behavior

---

### FR-6: Output changeNumber in `idea` format
**Priority:** Must Have
**Assigned to Goal:** Primary Goal

When ChangeMinder flags are provided and a change ticket is successfully created, include `changeNumber` in IntelliJ IDEA environment variable format.

**Implementation Areas:**
- `src/lib/getKeyOutput.ts` - Add changeNumber to idea output generation

**Acceptance Criteria:**
- **AC-6.1:** Given a user runs `alks sessions open --ciid 123 -o idea`, When a ChangeMinder ticket is successfully created, Then the changeNumber is included in IntelliJ IDEA environment variable format
- **AC-6.2:** Given a user runs `alks sessions open -o idea` without ChangeMinder flags, When credentials are generated, Then the output remains unchanged from current behavior

---

## Out of Scope / Non-Goals

1. **ChangeMinder Backend Flakiness** - Errors like "Error obtaining Change Request Number" are backend issues and will not be addressed in this feature
2. **Session Cache ChangeMinder Bug** - The issue where session cache doesn't forward ChangeMinder params when the `-N` flag is omitted is a separate bug and out of scope for this feature
3. **ChangeMinder API Integration Changes** - No modifications to the ChangeMinder client or API integration are in scope; only output formatting is affected
4. **Existing Output Behavior Changes** - When ChangeMinder flags are not provided, existing output behavior must remain completely unchanged

---

## Constraints

1. **Backward Compatibility:** Existing behavior for each output format must remain unchanged when ChangeMinder flags are not provided
2. **Format-Specific Conventions:** Each output format has its own key/value conventions that must be followed (e.g., Docker uses `-e`, Terraform uses `-var`, etc.)
3. **Conditional Output:** changeNumber should only be included in output when:
   - ChangeMinder flags are provided by the user AND
   - A change ticket is successfully created (no placeholder or error message if creation fails)

---

## Assumptions

1. The changeNumber value is already available in the session data when ChangeMinder ticket creation succeeds
2. Each output format's existing implementation can be extended without breaking changes
3. Unit test infrastructure is already in place for testing output formats
4. Santiago Sandoval and Nick Gibson can be reached via #alks-support Slack channel for notification

---

## Dependencies

**Internal Dependencies:**
- Existing ChangeMinder integration in ALKS CLI (no changes required)
- `src/lib/getKeyOutput.ts` - Main output formatting module
- `src/lib/updateCreds.ts` - AWS credentials file writing module

**External Dependencies:**
- None (no external system changes required)

---

## Non-Functional Requirements

### Maintainability
- **NFR-1:** All changes must include unit tests covering changeNumber inclusion in each modified output format
- **NFR-2:** Code changes should follow existing ALKS CLI patterns and conventions (TypeScript, prettier, tslint)

### Compatibility
- **NFR-3:** Maintain 100% backward compatibility - existing output behavior unchanged when ChangeMinder flags are not provided
- **NFR-4:** No performance impact - adding output fields should have negligible overhead

### Security
- **NFR-5:** Change ticket numbers are not sensitive data and can be included in output following existing security posture for credential outputs

---

## Success Metrics

1. **Primary Success Criterion:** Santiago Sandoval's DLT team can successfully capture changeNumber in scripted DLQ replay workflows using `-o creds` format
2. **Quality Metric:** All unit tests pass for all six modified output formats with no regressions in existing behavior
3. **Completion Metric:** Santiago Sandoval and Nick Gibson are notified via #alks-support Slack thread that the fix is complete

---

## Open Questions

*None at this time*

---

## Notes

- This specification was generated from Rally Feature F281658
- Primary stakeholder: Santiago Sandoval (DLT team)
- Secondary stakeholder: Nick Gibson
- Slack thread: #alks-support
