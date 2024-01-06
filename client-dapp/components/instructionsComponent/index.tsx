import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import abiUSDC from '../../app/contracts/usdc-erc20';
import playerAccountingContract from '../../app/contracts/PlayerAccounting.json';
import {
  useAccount, useBalance, usePrepareContractWrite,
  useContractWrite, useWaitForTransaction, useContractRead, useWalletClient
} from "wagmi";
import { ethers } from "ethers";

const abiPA = playerAccountingContract.abi;

export default function InstructionsComponent() {
  const [amount, setAmount] = useState('');
  const [isConnectedStatus, setConnectionStatus] = useState(false);
  const [addr, setAddr] = useState<`0x${string}`>();
  const { address, isConnected } = useAccount();

  // Set the wallet connections status and address into state
  useEffect(() => {
    setConnectionStatus(isConnected);
    setAddr(address);
  }, [address, isConnected])

  const { data: usdcBalanceData, isError: usdcBalanceError } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_USDC_MUMBAI_CONTRACT_ADDRESS! as `0x${string}`,
    watch: true
  });

  /**
   * Wagmi hooks for ERC20 approve call
   */
  const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_USDC_MUMBAI_CONTRACT_ADDRESS! as `0x${string}`,
    abi: abiUSDC,
    functionName: 'approve',
    args: [process.env.NEXT_PUBLIC_PLAYER_ACCOUNTING_CONTRACT_ADDRESS, amount.length > 0 ? ethers.parseUnits(amount, 6) : 0]
  });

  // Setup the hook to call the ERC20 contract
  const { data, write, error, isError } = useContractWrite(config);

  //Setup the hook to get status from the ERC20 approve call
  const { isLoading, isSuccess: isApproveTxSuccess } = useWaitForTransaction({ hash: data?.hash });

  /**
    * Wagmi hooks for Player Accounting contract call, to deposit
    */
  const { config: configPA, error: prepareErrorPA, isError: isPrepareErrorPA } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PLAYER_ACCOUNTING_CONTRACT_ADDRESS! as `0x${string}`,
    abi: abiPA,
    functionName: 'deposit',
    args: [amount.length > 0 ? ethers.parseUnits(amount, 6) : 0],
    enabled: isApproveTxSuccess
  });

  const { data: dataPA, write: writePA, error: errorPA, isError: isErrorPA } = useContractWrite(configPA);
  const { isLoading: isLoadingPA, isSuccess: isSuccessPA } = useWaitForTransaction({ hash: dataPA?.hash });

  /**
   * Hook to read the Player Accounting contract to get the active wallet's USDC deposit balance
   */
  function transformPlayerBalance(data: any) {
    return ethers.formatUnits(data, 6);
  }

  const { data: walletClient } = useWalletClient();
  const { data: playerFundsOnDeposit, isError: isErrorReadBalance, isLoading: isLoadingReadBalance } = useContractRead({
    address: process.env.NEXT_PUBLIC_PLAYER_ACCOUNTING_CONTRACT_ADDRESS! as `0x${string}`,
    abi: abiPA,
    functionName: 'getBalance',
    account: walletClient?.account,
    select: (data) => transformPlayerBalance(data),
    watch: true
    // onSettled(data, error) {
    //   console.log('Settled', { data, error })
    // },
  });

  /**
   * Input validations
   */
  const validateAmount = (inputAmount: string) => {
    if (!usdcBalanceData) {
      return;
    } else if (inputAmount.length === 0) {
      setAmount(inputAmount);
      return;
    }

    const userAmount = parseInt(inputAmount);
    const usdcBalance = parseInt(usdcBalanceData.formatted);
    if (userAmount > 0 && userAmount <= usdcBalance) {
      setAmount(inputAmount);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header_container}>
        <div className={styles.desc}>
          <h5>This dApp allows a player to deposit USDC to a gaming system.  Doing this puts the funds on deposit for the player, allowing them to join games within the system.
            The player must approve USDC transfer for the Player Accounting contract and then deposit the USDC to that contract.  The backend system reads the contract to determine
            how much a player has deposited and if their account is active.
          </h5>
        </div>
        <div className={styles.divPadding}>
          {isConnectedStatus ? (
            <div>
              <div>
                Your wallet's Mumbai USDC balance: <span className={styles.usdc}>{usdcBalanceData?.formatted} {usdcBalanceData?.symbol}</span>
              </div>
              <div className={[styles.hint, styles.divPadding].join(" ")}>
                You can get more Mumbai USDC <a className={styles.links} target="_blank" href="https://faucet.circle.com/">here</a>, choose "Polygon POS Mumbai"
              </div>
              <div className=''>
                Funds already on deposit in the Player Accounting contract: <span className={styles.usdc}>{playerFundsOnDeposit} USDC</span>
              </div>
            </div>
          ) : (
            <p>Waiting for wallet connection...</p>
          )}
        </div>

        <div className={styles.header}>
          <div className={styles.divPadding}>
            <label>
              Enter # of USDC to deposit into gaming system: <input name="amountUSDC" type="number"
                value={amount} onChange={e => validateAmount(e.target.value)} />
            </label>
          </div>
          <div className={styles.divPadding}>
            <button className={styles.button} disabled={!write || isLoading || amount.length === 0} onClick={() => write?.()}>
              {isLoading ? 'Approving...' : 'Approve USDC'}
            </button>
          </div>
          <div className={[styles.tx, styles.divPadding].join(" ")}>
            {data?.hash ? (
              <span>Click <a className={styles.txHyper} href={`https://mumbai.polygonscan.com/tx/${data?.hash}`} target="_blank">here</a> for Approve TX on Polygonscan</span>
            ) : <span>No approve transaction yet...</span>}
          </div>
          <div className={styles.error}>
            {(isPrepareError || isError) && (
              <div>Approve Error: {(prepareError || error)?.message}</div>
            )}
          </div>

          <div className={styles.divPadding}>
            <button className={styles.button} disabled={!writePA || isLoadingPA || amount.length === 0} onClick={() => writePA?.()}>
              {isLoadingPA ? 'Depositing...' : 'Deposit USDC'}
            </button>
          </div>
          <div className={styles.tx}>
            {dataPA?.hash ? (
              <span>Click <a className={styles.txHyper} href={`https://mumbai.polygonscan.com/tx/${dataPA?.hash}`} target="_blank">here</a> for Deposit TX on Polygonscan</span>
            ) : <span>No deposit transaction yet...</span>}
          </div>
          <div className={styles.error}>
            {(isPrepareErrorPA || isErrorPA) && (
              <div>Deposit Error: {(prepareErrorPA || errorPA)?.message}</div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
