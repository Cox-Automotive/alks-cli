export interface BaseDeveloper {
  server: string;
  userid: string;
  alksAccount: string;
  alksRole: string;
  outputFormat: string;
}

export interface DeveloperMetadata {
  lastVersion: string;
}

export interface Developer extends BaseDeveloper, DeveloperMetadata {}

export interface NewDeveloper
  extends BaseDeveloper,
    Partial<DeveloperMetadata> {}
