# ALKS CLI Commands

Below is a list of all ALKS CLI commands and their switches, sorted alphabetically (uppercase first, then lowercase):

---

## A. ALKS Commands

### completion
- shell completer for cli commands

### developer
- developer & account commands
  - configure
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -o, --output <format>
    - -u, --username <username>
    - -s, --server <server>
    - -A, --auth-type <authType>
    - --credential-process <scriptPath>
    - --non-interactive
  - accounts
    - -e, --export
    - -o, --output <format>
  - favorites
  - info
  - login
    - -u, --username <username>
  - login2fa
  - logout
  - logout2fa

### iam
- manage iam resources
  - createltk (create-ltk)
    - -n, --iamusername <iamUsername>
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -F, --favorites
    - -o, --output <format>
    - -k, --tags <tags...>
  - createtrustrole (create-trust-role)
    - -n, --rolename <rolename>
    - -t, --roletype <roletype>
    - -T, --trustarn <trustarn>
    - -e, --enableAlksAccess
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -F, --favorites
    - -k, --tags <tags...>
  - createrole (create-role)
    - -n, --rolename <rolename>
    - -t, --roletype <roletype>
    - -p, --trustPolicy <trustPolicy>
    - -d, --defaultPolicies
    - -e, --enableAlksAccess
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -F, --favorites
    - -k, --tags <tags...>
    - -T, --template-fields <templateFields...>
  - deleterole (delete-role)
    - -n, --rolename <rolename>
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -F, --favorites
  - deleteltk (delete-ltk)
    - -n, --iamusername <iamUsername>
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -F, --favorites
  - roletypes (role-types, list-role-types)
    - -o, --output <format>
  - updaterole (update-role)
    - -n, --rolename <rolename>
    - -p, --trustPolicy <trustPolicy>
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -F, --favorites
    - -k, --tags <tags...>
  - updateIamUser (updateltk, update-ltk)
    - -n, --iamusername <iamUsername>
    - -a, --account <accountIdOrAlias>
    - -o, --output <format>
    - -k, --tags <tags...>

### profiles (profile)
- manage aws profiles
  - generate (add, create)
    - -A, --all
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -n, --namedProfile <profile>
    - -P, --profile <profile>
    - -f, --force
  - get
    - -n, --namedProfile <profile>
    - -P, --profile <profile>
    - -o, --output <format>
    - -S, --show-sensitive-values
  - list (ls)
    - -A, --all
    - -o, --output <format>
    - -S, --show-sensitive-values
  - remove (rm, delete)
    - -A, --all
    - -n, --namedProfile <profile>
    - -P, --profile <profile>
    - -f, --force

### server
- ec23 metadata server
  - configure
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -i, --iam
    - -p, --password <password>
    - -F, --favorites
  - start
  - stop

### sessions (session)
- manage aws sessions
  - console
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -i, --iam
    - -d, --default
    - -N, --newSession
    - -u, --url
    - -o, --openWith <openWith>
    - -F, --favorites
    - -p, --password <password>
  - list (ls)
    - -p, --password <password>
  - open
    - -a, --account <accountIdOrAlias>
    - -r, --role <authRole>
    - -i, --iam
    - -d, --default
    - -D, --duration <duration>
    - -N, --newSession
    - -p, --password <password>
    - -o, --output <format>
    - -n, --namedProfile <profile>
    - -P, --profile <profile>
    - -f, --force
    - -F, --favorites

---

## Global Options
- -v, --verbose
- -V, --unsafe-verbose
- --version

---

*This list is generated from the CLI source and sorted as requested.*
