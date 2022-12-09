import { ThirdwebAuth } from '@thirdweb-dev/auth/next/solana';

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  privateKey: process.env.PRIVATE_KEY!,
  domain: 'example.org',
});
