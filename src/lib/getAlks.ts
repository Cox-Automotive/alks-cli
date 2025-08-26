import ALKS, { AlksProps, create } from 'alks.js';
import { getUserAgentString } from './getUserAgentString';
import { getServer } from './state/server';

interface TokenProps {
  token: string;
  headers?: Record<string, string>;
}

function isTokenProps(props: Props): props is TokenProps {
  return !!(props as TokenProps).token;
}

interface PasswordProps {
  userid: string;
  password: string;
  headers?: Record<string, string>;
}

export type Props = TokenProps | PasswordProps;

/**
 * Gets a preconfigured alks.js object
 */
export async function getAlks(props: Props): Promise<ALKS.Alks> {
  const server = await getServer();
  if (!server) {
    throw new Error(
      'Server URL is not configured. Please run: alks developer configure'
    );
  }

  // Always include the Test header, merging with any provided headers
  const mergedHeaders = {
    ...(props.headers || {}),
    Test: 'Test',
  };

  const params: any = {
    baseUrl: server,
    userAgent: getUserAgentString(),
    headers: mergedHeaders,
  };
  let alks;

  if (isTokenProps(props)) {
    alks = create(params as AlksProps);

    let result: ALKS.AccessToken;
    try {
      result = await alks.getAccessToken({
        refreshToken: props.token,
      });
    } catch (e) {
      throw new Error(
        `${
          (e as Error).message
        }. You can get a new refresh token by running 'alks developer login2fa'`,
        // This is valid JS, but typescript doesn't seem to think so yet. We should remove this once typescript supports the new Error constructors
        // @ts-ignore
        { cause: e }
      );
    }

    alks = alks.create({
      ...params,
      accessToken: result.accessToken,
    });
  } else {
    // According to typescript, alks.js doesn't officially support username & password
    alks = create({
      ...params,
      userid: props.userid,
      password: props.password,
    } as unknown as AlksProps);
  }

  return alks;
}
