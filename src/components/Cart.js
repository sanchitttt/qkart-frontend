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
import { Typography } from "@mui/material";



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

export const generateCartItemsFrom = (cartData, productsData) => {
  //console.log(cartData);
  //console.log(productsData)
  const result = [];
  console.log(cartData,productsData)
  for (let i = 0; i < cartData.cartItems.length; i++) {
    for (let j = 0; j < productsData.length; j++) {
      if (productsData[j]._id === cartData.cartItems[i].product._id) {
        result.push(cartData.cartItems[i]);
      }
    }
  }
  return result;
}



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
  let totalCost = 0;
  items.map((item) => totalCost = totalCost + (item.product.cost * item.quantity)
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
  index,
  handleQuantity,
  hideButtons
}) => {
  // //console.log(hideButtons);
  return (
    hideButtons === undefined ? <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={() => handleQuantity(index, 'decrement')}
      >
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={() => handleQuantity(index, 'increment')}>
        <AddOutlined />
      </IconButton>
    </Stack> : <Box padding="0.5rem" data-testid="item-qty">
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
  const checkOutHandler = () => {
    history.push("/checkout");
  }


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
  // //console.log(isReadOnly);
  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((item, index) => {
          return (
            <Box key={index}>
              <Box display="flex" alignItems="flex-start" padding="1rem">
                <Box className="image-container">
                  <img
                    // Add product image
                    src={item.product.image}
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
                  <div>{item.product.name}</div>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {isReadOnly === undefined ? <ItemQuantity value={item.quantity} index={index} handleQuantity={handleQuantity}
                    // Add required props by checking implementation
                    /> : <ItemQuantity value={item.quantity} hideButtons={true}
                    // Add required props by checking implementation
                    />}

                    <Box padding="0.5rem" fontWeight="700">
                      ${item.product.cost}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
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
        {isReadOnly === undefined ? <Box display="flex" justifyContent="flex-end" className="cart-footer">
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
        </Box> : <></>}
      </Box>
      {isReadOnly === true ?
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
        </Box> : <></>}

    </>
  );
};

export default Cart;
