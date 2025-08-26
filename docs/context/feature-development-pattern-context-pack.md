---
title: "Copilot Feature Development Pattern Context Pack"
description: "A standardized approach for software engineers to collaborate with GitHub Copilot for efficient feature development using a documentation-driven, milestone-based implementation process."
version: "1.1.0"
author: "Robby Ranshous"
creation_date: "2025-05-06"
last_updated: "2025-06-05"
repository: "https://ghe.coxautoinc.com/Manheim-Architecture/copilot-feature-development-pattern"
type: ai-interaction
tags:
   portfolio: i5
   keywords:
      - "copilot"
      - "development process"
      - "ai collaboration"
      - "feature development"
      - "documentation-driven"
      - "milestone-based"
---

# Feature Development Pattern

This document describes the pattern used by the software engineer and copilot while working on a feature.

## General Process
There are three phases to this pattern. Each phase produces an artifact. The software developer and copilot work together in all three phases.
1. The general introduction produces the shared understanding of the goals and boundaries of the work. This is captured in a short intro file.
2. The planning phase produces a plan to complete the work. This is captured in the implementation plan file.
3. The implementation phase produces the work.
These phases move from general to specific.

## Context

A software developer will work in concert with Copilot to implement a feature in this software project.

## Documentation

- The base documentation folder for feature development is `docs/feat`.
- All documentation should be in Markdown format.
- The documents will be used by Copilot to help guide and track implementation.
- All new documents should start blank.
- The `docs/deps/` directory contains documentation on the dependencies, integrations and interfaces used in this project.
- Feature documentation is organized in a consistent manner under `docs/feat/US[ticket-number]-[feature-name]/` with standardized document naming:
  - `intro.md`: Feature introduction and context.
  - `implementation-plan.md`: Detailed implementation milestones.
    - Each milestone will include a section describing the expected outcome.
    - The implementation plan is high level.
    - The implementation plan should not contain code, technical specifications or directory structures. Prose only.
    - Each implementation milestone should include only a single discrete testable change. Break complex implementations into multiple smaller milestones, where each milestone can be independently verified.
  - `implementation-progress.md`: Track progress of implementation.
    - Checklists make the progress report easy to understand.

## Software Developer and Copilot working together

The feature will be implemented by Copilot with direction and feedback given by the software engineer.
Focus on understanding the work to be done before getting to the code.

### Software Engineer's role

The software engineer plays an important role in the implementation pattern.

The software engineer:

- Provides feedback on changes made by Copilot.
- Validates milestone completion.
- Provides context.
- Makes git commits.
- Gets documentation for Copilot.
- Decides when to continue to the next activity.

### Copilot's role

Copilot manages the code. This pattern is single writer and copilot is the writer.

Copilot:

- Writes the code.
- Keeps documents up to date.
- Asks software engineer for input.

## General Pattern

- Copilot creates the docs for the new feature.
- Copilot fetches rally information and uses it to start the intro file. Without rally information, the intro file remains blank.
- Software Engineer refines the intro file.
- Copilot checks its understanding of the intro file with the software engineer until consensus is reached.
- Copilot creates an implementation plan document.
- The software engineer reviews the implementation plan and provides feedback.
- The software engineer and copilot work together to refine the implementation plan until the software engineer is satisfied with the plan.
- Copilot begins implementation work, starting with the first milestone.
- Copilot runs builds and tests to verify the correctness of its changes.
- After Copilot finishes implementation, the software engineer checks the code and application.
- The software engineer provides feedback to Copilot.
- Copilot makes updates to the implementation based on the software engineer's feedback.
- The software engineer and copilot continue the milestone refinement cycle until the software engineer is satisfied.
- The milestone is considered complete and Copilot updates the implementation progress doc.
- At the software engineer's direction Copilot begins work on the next milestone.
- This pattern continues until all the milestones are complete.

### Post feature completion

- Update project-level docs such as the README file.

## Directives

Do not begin implementing a milestone until the software developer agrees.
