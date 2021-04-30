export function getOwnerReadWriteOnlyPermission() {
  return {
    owner: { read: true, write: true, execute: false },
    group: { read: false, write: false, execute: false },
    others: { read: false, write: false, execute: false },
  };
}
