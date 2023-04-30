const initialize = () => {
    //We have selected our required html elements
    const connectButton = document.getElementById('connect');
    const addr = document.getElementById("addr");
    const displayBal = document.getElementById("displaybal");
  
    const logout = () => {
        addr.innerText = "";
        displayBal.innerText = "";
        addr.style.display = "None";
        connectButton.innerText = "Connect";
    }
    
    const connectHandler = (ev) => {
      // we automatically try to populate address and balance if metamask is connected.
    }
  
    const accountsChangedHandler = (accounts) => {
        if (accounts.length) {
          addr.innerText = accounts[0];
          getBalance(accounts[0]);
        } else {
          logout();
        }
    }
  
    const chainChangedHandler = (chainId) => {
        clearListeners();
        window.location.reload();
    }

    const clearListeners = () => {
        ethereum.removeListener('connect', connectHandler);
        ethereum.removeListener('accountsChanged', accountsChangedHandler);
        ethereum.removeListener('chainChanged', chainChangedHandler);
    }
  
    const getBalance = async (account) => {
        const bal = await web3.eth.getBalance(account);
    
    
        // alternative way without using web3
        // const balInHex = await ethereum.request({ method: 'eth_getBalance', params: [account] });
        // const bal = web3.utils.hexToNumberString(balInHex)
        displayBal.innerText = web3.utils.fromWei(bal, "ether");
        addr.style.display = "";
    }
    
    const onClickConnect = async () => {
        try {
    
            if (connectButton.innerText == "Connect") {
              connectButton.disabled = true;
    
              // Will open the MetaMask UI
              await ethereum.request({ method: 'eth_requestAccounts' });
              connectButton.disabled = false;
    
              //fetch user accounts.
              const accounts = await ethereum.request({ method: 'eth_accounts' });
              connectButton.innerText = "Disconnect";
    
              //We take the first address in the array of addresses and display it
              accountsChangedHandler(accounts);
            } else {
              logout();
            }
        } catch (error) {
            console.error(error);
        }
    };
  
    const isMetaMaskInstalled = () => {
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };
  
    const metaMaskClientCheck = () => {
        //Now we check to see if MetaMask is installed
        if (!isMetaMaskInstalled()) {
          //The button is now disabled
          connectButton.disabled = true;
          alert("Metamask not installed");
        } else {
    
          // attach click handler
          connectButton.onclick = onClickConnect;
    
          //If it is installed we change our button text
          connectButton.disabled = false;
    
          // instantiate web3, here we are using window.ethereum injected by metamask as our provider.
          window.web3 = new Web3(window.ethereum);
    
    
          // listening to events
          ethereum.on('connect', connectHandler);
          ethereum.on('accountsChanged', accountsChangedHandler);
          ethereum.on('chainChanged', chainChangedHandler);
        }
    };

    metaMaskClientCheck();
  };
  
  // this ensure that intialize is called after our dom content has been loaded.
  window.addEventListener('DOMContentLoaded', initialize);