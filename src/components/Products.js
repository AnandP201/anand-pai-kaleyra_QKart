import { Search } from "@mui/icons-material";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import {
  CircularProgress,
  Grid,
  Stack,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Cart, { generateCartItemsFrom } from "./Cart";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard"
import "./Products.css";

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


const Products = () => {

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {


    performAPICall().then((res) => {
      if (res && res.status === 200) {
        setProducts(res.data)
        setIsLoading(false)
      }
    })

    const token = localStorage.getItem('token')
    fetchCart(token).then((data) => {
      setCart(data)
    })

    // eslint-disable-next-line
  }, [])


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {

    return axios.get(`${config.endpoint}/products`).then((res) => {
      return res;
    }).catch((error) => {
      if (error.response === undefined) {
        enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.', { variant: 'error' })
        setIsLoading(false)
      }
    })

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {

    axios.get(`${config.endpoint}/products/search?value=${text}`).then((res) => {
      setProducts(res.data)
    }).catch((err) => {
      if (err.response === undefined) {
        enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.')
      }
      if (err.response.status === 404) {
        setProducts([])
      }
    })
  };

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        return response.data
      }





    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {

    if (cart.find(item => item.productId === productId)) return true
    return false

  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (token, items, products, productId, qty, options = { preventDuplicate: false }) => {
    // implementation of updating quantity
    let body = {}
    if (productId && qty !== undefined) {

      body = {
        productId: productId,
        qty: qty
      }

    } else {

      if (isItemInCart(cart, productId)) {
        enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.', { variant: 'warning' })
      }
      body = {
        productId: productId,
        qty: 1
      }

    }
    const response = await axios.post(`${config.endpoint}/cart`, body, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch((e) => {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    })

    if (response && response.status === 200) {
      setCart(response.data)
    }





  };


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    setTimeout(() => {
      performSearch(event.target.value)
    }, debounceTimeout)
  };







  return (
    <div>
      <Header hasHiddenAuthButtons={true} children={{ viewSearchBar: true, callApi: debounceSearch }} />
      <Box className="search-mobile">
        <OutlinedInput
          id="outlined-adornment-search"
          fullWidth
          placeholder="Search for items/categories"
          onChange={(ev) => {
            debounceSearch(ev, 500)

          }}
          size="small"
          endAdornment={
            <InputAdornment position="end">
              <Search style={{ color: "#00a278" }} />
            </InputAdornment>
          }
        />
      </Box>
      <Grid container>
        <Grid item className="product-grid" md={localStorage.getItem('username') ? 8 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          <Box padding={2}>
            {isLoading &&
              <Stack spacing={2} className="loading">
                <CircularProgress color="success" />
                <div>Loading Products....</div>
              </Stack>
            }
            {
              !isLoading
              && products.length === 0
              && <Stack spacing={2} className="loading">
                <SentimentDissatisfiedIcon />
                <div>No products found</div>
              </Stack>
            }
            {!isLoading &&
              <Grid container spacing={2} mt={2}>
                {
                  products.map((item, index) => {
                    return <Grid item xs={6} md={3} key={index}>
                      <ProductCard product={item} handleAddToCart={addToCart} />
                    </Grid>
                  })
                }
              </Grid>}
          </Box>
        </Grid>
        {
          localStorage.getItem('username') && <Grid item md={4} style={{ backgroundColor: "#E9F5E1" }}>
            <Cart products={products} items={generateCartItemsFrom(cart, products)} handleQuantity={addToCart} />
          </Grid>
        }
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
