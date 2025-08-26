# Plan: Ensuring ALKS CLI Includes Required Headers

## Background
In ALKSWeb (`src/operations/FetchKeys.ts`), the ALKS client is initialized with a custom header:

```js
const alks = ALKS.create({
  baseUrl: config.default.alks.baseUrl,
  headers: {
    Test: `Test`,
  },
  accessToken,
});
```

To ensure compatibility and proper identification, the `alks-cli` must also include the required `Test` header (and any other required headers) when creating an ALKS client instance.

---

## Plan

1. **Identify ALKS Client Initialization in alks-cli**
   - Locate where the ALKS client is created (typically in `src/lib/getAlks.ts` or similar).

2. **Update ALKS Client Creation**
   - Add a `headers` property to the ALKS client configuration object.
   - Ensure the `Test` header is included, matching the ALKSWeb example.
   - Example:
     ```js
     const alks = ALKS.create({
       baseUrl,
       headers: {
         Test: 'Test',
         // ...other headers as needed
       },
       accessToken,
     });
     ```

3. **Configuration**
   - If the value for `Test` should be dynamic, make it configurable via environment variable or CLI flag.
   - Otherwise, use the static value as in ALKSWeb.

4. **Testing**
   - Add or update tests to verify that the `Test` header is present in all ALKS client requests from the CLI.

5. **Documentation**
   - Document the required headers and their purpose in the CLI codebase for future maintainers.

---

## Acceptance Criteria
- All ALKS client requests from alks-cli include the `Test` header as required.
- Tests confirm the presence of the header.
- Documentation is updated.
