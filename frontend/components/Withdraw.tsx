'use client'

import {contractAddress, contractABI} from "@/constants";
import {useWriteContract, useWaitForTransactionReceipt} from "wagmi";
import {useState, useEffect} from "react";
import {parseEther} from "viem";

const Withdraw = (props: {walletId: number}) => {
    const {writeContract, isPending, data: hash} = useWriteContract();
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);
    const [to, setTo] = useState<string>("");
    
    // Attendre la confirmation de la transaction
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash,
    });

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    // Utiliser useEffect pour gérer la fermeture de la modal
    useEffect(() => {
        if (hash && !isPending && !isConfirming) {
            handleClose();
        }
    }, [hash, isPending, isConfirming]);

    const withdraw = async () => {
        try {
            if (!withdrawAmount) {
                alert("Please enter an amount");
                return;
            }
            
            await writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "walletWithdraw",
                args: [props.walletId, to, parseEther(withdrawAmount.toString())],
            });
            
        } catch (error) {
            console.error("Erreur lors du dépôt:", error);
            alert("Transaction failed. Check console for details.");
        }
    }

    return (
        <>
            <button 
                onClick={handleShow}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
                Withdraw
            </button>

            {show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Withdraw</h3>
                            <button 
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <input
                                type="number"
                                placeholder="Amount in ETH"
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="string"
                                placeholder="Address to withdraw"
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={handleClose}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                disabled={isPending || isConfirming}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={withdraw}
                                disabled={isPending || isConfirming}
                                className={`${
                                    (isPending || isConfirming)
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } text-white px-4 py-2 rounded`}
                            >
                                {isPending ? 'Confirming in wallet...' : 
                                 isConfirming ? 'Confirming on chain...' : 
                                 'Withdraw'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Withdraw;