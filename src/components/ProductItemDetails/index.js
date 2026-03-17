import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    apiStatus: apiStatusConstants.loading,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match

    const apiUrl = `https://apis.ccbp.in/products/${params.id}`

    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const updatedProduct = {
        id: data.id,
        title: data.title,
        price: data.price,
        imageUrl: data.image_url,
        description: data.description,
        brand: data.brand,
        rating: data.rating,
        availability: data.availability,
        totalReviews: data.total_reviews,
      }

      const updatedSimilar = data.similar_products.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.image_url,
        rating: item.rating,
        brand: item.brand,
      }))

      this.setState({
        productDetails: updatedProduct,
        similarProducts: updatedSimilar,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  increment = () => {
    this.setState(prev => ({quantity: prev.quantity + 1}))
  }

  decrement = () => {
    this.setState(prev => ({
      quantity: prev.quantity > 1 ? prev.quantity - 1 : 1,
    }))
  }

  renderSuccess = () => {
    const {productDetails, similarProducts, quantity} = this.state

    return (
      <div className="product-details-container">
        <img src={productDetails.imageUrl} alt="product" />

        <div>
          <h1>{productDetails.title}</h1>
          <p>Rs {productDetails.price}/-</p>

          <div>
            <p>{productDetails.rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
            />
          </div>

          <p>{productDetails.description}</p>
          <p>Available: {productDetails.availability}</p>
          <p>Brand: {productDetails.brand}</p>

          {/* QUANTITY */}
          <div>
            <button data-testid="minus" onClick={this.decrement}>
              <BsDashSquare />
            </button>

            <p>{quantity}</p>

            <button data-testid="plus" onClick={this.increment}>
              <BsPlusSquare />
            </button>
          </div>

          <button type="button">ADD TO CART</button>
        </div>

        {/* SIMILAR PRODUCTS */}
        <h1>Similar Products</h1>
        <ul>
          {similarProducts.map(item => (
            <SimilarProductItem key={item.id} product={item} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailure = () => {
    const {history} = this.props
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1>Product Not Found</h1>
        <button onClick={() => history.replace('/products')}>
          Continue Shopping
        </button>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    return (
      <>
        <Header />

        {apiStatus === apiStatusConstants.loading && this.renderLoader()}
        {apiStatus === apiStatusConstants.success && this.renderSuccess()}
        {apiStatus === apiStatusConstants.failure && this.renderFailure()}
      </>
    )
  }
}

export default ProductItemDetails
