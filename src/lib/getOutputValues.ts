export function getOutputValues() {
  // if adding new output types be sure to update keys.js:getKeyOutput
  return [
    'env',
    'json',
    'docker',
    'creds',
    'idea',
    'export',
    'set',
    'powershell',
    'fishshell',
    'terraformenv',
    'terraformarg',
    'aws',
  ];
}

export function getOutputValuesRoleTypes() {
  return ['list', 'json'];
}

export function getOutputValuesAccounts() {
  return ['table', 'json'];
}
