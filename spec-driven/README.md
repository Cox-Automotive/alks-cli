# spec-driven/

This directory contains specification-driven development artifacts for ALKS CLI features.

## Structure

Each feature has its own subdirectory under `spec-driven/`:

```
spec-driven/
├── <feature-slug>/
│   ├── spec.md          # Feature specification
│   ├── plan.md          # Implementation plan
│   └── tasks.md         # Task breakdown (generated from plan)
├── .sessions/           # Session state for resumable workflows
└── README.md            # This file
```

## Workflow

1. **Specification** (`/spec`) - Define WHAT to build
   - Created from Rally features, PRDs, or user input
   - Contains functional requirements, acceptance criteria, NFRs

2. **Planning** (`/plan`) - Define HOW to build it
   - Breaks down spec into implementation steps
   - Includes architecture decisions, dependencies, verification criteria

3. **Task Decomposition** (`/task`) - Generate executable work items
   - Transforms plan steps into fine-grained tasks
   - Supports parallel execution and progress tracking

4. **Execution** (`/execute`) - Implement the changes
   - Executes tasks with automated verification
   - Creates traceable commits

## Current Features

- **changeminder-output-formats** - Add ChangeMinder change number to all ALKS CLI output formats (Rally F281658)

## Usage

Use the spec-driven-skills to work with these artifacts:
- `/spec-driven-skills:spec` - Create a specification
- `/spec-driven-skills:plan` - Generate an implementation plan
- `/spec-driven-skills:task` - Decompose plan into tasks
- `/spec-driven-skills:execute` - Execute the tasks
- `/spec-driven-skills:verify` - Verify implementation against spec
