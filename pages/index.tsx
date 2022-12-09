import { useLogout } from '@thirdweb-dev/react/solana'
import { NFT } from '@thirdweb-dev/sdk'
import { ThirdwebSDK } from '@thirdweb-dev/sdk/solana'
import type { GetServerSideProps } from 'next'
import { getUser } from '../auth.config'
import { network } from './_app'

export const getServerSideProps: GetServerSideProps = async ({ req,  res}) => {
  const sdk = ThirdwebSDK.fromNetwork(network);
  const user = await getUser(req);

  if(!user){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const program = await sdk.getNFTDrop(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!
  )
  const nfts = await program.getAllClaimed()
  const nft = nfts.find(nft => nft.owner === user.address);

  if(!nft){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {
      nft,
    },
  };
}

function Home({ nft }: { nft: NFT }) {
  const logout = useLogout();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#F5AB0B] -z-20 px-5">
      <p
        className="fixed top-10 text-xs md:text-base bg-red-500 rounded-full px-4 md:px-8 py-3 font-bold text-white
      mx-10
    "
      >
        MEMBERS ONLY: This page is only accessible to users who have purchased & hold a PAPAFAM NFT
        NFT Info: 
        {JSON.stringify(nft)}
      </p>
      <h1>WOOHOO! You made a NFT gated website</h1>
      <button onClick={logout} className="bg-red-500">
        {' '}
        Logout{' '}
      </button>
    </div>
  );
}

export default Home
