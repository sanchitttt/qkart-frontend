import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart}) => {
  const addToCartClickHandler = ()=>{
    let cartItemsDetails={
      "productId":product["_id"],
      "qty":1
    }
    handleAddToCart(cartItemsDetails);
  }

  return (
    <Card className="card">
      <CardMedia 
      component="img"
      height="270px"
      image={product.image}
      alt="img"
      />
      <CardContent>
        <Typography variant="body1">{product.name}</Typography>
        <Typography variant="body1" className="cost">${product.cost}</Typography>
        <Rating name="read-only" value={product.rating} readOnly />
<br />
<Button variant="contained" className="card-button card-actions" onClick={addToCartClickHandler}><AddShoppingCartOutlined />ADD TO CART</Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
