import './App.css';
import { useEffect, useState } from 'react'
import Web3Modal from "web3modal"
import { ethers } from 'ethers'
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Storage } from 'web3.storage'
import { waybackABI } from './util';



const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID // required
    }
  }
};


function App() {
  const [urlInput, setUrlInput] = useState("");
  const [connectedAddr, setConnectAddr] = useState('');
  const [currChainID, setCurrChainID] = useState('')
  let connect = null;
  useEffect(() => {
    const effectCB = async () => {
      const web3Modal = new Web3Modal();
      connect = await web3Modal.connect();
      connect.on('accountsChanged', function (accounts) {
        connection(accounts[0], connect);
      });
      connect.on('chainChanged', function (accounts) {
        connection(accounts[0], connect);
      });
      connection(connect.selectedAddress, connect);
    }
    effectCB();
  }, []);

  async function connection(selAddr, conn) {

    const provider = new ethers.providers.Web3Provider(conn)
    const chainID = (await provider._networkPromise).chainId.toString();
    if (chainID !== currChainID) setCurrChainID(chainID)
    // if (selAddr?.toUpperCase() === marketOwnerAddr?.toUpperCase()) {
    //   setConnectAddr(selAddr);
    // } else {
    //   setConnectAddr("");
    // }
  }

  const connectToGnosisOptimism = async () => {

    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0x12c",
        rpcUrls: ["https://optimism.gnosischain.com"],
        chainName: "Gnosis Optimism",
        nativeCurrency: {
          name: "OptGNO",
          symbol: "OGNO",
          decimals: 18
        }
      }]
    });

  }

  const makeArchive = async () => {
    // const signer = await web3ModalProvider.getSigner();
    // const contract = new ethers.Contract("0x3222dEb8d733CB32Ef5Df2bd1f2123F996875423", waybackABI, signer);
    console.log("contract", connect)
    if (!connect) {
      return
    }
    const provider = new ethers.providers.Web3Provider(connect);
    const signer = provider.getSigner();

    console.log(signer)
  }

  const isValidURL = (str) => {
    try {
      new URL(urlInput)
      return true
    } catch (err) {
      return false
    }
  }
  console.log(urlInput, isValidURL(urlInput))
  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Enter a URL to archive
        </h2>
        <input style={{ fontSize: "20px", height: "30px", marginBottom: "20px", width: "60%" }} type="text" onChange={(x) => setUrlInput(x.target.value)} value={urlInput} />
        <button
          className="App-button"
          target="_blank"
          style={{ height: "40px", width: "120px", fontSize: "20px" }}
          onClick={() => makeArchive()}
        >
          Archive
        </button>
      </header>
    </div>
  );
}

export default App;
