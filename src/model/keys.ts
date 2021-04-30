export interface AwsKey {
  accessKey: string;
  secretKey: string;
  sessionToken: string;
}

export interface Key extends AwsKey {
  alksAccount: string;
  alksRole: string;
  isIAM: boolean;
  expires: Date;
}
