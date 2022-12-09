import { useWallet } from "@solana/wallet-adapter-react";
import { useClaimNFT, useDropUnclaimedSupply, useLogin, useLogout, useNFTs, useProgram, useUser } from "@thirdweb-dev/react/solana";
import { NFT } from "@thirdweb-dev/sdk";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { wallet } from "./_app";

function LoginPage(){
  const [usersNft, setUsersNft] = useState<NFT | undefined>()
  const login = useLogin()
  const logout = useLogout()
  const router = useRouter()
  const { user } = useUser()
  const { publicKey, connect, select } = useWallet()

  const { program } = useProgram(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
    "nft-drop"
  )

  const { data: unclaimedSupply } = useDropUnclaimedSupply(program);
  const { data: nfts, isLoading } = useNFTs(program);
  const { mutateAsync: claim } = useClaimNFT(program);

  useEffect(() => {
    if(!publicKey){
      select(wallet.name);
      connect()
    }
  }, [publicKey, wallet])

  useEffect(() => {
    if(!user || !nfts) return; 

    const usersNft = nfts.find(nft => nft.owner === user.address);

    if(usersNft){ 
      setUsersNft(usersNft);
    }
  }, [nfts, user])
  
  const handleLogin = async () => {
    await login();
    router.replace("/");
  }

  const handlePurchase = async () => {
    await claim({
      amount: 1,
    })
    router.replace('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#F5AB0B]">
      <div className=" top-56 left-0 w-full h-1/4 bg-fuchsia-600 -skew-y-6 z-10 overflow-hidden shadow-xl">
        <Image
          className="mt-5 z-30 shadow-2xl mb-10 rounded-full"
          src="https://links.papareact.com/xu7"
          alt="logo"
          width={400}
          height={400}
        />
        <main className="z-30 text-white">
          <h1 className="text-4xl font-bold uppercase">
            Welcome to the <span className="text-green-500">PAPAFAM</span>
          </h1>
          {!user && (
            <div>
              <button
                onClick={handleLogin}
                className="text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10 border-2 border-fusbg-fuchsia-600 
                  animate-pulse rounded-md translate duration-200 mt-5"
              >
                Login / Connect Wallet
              </button>
            </div>
          )}
          {user && (
            <div>
              <p className="text-lg text-green-500 font-bold mb-10">
                Welcome {user.address.slice(0, 5)}...{user.address.slice(-5)}
              </p>
              {isLoading && (
                <div
                  className="text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10
                      border-2 border-fuchsia-600 animate-pulse rounded-md transition duration-200
                    "
                >
                  Hold on, We're just looking for your PAPAFAM Membership pass
                </div>
              )}
              {usersNft && (
                <Link
                  href="/"
                  className="text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10 border-2
                      border-fuchsia-600 animate-pulse rounded-md transition duration-200 hover:bg-white
                      hover:text-fuchsia-600 mt-5 uppercase
                    "
                >
                  ACCESS GRANTED - ENTER
                </Link>
              )}
              {!usersNft &&
                !isLoading &&
                (unclaimedSupply && unclaimedSupply > 0 ? (
                  <button
                    onClick={handlePurchase}
                    className="bg-green-600 text-white py-4 px-10 border-2 border-fuchsia-600 rounded-md
                      hover:bg-white hover:text-fuchsia-600 mt-5 uppercase font-bold transition duration-200
                    "
                  >
                    Buy a PAPAFAM MemberShip Pass
                  </button>
                ) : (
                  <p>Sorry, we're all out of PAPAFAM Membership passes</p>
                ))}
              {user && (
                <button
                  onClick={logout}
                  className="bg-white text-fuchsia-600 py-4 px-10 border-2 border-fuchsia-600 rouned-md 
                    hover:bg-fuchsia-600 hover:text-white mt-10 uppercase font-bold transition duration-200
                  "
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
