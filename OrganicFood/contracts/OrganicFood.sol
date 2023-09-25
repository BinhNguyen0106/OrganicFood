// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;

contract OrganicFood{
    // Initialize a struct represent to product object
    struct Product {
        string name;
        string productId;
        bool isNaturalFertilizer;
        bool isChemical;
        bool isNutrients;
        string farmer;
        string location;
    }

    // Initialize an enum represent to search type
    enum SearchType{ 
        NAMEALLPRODUCTS, //The name of all products
        NAMEORGANICFOOD, //The name of all organic products
        PRODUCTID,       //The product id
        FARMER,          //The farmer's name
        LOCATION         //The location
    }

    mapping(uint => Product) public products;
    uint public id = 0;
    Product[] allProductList;
    Product[] organicProductList;
    Product[] result;

    //Pre-condition: Create a set of products
    function createProduct(string memory name,
        string memory productId,
        bool isNaturalFertilizer,
        bool isChemical,
        bool isNutrients,
        string memory farmer,
        string memory location) public {
            id++;
            products[id] = Product(name, productId, isNaturalFertilizer, isChemical, isNutrients, farmer, location);
            allProductList.push(Product(name, productId, isNaturalFertilizer, isChemical, isNutrients, farmer, location));
        
    }

    function listAllProducts() public view returns (Product[] memory){
       return allProductList;
    }

    //FEATURE 1. Verify if a product is organic food
    /* MAIN function: Depend on input properties (isNaturalFertilizer, isChemical, isNutrients) 
        then concluding it's organic or not */
    function checkProductOrganic(string memory productId) public view returns(bool){
        for(uint i = 0; i < allProductList.length; i++){
            if(keccak256(abi.encodePacked((allProductList[i].productId))) == keccak256(abi.encodePacked((productId)))){
                if(allProductList[i].isNaturalFertilizer == true 
                && allProductList[i].isChemical == false
                && allProductList[i].isNutrients == true){
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    //FEATURE 2. List all the existing organic food
    /*Supported function: 
    1. Go through each product in inserted list 
    2. Check if that product is organic
    3. If it's organic, push to OrganicProductList*/
    function verifyOrganicList() public {
        for(uint i = 0; i < allProductList.length; i++){
            if(checkProductOrganic(allProductList[i].productId) == true){
                organicProductList.push(allProductList[i]);
            }
        }
    }

    //MAIN function: List all organic products
    function listAllOrganicProducts() public view returns (Product[] memory){
       return organicProductList;
    }

    //FEATURE 3. Search food function 
    /*Supported function: Prevent from duplicated code
    Check if input value is equal existing value in the array
    If yes, push that product to the array
    If no, skip it and continue to check next item */
    function searchGeneral(Product[] memory inputArray, string memory inputValue, SearchType searchType) private returns(Product[] memory){
        delete result;
        for(uint i = 0; i < inputArray.length; i++){
            if ((keccak256(abi.encodePacked((getProductPropertyValueBasedOnSearchType(inputArray[i], searchType)))) == 
                keccak256(abi.encodePacked((inputValue))))){
                result.push(inputArray[i]);
            }
        }
        return result;
    }

    /*Supported function: Return the property's value of input product, based on searchType*/
    function getProductPropertyValueBasedOnSearchType(Product memory prdct, SearchType searchType) private pure returns(string memory){
        if(searchType == SearchType.NAMEALLPRODUCTS)
        {
            return prdct.name;
        } 
        else if (searchType == SearchType.NAMEORGANICFOOD)
        {
            return prdct.name;
        } 
        else if (searchType == SearchType.PRODUCTID)
        {
            return prdct.productId;
        } 
        else if (searchType == SearchType.FARMER)
        {
            return prdct.farmer;
        } 
        else if (searchType == SearchType.LOCATION)
        {
            return prdct.location;
        } 
        else {
            return prdct.name;
        }
    }

    //Supported function: search by name in all product list
    function searchByNameAllProduct(string memory name) private returns(Product[] memory){
        return searchGeneral(allProductList, name, SearchType.NAMEALLPRODUCTS);
    }

    //Supported function: search by name in organic product list
    function searchByNameOrganicFood(string memory name) private returns(Product[] memory){
        return searchGeneral(organicProductList, name, SearchType.NAMEORGANICFOOD);
    }

    //Supported function: search by productId in all product list
    function searchByProductId(string memory productId) private returns(Product[] memory){
        return searchGeneral(allProductList, productId, SearchType.PRODUCTID);
    }

    //Supported function: search by farmer in all product list
    function searchByFarmer(string memory farmer) private returns(Product[] memory){
        return searchGeneral(allProductList, farmer, SearchType.FARMER);
    }

    //Supported function: search by location in all product list
    function searchByLocation(string memory location) public returns(Product[] memory){
        return searchGeneral(allProductList, location, SearchType.LOCATION);
    }

    /* MAIN function: High level action - Search product based on input string and search type*/
    function search(string memory inputString, SearchType searchType) public returns(Product[] memory){
        if(searchType == SearchType.NAMEALLPRODUCTS)
        {
            return searchByNameAllProduct(inputString);
        } 
        else if (searchType == SearchType.NAMEORGANICFOOD)
        {
            return searchByNameOrganicFood(inputString);
        } 
        else if (searchType == SearchType.PRODUCTID)
        {
            return searchByProductId(inputString);
        } 
        else if (searchType == SearchType.FARMER)
        {
            return searchByFarmer(inputString);
        } 
        else if (searchType == SearchType.LOCATION)
        {
            return searchByLocation(inputString);
        } 
        else {
            return searchByNameAllProduct(inputString);
        }
    }

    function getSearchResult() public view returns(Product[] memory){
        return result;
    }

}