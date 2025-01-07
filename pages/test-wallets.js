import React from "react";
import useWallets from "../src/hooks/useWallets";

function App() {
  const { wallets, connectWallet, connectedAccount } = useWallets();

  return (
    <div>
      <h1>React dApp with EIP-6963</h1>
      {connectedAccount ? (
        <p>Connected Account: {connectedAccount}</p>
      ) : wallets.length > 0 ? (
        wallets.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => connectWallet(wallet.provider)}
          >
            Connect to {wallet.name}
          </button>
        ))
      ) : (
        <p>No wallets detected</p>
      )}
    </div>
  );
}

export default App;
