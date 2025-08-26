
## Local CLI Installation Instructions

Before testing local changes to the alks-cli repository, uninstall any globally installed version of alks-cli:

```sh
npm un -g alks
```

Then reinstall the CLI from your local repo:

```sh
npm i -g .
```
## Commands to test

1. In alks-cli, a user should be able to create a new ChangeAPI ticket with a command like this:

```
alks sessions open -a awscoxautolabs95 -r LabAdmin --ciid CI2355950 --activity-type "Manual Deployment of Code or Infrastructure" --description "Testing for alks-cli development"
```

2. In alks-cli, a user should be able to provide a pre-generated change request ticket number like this: 

```
alks sessions open -a awscoxautolabs95 -r LabAdmin --chg-number CHG0739411

```


3. In alks-cli, a user should be able to open an account in the AWS console while creating a change request ticket for it like this:

```
alks sessions console -a awscoxautolabs95 -r LabAdmin --ciid CI2355950 --activity-type "Manual Deployment of Code or Infrastructure" --description "Testing for alks-cli development"
```



## Testing Plan for Change Request Flow

This plan validates the integration and flow described in `alkscli-flow.md` for the three commands above.

### 1. Creating a New ChangeAPI Ticket

- Run the command as shown.
- Verify the CLI prompts for any required information not provided by flags.
- Confirm a new ChangeAPI ticket is created (check output for ticket number or link).
- Validate that the ticket appears in ChangeMinder/ChangeAPI systems.
- Ensure the CLI proceeds to request Admin Keys after ticket creation and returns credentials if approved.
- Check logs or output for errors or integration failures with ALKS.js, ALKS, ChangeMinder, or ChangeAPI.

### 2. Providing a Pre-Generated Change Request Ticket

- Run the command with the `--chg-number` flag and a valid ticket number.
- Confirm the CLI accepts the ticket and does not attempt to create a new one.
- Validate that the ticket is referenced in the Admin Key request sent to ALKS.
- Ensure Admin Keys are returned if the ticket is valid and approved.
- Check for proper error handling if the ticket is invalid or not approved.

### 3. Opening AWS Console with Change Request

- Run the console command with change request flags.
- Confirm the CLI creates a new ChangeAPI ticket as in test 1, or uses an existing one if provided.
- Validate that, after approval, the CLI opens the AWS console as expected.
- Ensure the change request is logged in ChangeMinder/ChangeAPI.
- Check for correct integration with ALKS.js, ALKS, and ChangeAPI throughout the process.

### General Validation Steps

- For each command, test both successful and failure scenarios (e.g., missing/invalid flags, denied change requests).
- Review CLI output for clear user guidance and error messages.
- Optionally, monitor network/API calls to verify correct backend interactions.

This plan ensures the CLI's change request flow is robust, user-friendly, and compliant with the intended integration described in `alkscli-flow.md`.

