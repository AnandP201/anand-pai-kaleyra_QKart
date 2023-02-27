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

const ProductCard = ({ product, handleAddToCart }) => {

  return (
    <Card className="card">
      <CardMedia
        component="img"
        alt="leather bag"
        height="200"
        image={product.image}
      />
      <CardContent>
        <Typography gutterBottom variant="p" component="p">
          {product.name}
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          ${product.cost}
        </Typography>
        <Rating
          name="my-rating"
          value={product.rating}
          readOnly
        />
        <Button variant="contained" className="card-button" color="success">
          <AddShoppingCartOutlined /> &nbsp; ADD TO CART
        </Button>
      </CardContent>

    </Card>
  );
};

export default ProductCard;
