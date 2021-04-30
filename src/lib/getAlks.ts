import ALKS, { AlksProps, create } from 'alks.js';
import { getUserAgentString } from './getUserAgentString';

interface BaseProps {
  baseUrl: string;
}

interface TokenProps extends BaseProps {
  token: string;
}

function isTokenProps(props: Props): props is TokenProps {
  return !!(props as TokenProps).token;
}

interface PasswordProps extends BaseProps {
  userid: string;
  password: string;
}

export type Props = TokenProps | PasswordProps;

/**
 * Gets a preconfigured alks.js object
 */
export async function getAlks(props: Props): Promise<ALKS.Alks> {
  const { baseUrl } = props;

  const params = {
    baseUrl,
    userAgent: getUserAgentString(),
  };

  let alks;

  if (isTokenProps(props)) {
    alks = create(params as AlksProps);
    const result = await alks.getAccessToken({
      refreshToken: props.token,
    });
    alks = alks.create({
      ...props,
      accessToken: result.accessToken,
    });
  } else {
    // According to typescript, alks.js doesn't officially support username & password
    alks = create(({
      ...params,
      userid: props.userid,
      password: props.password,
    } as unknown) as AlksProps);
  }

  return alks;
}
