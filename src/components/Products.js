import { LinearProgress, Grid } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";
import { useSnackbar } from "notistack";

const Products = () => {
  let [productsData, setProductsData] = useState([]);
  let [loading, setLoading] = useState(true);
  let [searchBar1Values, setSearchBar1Values] = useState("");
  let [searchBar2Values, setSearchBar2Values] = useState("");
  let [debounceTimeout, setDebounceTimeout] = useState(0);
  let [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  let [cartFullItems, setCartFullItems] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  // Handler Functions
  const handleSearchBar1 = (event) => {
    setSearchBar1Values(event.target.value);
  };
  const handleSearchBar2 = (event) => {
    setSearchBar2Values(event.target.value);
  };

  //Mounting Functions
  useEffect(() => {
    async function onLoadHandler() {
      let products = await fetchProducts();
      let cart = await getCart();
      console.log(cart)
      // let result = await generateCartItemsFrom(cart, products);
      setCartFullItems(cart.cartItems);
    }
    onLoadHandler();
  }, []);
  useEffect(() => {
    if (localStorage.getItem("username") !== null) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, []);

  //Normal Functions
  async function fetchProducts() {
    try {
      let response = await axios.get(`${config.endpoint}/products`);
      if (response.status === 200) {
        setLoading(false);
        setProductsData(response.data);
        return response.data;
      }
    } catch (error) { }
  }
  async function fetchApi(productName) {
    try {
      let url = "/products/search?value=";
      let response = await axios.get(`${config.endpoint}${url}${productName}`);
      if (response.status === 200) {
        setProductsData(response.data);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setProductsData(error.response.data);
      }
    }
  }
  async function getCart() {
    if (localStorage.getItem("username") !== null) {
      try {
        let token = localStorage.getItem("token");
        let response = await axios.get(`${config.endpoint}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 400) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Please check if the backend server is running , reachable and returns a valid JSON.", { autoHideDuration: 3000 }
          );
        }
      }
    } else {
      return [];
    }
  }
  // function updateCartItems(cart, product) {
  //   let result = generateCartItemsFrom(cart, product);
  //   setCartFullItems(result);
  // }
  const handleIncreaseAndDecreaseOfQuantity = async (index, type) => {
    let currArr = structuredClone(cartFullItems);
    if (type === 'increment') {
      console.log(currArr[index])
      currArr[index].quantity += 1;
      setCartFullItems(currArr);
      await axios.put(`${config.endpoint}/cart`, { productId: currArr[index].product._id, quantity: currArr[index].quantity }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    }
    else if (type === 'decrement') {
      let currArr = structuredClone(cartFullItems);
      if (currArr[index].quantity === 1) {
        let newArr = [];
        for (let i = 0; i < currArr.length; i++) {
          if (index !== i) newArr.push(currArr[i])
          setCartFullItems(newArr);
        }
        await axios.put(`${config.endpoint}/cart`, { productId: currArr[index].product._id, quantity: 0 }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      }
      else {
        currArr[index].quantity -= 1;
        setCartFullItems(currArr);
        await axios.put(`${config.endpoint}/cart`, { productId: currArr[index].product._id, quantity: currArr[index].quantity }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      }
    }
    else {
      console.log("UNKNOWN TYPE!");
    }

    // let obj = { productId: id, qty: updatedQty };
    // let response = await postCart(obj);
    // console.log(response);
    // let result = await generateCartItemsFrom(response, productsData);
    // setCartFullItems(result);
  };
  const postCart = async (cardDetails) => {
    if (localStorage.getItem("email") !== null) {
      try {
        let token = localStorage.getItem("token");
        let response = await axios.post(
          `${config.endpoint}/cart`,
          cardDetails,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) { }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning", autoHideDuration: 2000
      });
      return null;
    }
  };
  const isItemInCard = (cardDetails) => {
    for (let i = 0; i < cartFullItems.length; i++) {
      if (cartFullItems[i].product._id === cardDetails.productId) {
        return true;
      }
    }
    return false;
  };

  const makeCartObject = (cardDetails) => {
    for (let i = 0; i < productsData.length; i++) {
      if (productsData[i]._id === cardDetails.productId) {
        return {
          product: productsData[i],
          quantity: cardDetails.qty,
          productId: cardDetails.productId,
          _id: cardDetails.productId
        }
      }
    }
  }
  const addToCartHandler = async (cartDetails) => {
    let result = isItemInCard(cartDetails);
    if (result) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning", autoHideDuration: 2000 }
      );
    } else {
      let cartObj = makeCartObject(cartDetails);
      let currArr = structuredClone(cartFullItems);
      currArr.push(cartObj);
      setCartFullItems(currArr);
      const payload = { productId: cartDetails.productId, quantity: cartDetails.qty };
      await postCart(payload);
      enqueueSnackbar(
        "Item added to your cart", { variant: "success", autoHideDuration: 1500 }
      );
    }
  };
  // Component Did Update Functions
  useEffect(() => {
    if (searchBar1Values !== "") {
      if (debounceTimeout !== 0) {
        clearTimeout(debounceTimeout);
      }
      let newTimeout = setTimeout(() => fetchApi(searchBar1Values), 500);
      setDebounceTimeout(newTimeout);
    }
    if (searchBar2Values !== "") {
      if (debounceTimeout !== 0) {
        clearTimeout(debounceTimeout);
      }
      let newTimeout = setTimeout(() => fetchApi(searchBar2Values), 500);
      setDebounceTimeout(newTimeout);
    }
  }, [searchBar1Values, searchBar2Values]);

  return (
    <div>
      <Header
        hasHiddenAuthButtons="products"
        searchBarImplementations={{
          searchBar1: searchBar1Values,
          searchBar1Handler: handleSearchBar1,
          searchBar2: searchBar2Values,
          searchBar2Handler: handleSearchBar2,
        }}
      ></Header>
      <Grid container>
        <Grid
          item
          className="product-grid"
          xs={12}
          md={isUserLoggedIn === true ? 9 : 12}
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          <Grid container spacing={2} className="grid-container">
            {loading === true ? (
              <>
                <LinearProgress
                  color="success"
                  className="progress"
                  fullwidth="true"
                />
                <Box justifyContent="center" className="loading-text-wrapper">
                  <p className="progress2">Loading Products...</p>
                </Box>
              </>
            ) : productsData.length !== 0 ? (
              productsData.map((item) => {
                return (
                  <Grid item md={4} xs={6} xl={2} key={item["_id"]}>
                    <ProductCard
                      product={item}
                      handleAddToCart={addToCartHandler}
                    />
                  </Grid>
                );
              })
            ) : (
              <>
                <div className="centerDissatisfaction">
                  <SentimentDissatisfiedIcon />
                </div>

                <p className="centerDissatisfaction">No Products Found</p>
              </>
            )}
          </Grid>
        </Grid>
        {isUserLoggedIn && (
          <Grid item md={3} xs={12} className="grid-cart">
            <Cart items={cartFullItems} handleQuantity={handleIncreaseAndDecreaseOfQuantity} />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
