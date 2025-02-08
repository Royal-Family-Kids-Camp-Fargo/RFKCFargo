import { clsx, type ClassValue } from 'clsx';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TokenPayload = {
  roleid: number;
  tenantid: number;
};

export function validateDeviiToken(token: string): TokenPayload | undefined {
  let decodedToken: JwtPayload | undefined;

  try {
    decodedToken = jwtDecode(token);
    console.log(decodedToken);
    console.log(decodedToken?.sub);

    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      throw new Error('Token has expired');
    }

    const roleId = (decodedToken.sub as unknown as Record<string, number>)
      .roleid;
    const tenantId = (decodedToken.sub as unknown as Record<string, number>)
      .tenantid;

    if (!roleId || !tenantId) {
      throw new Error('Invalid token');
    }

    return { roleid: roleId, tenantid: tenantId };
  } catch (error) {
    console.error('Invalid token:', error);
  }

  return undefined;
}
