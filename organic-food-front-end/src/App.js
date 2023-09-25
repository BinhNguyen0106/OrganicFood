import './App.css';
import { useState, useEffect, useRef } from 'react';
import Web3 from 'web3';
import ContractArtifact from './OrganicFood.json';

function App() {
  const [msg, setMsg] = useState("");
  const [metaMaskAccount, setMetaAccount] = useState("");
  const checkWallet = async() => {
    //check if MetaMask is installed in the browser
    if(window.ethereum){
      setMsg("Wallet Found");
    } else {
      setMsg("Please install MetaMask");
    }
  };

  //Run CheckWallet on Page Loading
  useEffect(() => {
    checkWallet();
  }, []);
  
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const readSmartContract = async() => {
    if(window.ethereum){
      // if MetaMask found, request Connection to the Wallet Accounts(log in)
      const accounts = await web3.eth.requestAccounts();
      setMetaAccount(accounts[0]);
    } else {
      //If no wallet
      alert("Get MetaMask to connect");
    }
  };

  const contractABI = ContractArtifact.abi;
  const contractAddress = ContractArtifact.networks[5777].address;
  const OrganicFoodContract = new web3.eth.Contract(contractABI, contractAddress);
  const [resultList, setResultList] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAllOrganic, setIsAllOrganic] = useState(false);
  const [isSearchResult, setSearchResult] = useState(false);
  
  const productId = useRef(null);
  const searchString = useRef(null);
  const inputAccount = useRef(null);
  const [dropdownValue, setDropdownValue] = useState(0);

  const setMetamaskAccount = () => {
    setMetaAccount(inputAccount.current.value);
  }

  /*Pre-condition: create data
  In this project, I did hard code data using data variable*/
  let data = [
    {
      productName: 'Lemon',
      productCode: '001',
      naturalFertilizer: true,
      chemical: false,
      nutrients: true,
      farmer: 'Mike',
      location: 'Moose Jaw'
    },
    {
      productName: 'Carrot',
      productCode: '002',
      naturalFertilizer: true,
      chemical: false,
      nutrients: true,
      farmer: 'Mike',
      location: 'Moose Jaw'
    },
    {
      productName: 'Cabbage',
      productCode: '003',
      naturalFertilizer: true,
      chemical: false,
      nutrients: true,
      farmer: 'Mike',
      location: 'Regina'
    },
    {
      productName: 'Spinach',
      productCode: '004',
      naturalFertilizer: true,
      chemical: false,
      nutrients: true,
      farmer: 'Mike',
      location: 'Moose Jaw'
    },
    {
      productName: 'Potato',
      productCode: '005',
      naturalFertilizer: true,
      chemical: false,
      nutrients: true,
      farmer: 'Mike',
      location: 'Regina'
    },
    {
      productName: 'Tomato',
      productCode: '006',
      naturalFertilizer: true,
      chemical: false,
      nutrients: true,
      farmer: 'Nick',
      location: 'Saskatoon'
    },
    {
      productName: 'Sweet Potato',
      productCode: '007',
      naturalFertilizer: true,
      chemical: false,
      nutrients: true,
      farmer: 'Mike',
      location: 'Moose Jaw'
    },
    {
      productName: 'Cilantro',
      productCode: '008',
      naturalFertilizer: false,
      chemical: false,
      nutrients: true,
      farmer: 'Mike',
      location: 'Moose Jaw'
    },
    {
      productName: 'Green Onion',
      productCode: '009',
      naturalFertilizer: true,
      chemical: false,
      nutrients: false,
      farmer: 'Nick',
      location: 'Saskatoon'
    },
    {
      productName: 'Bok Choy',
      productCode: '010',
      naturalFertilizer: true,
      chemical: false,
      nutrients: true,
      farmer: 'Mike',
      location: 'Saskatoon'
    },
  ]
  
  // Create a set of testing data
  const createData = async() => {
    try {
      for(var i = 0; i < data.length; i++){
        await OrganicFoodContract.methods
                                .createProduct(data[i].productName, 
                                  data[i].productCode,
                                  data[i].naturalFertilizer,
                                  data[i].chemical,
                                  data[i].nutrients,
                                  data[i].farmer,
                                  data[i].location,)
                                .send({from:metaMaskAccount});
      }
    }catch (error){
      alert(error);
    }
  }

  // List all added data
  const getProductData = async() => {
    try{
      const rslt = await OrganicFoodContract.methods.listAllProducts().call();
      setResultList(rslt);
      setIsLoading(true);
      setIsAllOrganic(false);
      setSearchResult(false);
    } catch (error) {
      alert(error);
    }
  }

  /*Feature 1: Check if product is organic*/
  const checkOrganicProduct = async() => {
    await OrganicFoodContract.methods
                              .checkProductOrganic(productId.current.value)
                              .call()
                              .then( function( rslt ) {
                                console.log("info: ", rslt);
                                document.getElementById('checkedInfo').innerHTML = rslt;
                              });
  }

  /*Feature 2: List all organic product*/
  const collectOrganicProductInList = async() => {
    try{
      await OrganicFoodContract.methods.verifyOrganicList().send({from:metaMaskAccount});
    } catch(error){
      alert(error)
    }
  }

  const getOrganicProductData = async() => {
    try {
      setIsAllOrganic(true);
      setSearchResult(false);
      setIsLoading(false);
      const rslt = await OrganicFoodContract.methods.listAllOrganicProducts().call();
      setResultList(rslt);
    } catch (error) {
      alert(error);
    }
    
  }

  /*Feature 3: Search*/
  const handleDropdownChange = (e) => {
    setDropdownValue(e.target.value);
  }

  const search = async() => {
    try {
      await OrganicFoodContract.methods
                              .search(searchString.current.value, dropdownValue)
                              .send({from:metaMaskAccount});
      const rslt = await OrganicFoodContract.methods.getSearchResult().call();
      setResultList(rslt);
    } catch (error) {
      alert(error);
    }
    setSearchResult(true);
    setIsLoading(false);
    setIsAllOrganic(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {/*If the Wallet is connected to an Account returns the message. Else show connect button*/
            metaMaskAccount ? (
              msg
            ) : (
              <div>
                <button onClick={readSmartContract}> Connect to MetaMask </button>
                <input ref={inputAccount} placeholder='Enter account'/>
                <button onClick={setMetamaskAccount}>Set Account</button>
              </div>
            )
          }
        </p>
        <a className="App-link">
          ORGANIC FOOD PROJECT
        </a>
      </header>
      <body className="App-body">
        <div className="container">
          <a>Pre-condition</a>
          <div>
            <button onClick={createData}>1. Create list of products</button>
            <button onClick={getProductData}>2. List all products</button>
          </div>
          <a>Feature 1: Check if product is organic</a>
          <div>
            <table>
              <tr>
                <td>
                  <input ref={productId} placeholder='Enter product code'/>
                </td>
                <td>
                  <button onClick={checkOrganicProduct}>Check</button>
                </td>
                <td>
                  <label id="checkedInfo">Result</label>
                </td>
              </tr>
            </table>
          </div>
          <a>Feature 2: List all organic product</a>
          <div>
            <button onClick={collectOrganicProductInList}>1. Collect organic product in list</button>
            <button onClick={getOrganicProductData}>2. List organic products</button>
          </div>
          <a>Feature 3: Search</a>
          <div>
            <table>
              <tr>
                <td>
                  <input ref={searchString} placeholder='Enter search value'/>
                </td>
                <td>
                  <select value={dropdownValue} id = "dropdown" onChange={handleDropdownChange}>
                    <option selected value="0">All products</option>
                    <option value="1">Organic products</option>
                    <option value="2">Product ID</option>
                    <option value="3">Farmer</option>
                    <option value="4">Location</option>
                  </select>
                </td>
                <td>
                  <button onClick={search}>Search</button>
                </td>
              </tr>
            </table>
          </div>
          <h1 className="title">Result Table</h1>
          <table>
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Natural Fertilizer</th>
                <th>Chemicals</th>
                <th>Nutrients</th>
                <th>Farmer</th>
                <th>Location</th>
              </tr>
            </thead>
          
            {isLoading && 
              <tbody>
                {resultList.map(({ name, productId, isNaturalFertilizer, isChemical, isNutrients, farmer, location }) => (
                  <tr key={productId}>
                  <td>{String(productId)}</td>
                  <td>{name}</td>
                  <td>{String(isNaturalFertilizer)}</td>
                  <td>{String(isChemical)}</td>
                  <td>{String(isNutrients)}</td>
                  <td>{farmer}</td>
                  <td>{location}</td>
                </tr>
                ))}
              </tbody>
            }
            {isAllOrganic && 
              <tbody>
                {resultList.map(({ name, productId, isNaturalFertilizer, isChemical, isNutrients, farmer, location }) => (
                  <tr key={productId}>
                  <td>{String(productId)}</td>
                  <td>{name}</td>
                  <td>{String(isNaturalFertilizer)}</td>
                  <td>{String(isChemical)}</td>
                  <td>{String(isNutrients)}</td>
                  <td>{farmer}</td>
                  <td>{location}</td>
                </tr>
                ))}
              </tbody>
            }
            {isSearchResult && 
              <tbody>
                {resultList.map(({ name, productId, isNaturalFertilizer, isChemical, isNutrients, farmer, location }) => (
                  <tr key={productId}>
                  <td>{String(productId)}</td>
                  <td>{name}</td>
                  <td>{String(isNaturalFertilizer)}</td>
                  <td>{String(isChemical)}</td>
                  <td>{String(isNutrients)}</td>
                  <td>{farmer}</td>
                  <td>{location}</td>
                </tr>
                ))}
              </tbody>
            }
          </table>  
        </div>
      </body>
      <footer>
        <p class="text-center">Copyright 2023 - Thanh Binh Nguyen, Arashdeep Kaur</p>
      </footer>
    </div>
  );

  
}

export default App;