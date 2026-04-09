# Task Bundle: Add ChangeMinder Change Number to All Output Formats

**feature:** Add ChangeMinder Change Number to All Output Formats
**plan_source:** spec-driven/changeminder-output-formats/plan.md
**spec_source:** spec-driven/changeminder-output-formats/spec.md
**plan_hash:** 6b127624ec2e606a84aafe5395d8426d576bf896cf0bd97f910ded547f41a8ce
**spec_hash:** a1d08bea375f8daabbc61ece3714c7bd2c92a0a7f67660f927ed4744546eb8aa
**version:** 1.0
**status:** final
**bundle_mode:** sequential
**total_tasks:** 7
**total_bundles:** 2
**validation:** subagent
**created:** 2026-03-23

---

## Overview

This task bundle implements changeNumber output for six ALKS CLI output formats that currently discard the change ticket number: `creds`, `docker`, `terraformarg`, `terraformenv`, `aws`, and `idea`.

**Execution Strategy:**
- **Bundle 1 (Phase 1 - Walking Skeleton):** Sequential execution to prove the creds format pattern end-to-end
- **Bundle 2 (Phase 2 - Remaining Formats):** Parallel execution supported (independent switch case modifications)

**Test Approach:** TDD with Jest — tests written before implementation for all behavioral logic

---

## Traceability

| FR | AC | STEP | Tasks |
|----|----|----|-------|
| FR-1 | AC-1.1, AC-1.2 | STEP-1 | TASK-1 |
| FR-1 | AC-1.1 | STEP-2 | TASK-2 |
| FR-2 | AC-2.1, AC-2.2 | STEP-3 | TASK-3 |
| FR-3 | AC-3.1, AC-3.2 | STEP-4 | TASK-4 |
| FR-4 | AC-4.1, AC-4.2 | STEP-5 | TASK-5 |
| FR-5 | AC-5.1, AC-5.2 | STEP-6 | TASK-6 |
| FR-6 | AC-6.1, AC-6.2 | STEP-7 | TASK-7 |

---

## Bundle 1: Walking Skeleton - Prove creds Format Pattern

> Phase: Walking Skeleton | Parallel: no | Files: src/lib/getKeyOutput.ts, src/lib/updateCreds.ts

**Goal:** Prove the changeNumber output pattern end-to-end with the most complex format (creds), which touches both output formatting and file writing.

### TASK-1: Implement changeNumber in creds output format
**Trace:** STEP-1 → FR-1 → AC-1.1, AC-1.2
**Files:** src/lib/getKeyOutput.ts, src/lib/getKeyOutput.test.ts
**Effort:** M

> **Intent:** The creds format returns empty string (no console output) since credentials are written to file by updateCreds.ts. However, getKeyOutput must still construct the Key object with changeNumber populated so downstream consumers (including updateCreds.ts) receive it. Missing this will cause updateCreds to receive undefined changeNumber even when the ticket was created.

**Sub-steps:**
1. Create `src/lib/getKeyOutput.test.ts` if it doesn't exist (follow pattern from existing `.test.ts` files like `src/lib/getIamKey.test.ts`)
2. Write failing tests for creds format changeNumber handling:
   - Test: When format is `creds` and changeNumber is defined, verify returned data structure includes changeNumber (AC-1.1)
   - Test: When format is `creds` and changeNumber is undefined, verify output unchanged from baseline (AC-1.2)
3. Modify `src/lib/getKeyOutput.ts` in the `creds` case:
   - Ensure the Key object or returned structure includes `changeNumber` when `key.changeNumber` is defined
   - Reference existing changeNumber handling in `json` or `powershell` formats for the conditional pattern (`if (key.changeNumber) { ... }`)
4. Run tests and verify they pass
5. Type-check with `tsc --noEmit`

**Verify:**
- `npm test -- --testPathPattern=getKeyOutput` (tests pass)
- Given a Key object with changeNumber='CHG123', when format='creds', then the output includes changeNumber='CHG123'
- Given a Key object without changeNumber, when format='creds', then the output matches baseline behavior
- `tsc --noEmit` (no type errors)

> Depends on: — | Enables: TASK-2 | Parallel with: —

---

### TASK-2: Write changeNumber to AWS credentials file
**Trace:** STEP-2 → FR-1 → AC-1.1
**Files:** src/lib/updateCreds.ts, src/lib/updateCreds.test.ts
**Effort:** M

> **Intent:** AWS credentials files use INI format with `[profile-name]` sections. changeNumber must be written as a comment line (e.g., `# ALKS_CHANGE_NUMBER=CHG123456`) immediately above the profile section to preserve INI spec compliance. Writing it as a key-value pair within the section will cause AWS CLI to fail parsing unrecognized fields.

**Sub-steps:**
1. Create `src/lib/updateCreds.test.ts` if it doesn't exist (follow pattern from `src/lib/getAwsCredentialsFile.test.ts`)
2. Write failing tests for credentials file changeNumber writing:
   - Test: When changeNumber is present, verify it's written as `# ALKS_CHANGE_NUMBER=<value>` comment above profile section (AC-1.1)
   - Test: When changeNumber is absent, verify credentials file format unchanged
   - Test: Verify comment line is valid INI syntax (can be parsed by AWS CLI)
3. Read `src/lib/updateCreds.ts` to understand propIni usage
4. Modify `src/lib/updateCreds.ts`:
   - Before calling `propIni.addData` for the profile section, check if `key.changeNumber` is defined
   - If defined, manually insert comment line `# ALKS_CHANGE_NUMBER=${key.changeNumber}` into the file content
   - Reference `src/lib/awsCredentialsFileContstants.ts` if needed for field names
5. Run tests and verify they pass

**Verify:**
- `npm test -- --testPathPattern=updateCreds` (tests pass)
- Integration test: `alks sessions open --ciid 123 -o creds` creates credentials file with `# ALKS_CHANGE_NUMBER=CHG...` comment above profile section
- Given a Key with changeNumber, when updateCreds writes to file, then the comment `# ALKS_CHANGE_NUMBER=<value>` appears immediately before the profile section
- `tsc --noEmit` (no type errors)

> Depends on: TASK-1 | Enables: — | Parallel with: —

---

## Bundle 2: Incremental Depth - Remaining Formats [P]

> Phase: Incremental Depth | Parallel: yes | Files: src/lib/getKeyOutput.ts

**Goal:** Extend changeNumber output to the remaining five formats (docker, terraformarg, terraformenv, aws, idea), following the pattern proven in Bundle 1.

**Parallelization:** All tasks in this bundle modify different switch cases in getKeyOutput.ts and are file-disjoint logically — safe for parallel execution.

### TASK-3: Implement changeNumber in docker output format
**Trace:** STEP-3 → FR-2 → AC-2.1, AC-2.2
**Files:** src/lib/getKeyOutput.ts, src/lib/getKeyOutput.test.ts
**Effort:** S

> **Intent:** Docker format outputs environment variables as `-e KEY=value` arguments for `docker run`. changeNumber must use the exact variable name `ALKS_CHANGE_NUMBER` (not `CHANGE_NUMBER`) to maintain consistency with existing ALKS-prefixed variables in terraform formats and avoid collision with user-defined container environment variables.

**Sub-steps:**
1. Write failing tests in `src/lib/getKeyOutput.test.ts` for docker format:
   - Test: When format is `docker` and changeNumber is defined, verify output includes `-e ALKS_CHANGE_NUMBER=<value>` (AC-2.1)
   - Test: When format is `docker` and changeNumber is undefined, verify output unchanged (AC-2.2)
2. Modify `src/lib/getKeyOutput.ts` in the `docker` case:
   - Append `-e ALKS_CHANGE_NUMBER=${key.changeNumber}` to the output string when `key.changeNumber` is defined
   - Follow spacing/formatting pattern from existing AWS credential variables in docker output
3. Run tests and verify they pass

**Verify:**
- `npm test -- --testPathPattern=getKeyOutput` (docker format tests pass)
- Given a Key with changeNumber='CHG123', when format='docker', then output includes `-e ALKS_CHANGE_NUMBER=CHG123`
- `tsc --noEmit` (no type errors)

> Depends on: — | Enables: — | Parallel with: TASK-4, TASK-5, TASK-6, TASK-7

---

### TASK-4: Implement changeNumber in terraformarg output format
**Trace:** STEP-4 → FR-3 → AC-3.1, AC-3.2
**Files:** src/lib/getKeyOutput.ts, src/lib/getKeyOutput.test.ts
**Effort:** S

> **Intent:** Terraform argument format outputs as `-var key=value` for CLI usage. The variable name `alks_change_number` uses snake_case (not camelCase or CONSTANT_CASE) to match Terraform variable naming conventions. Using CONSTANT_CASE would cause Terraform to reject the variable as invalid syntax.

**Sub-steps:**
1. Write failing tests in `src/lib/getKeyOutput.test.ts` for terraformarg format:
   - Test: When format is `terraformarg` and changeNumber is defined, verify output includes `-var alks_change_number=<value>` (AC-3.1)
   - Test: When format is `terraformarg` and changeNumber is undefined, verify output unchanged (AC-3.2)
2. Modify `src/lib/getKeyOutput.ts` in the `terraformarg` case:
   - Append `-var alks_change_number=${key.changeNumber}` to output string when `key.changeNumber` is defined
   - Follow existing pattern for AWS credential variables in terraformarg format (snake_case naming)
3. Run tests and verify they pass

**Verify:**
- `npm test -- --testPathPattern=getKeyOutput` (terraformarg format tests pass)
- Given a Key with changeNumber='CHG123', when format='terraformarg', then output includes `-var alks_change_number=CHG123`
- `tsc --noEmit` (no type errors)

> Depends on: — | Enables: — | Parallel with: TASK-3, TASK-5, TASK-6, TASK-7

---

### TASK-5: Implement changeNumber in terraformenv output format
**Trace:** STEP-5 → FR-4 → AC-4.1, AC-4.2
**Files:** src/lib/getKeyOutput.ts, src/lib/getKeyOutput.test.ts
**Effort:** S

> **Intent:** Terraform environment variable format outputs as `export KEY=value` for shell sourcing. The variable name `ALKS_CHANGE_NUMBER` uses CONSTANT_CASE (not snake_case) to match shell environment variable conventions and distinguish from Terraform's -var arguments. Shell variables are case-sensitive — mixing cases will create separate variables.

**Sub-steps:**
1. Write failing tests in `src/lib/getKeyOutput.test.ts` for terraformenv format:
   - Test: When format is `terraformenv` and changeNumber is defined, verify output includes `export ALKS_CHANGE_NUMBER=<value>` or platform-specific equivalent (AC-4.1)
   - Test: When format is `terraformenv` and changeNumber is undefined, verify output unchanged (AC-4.2)
2. Modify `src/lib/getKeyOutput.ts` in the `terraformenv` case:
   - Append `export ALKS_CHANGE_NUMBER=${key.changeNumber}` (or `SET` on Windows) when `key.changeNumber` is defined
   - Reference `src/lib/isWindows.ts` if platform-specific command syntax is needed
   - Follow existing pattern for AWS credential variables in terraformenv format
3. Run tests and verify they pass

**Verify:**
- `npm test -- --testPathPattern=getKeyOutput` (terraformenv format tests pass)
- Given a Key with changeNumber='CHG123', when format='terraformenv', then output includes `export ALKS_CHANGE_NUMBER=CHG123` (or `SET ALKS_CHANGE_NUMBER=CHG123` on Windows)
- `tsc --noEmit` (no type errors)

> Depends on: — | Enables: — | Parallel with: TASK-3, TASK-4, TASK-6, TASK-7

---

### TASK-6: Implement changeNumber in aws output format
**Trace:** STEP-6 → FR-5 → AC-5.1, AC-5.2
**Files:** src/lib/getKeyOutput.ts, src/lib/getKeyOutput.test.ts
**Effort:** S

> **Intent:** AWS credential process format outputs JSON per AWS CLI's external credential provider spec. changeNumber must be added as a top-level JSON property, not nested under another key. The property name should use camelCase (`changeNumber`) to match existing JSON keys like `sessionToken`, not snake_case or CONSTANT_CASE which would break naming consistency in the JSON output.

**Sub-steps:**
1. Write failing tests in `src/lib/getKeyOutput.test.ts` for aws format:
   - Test: When format is `aws` and changeNumber is defined, verify JSON output includes `"changeNumber": "<value>"` as top-level property (AC-5.1)
   - Test: When format is `aws` and changeNumber is undefined, verify JSON output unchanged (AC-5.2)
2. Modify `src/lib/getKeyOutput.ts` in the `aws` case:
   - Add `changeNumber` property to the JSON object when `key.changeNumber` is defined
   - Use camelCase naming to match existing keys (`accessKey`, `secretKey`, `sessionToken`)
   - Ensure it's a top-level property, not nested
3. Run tests and verify they pass

**Verify:**
- `npm test -- --testPathPattern=getKeyOutput` (aws format tests pass)
- Given a Key with changeNumber='CHG123', when format='aws', then JSON output includes `"changeNumber": "CHG123"` as top-level property
- `tsc --noEmit` (no type errors)

> Depends on: — | Enables: — | Parallel with: TASK-3, TASK-4, TASK-5, TASK-7

---

### TASK-7: Implement changeNumber in idea output format
**Trace:** STEP-7 → FR-6 → AC-6.1, AC-6.2
**Files:** src/lib/getKeyOutput.ts, src/lib/getKeyOutput.test.ts
**Effort:** S

> **Intent:** IntelliJ IDEA environment variable format outputs XML elements for run configuration import. changeNumber must be added as a new `<env>` element with name="ALKS_CHANGE_NUMBER", not as a text node or attribute on existing elements. Incorrect XML structure will cause IDEA to silently ignore the variable or fail to parse the run configuration entirely.

**Sub-steps:**
1. Read existing `idea` format output in `src/lib/getKeyOutput.ts` to understand the current structure (XML or custom format)
2. Write failing tests in `src/lib/getKeyOutput.test.ts` for idea format:
   - Test: When format is `idea` and changeNumber is defined, verify output includes ALKS_CHANGE_NUMBER in IDEA-compatible format (AC-6.1)
   - Test: When format is `idea` and changeNumber is undefined, verify output unchanged (AC-6.2)
3. Modify `src/lib/getKeyOutput.ts` in the `idea` case:
   - Add changeNumber to output following IDEA format conventions (likely environment variable list format)
   - Follow existing pattern for AWS credential variables in idea format
4. Run tests and verify they pass

**Verify:**
- `npm test -- --testPathPattern=getKeyOutput` (idea format tests pass)
- Given a Key with changeNumber='CHG123', when format='idea', then output includes ALKS_CHANGE_NUMBER=CHG123 in IDEA-compatible format
- `tsc --noEmit` (no type errors)

> Depends on: — | Enables: — | Parallel with: TASK-3, TASK-4, TASK-5, TASK-6

---

## Conflict Analysis

### Hot Files
- **src/lib/getKeyOutput.ts**: Modified by all 7 tasks
  - **Bundle 1**: TASK-1 (creds case)
  - **Bundle 2**: TASK-3 (docker), TASK-4 (terraformarg), TASK-5 (terraformenv), TASK-6 (aws), TASK-7 (idea)
  - **Conflict Strategy**: Switch case isolation — each task modifies a different case branch, making them logically file-disjoint despite touching the same file
  - **Sequencing**: Bundle 1 before Bundle 2 (walking skeleton establishes pattern). Within Bundle 2, parallel execution is safe.

- **src/lib/updateCreds.ts**: Modified by TASK-2 only
  - No conflicts

### Test Files
- **src/lib/getKeyOutput.test.ts**: Created/modified by all 7 tasks
  - Each task adds test cases for its specific format — append-only pattern minimizes conflicts
  - **Bundle 2 Parallelization Risk**: Low — test cases for different formats are independent assertions

- **src/lib/updateCreds.test.ts**: Created/modified by TASK-2 only
  - No conflicts

### Parallelization Summary
- **Bundle 1**: Sequential (TASK-1 → TASK-2 dependency)
- **Bundle 2**: Marked `[P]` — all 5 tasks can execute in parallel
  - Switch case isolation in getKeyOutput.ts ensures file-disjoint modifications
  - Test case append pattern in getKeyOutput.test.ts minimizes merge conflicts

---

## Execution Notes

**Sequential Mode (default):**
- Execute Bundle 1 tasks in order (TASK-1, then TASK-2)
- Execute Bundle 2 tasks sequentially (TASK-3 through TASK-7) — though they could run in parallel with agent mode

**Agent Mode (worktree parallelism):**
- Bundle 2 tasks can execute concurrently in separate git worktrees
- Each worktree modifies a different switch case, minimizing merge conflicts
- Expected speedup: ~5x for Bundle 2 (5 tasks in parallel vs sequential)

**Team Mode (branch/PR coordination):**
- Distribute Bundle 2 tasks across team members (one format per developer)
- Each developer creates a feature branch from Bundle 1 completion
- Merge sequence: Bundle 1 → all Bundle 2 PRs in any order

---

## Closing Message Template

After all tasks complete and the final commit is made:

```
✅ All 7 tasks completed successfully!

**Implementation Summary:**
- ✅ TASK-1: creds format output includes changeNumber
- ✅ TASK-2: changeNumber written to AWS credentials file as INI comment
- ✅ TASK-3: docker format includes `-e ALKS_CHANGE_NUMBER=...`
- ✅ TASK-4: terraformarg format includes `-var alks_change_number=...`
- ✅ TASK-5: terraformenv format includes `export ALKS_CHANGE_NUMBER=...`
- ✅ TASK-6: aws format JSON includes `"changeNumber": "..."`
- ✅ TASK-7: idea format includes ALKS_CHANGE_NUMBER

**Next Steps:**
1. Run full test suite: `npm test`
2. Manual testing: `alks sessions open --ciid 123 -o <format>` for each format
3. Notify Santiago Sandoval (DLT team) and Nick Gibson via #alks-support Slack thread
4. Merge to master and release

**Verification Commands:**
- `npm test -- --coverage` (verify >80% coverage for modified functions)
- `npm run tslint` (code style compliance)
- Integration test each format with real ChangeMinder ticket creation

Santiago's DLT team can now capture change ticket numbers in scripted DLQ replay workflows! 🎉
```
