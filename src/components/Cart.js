import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
import {Typography} from "@mui/material";



// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
Array.prototype.removeDuplicates = function() {
  var arr = this.concat(); // create a clone from the input so not to change the source
  //create the first cycle of the loop starting from element 0 or n
  for(var i=0; i<arr.length; ++i) { 
      //create the second cycle of the loop from element n+1
      for(var j=i+1; j<arr.length; ++j) { 
          //if the two elements are equal , then they are duplicate
          if(arr[i] === arr[j]) {
              arr.splice(j, 1); //remove the duplicated element 
          }
      }
  }
  return arr;
}
export const generateCartItemsFrom = (cartData, productsData) => {
  let filteredArray = cartData.map((item)=>{
    for(let i =0;i<productsData.length;i++){
      if(item.productId===productsData[i]["_id"]){
        let combinedArray = {...item,...productsData[i]};
        return combinedArray;
      }
    }
  });
  filteredArray = filteredArray.removeDuplicates();
  filteredArray.forEach((item)=>{
    if(item===undefined){
      filteredArray.pop(item);
    }
  })
  return filteredArray;
  
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items) => {
  let totalCost=0;
    items.map((item)=> totalCost= totalCost + (item.cost*item.qty)
    )
    return totalCost;
  }


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  hideButtons
}) => {
  // console.log(hideButtons);
 
  return (
    hideButtons===undefined? <Stack direction="row" alignItems="center">
    <IconButton size="small" color="primary" onClick={handleDelete}>
      <RemoveOutlined />
    </IconButton>
    <Box padding="0.5rem" data-testid="item-qty">
      {value}
    </Box>
    <IconButton size="small" color="primary" onClick={handleAdd}>
      <AddOutlined />
    </IconButton>
  </Stack>: <Box padding="0.5rem" data-testid="item-qty">
      Qty: {value}
    </Box>
  );
  
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {
  let history = useHistory();
  const checkOutHandler = () =>{
    history.push("/checkout");
  }

  const getTotalItems = () =>{
    return items.length;
  }
  getTotalItems();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }
  // console.log(isReadOnly);
  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((item,index)=>{
          return(
            item.qty>0
              ?
              <Box key={index}>
              <Box display="flex" alignItems="flex-start" padding="1rem">
                <Box className="image-container">
                    <img
                        // Add product image
                        src={item.image}
                        // Add product name as alt eext
                        alt="product"
                        width="100%"
                        height="100%"
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="6rem"
                    paddingX="1rem"
                >
                    <div>{item.name}</div>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                      {isReadOnly===undefined?<ItemQuantity value={item.qty} handleAdd={async()=>await handleQuantity(items,item.productId,item.qty+1)} handleDelete={async()=>await handleQuantity(items,item.productId,item.qty-1)}
                    // Add required props by checking implementation
                    />:<ItemQuantity value={item.qty} hideButtons={true}
                    // Add required props by checking implementation
                    />}
                    
                    <Box padding="0.5rem" fontWeight="700">
                        ${item.cost}
                    </Box>
                    </Box>
                </Box>
            </Box>
               </Box>
              :<></>
          )
         
    })}
                      <Box
                      padding="1rem"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box color="#3C3C3C" alignSelf="center">
                        Order total
                      </Box>
                      <Box
                        color="#3C3C3C"
                        fontWeight="700"
                        fontSize="1.5rem"
                        alignSelf="center"
                        data-testid="cart-total"
                        padding="1rem"
                      >
                        ${getTotalCartValue(items)}
                      </Box>
                    </Box>
                    {isReadOnly===undefined?<Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={checkOutHandler}
            padding="2rem"
          >
            Checkout
          </Button>
        </Box>:<></>}
      </Box>
      {isReadOnly===true?
       <Box bgColor="#fff" className="cart">
         <Typography variant="h4" padding="1rem">Order Details</Typography>
          <Stack direction="column">
            <Box display="flex" justifyContent="space-between" padding="2rem">
              <Typography>Products</Typography>
             <Typography>{items.length}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" padding="2rem">
              <Typography>Subtotal</Typography>
              <Typography>${getTotalCartValue(items)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" padding="2rem">
              <Typography>Shipping Charges</Typography>
              <Typography>$0</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" padding="2rem">
              <Typography variant="h5">Total</Typography>
              <Typography>${getTotalCartValue(items)}</Typography>
            </Box>
          </Stack>
       </Box>:<></>}
     
    </>
  );
};

export default Cart;
