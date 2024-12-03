// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'
import SimilarProductItem from '../SimilarProductItem'
import {BsPlusSquare} from 'react-icons/bs'
import {BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: '',
    similarProductsList: [],
    itemsCount: 1,
    apiStatus: apiStatusConstants.initial,
  }
  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok) {
      const {similar_products, ...productItemDetails} = data
      const formattedProductItemDetails = {
        id: productItemDetails.id,
        imageUrl: productItemDetails.image_url,
        title: productItemDetails.title,
        description: productItemDetails.description,
        price: productItemDetails.price,
        brand: productItemDetails.brand,
        totalReviews: productItemDetails.total_reviews,
        rating: productItemDetails.rating,
        availability: productItemDetails.availability,
      }
      const similarProducts = data.similar_products.map(eachProduct => ({
        id: eachProduct.id,
        imageUrl: eachProduct.image_url,
        title: eachProduct.title,
        description: eachProduct.description,
        price: eachProduct.price,
        brand: eachProduct.brand,
        totalReviews: eachProduct.total_reviews,
        rating: eachProduct.rating,
        availability: eachProduct.availability,
      }))
      this.setState({
        productItemDetails: formattedProductItemDetails,
        similarProductsList: similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecrementCount = () => {
    const {itemsCount} = this.state
    if (itemsCount > 1) {
      this.setState(prevState => ({itemsCount: prevState.itemsCount - 1}))
    }
  }
  onIncrementCount = () => {
    this.setState(prevState => ({itemsCount: prevState.itemsCount + 1}))
  }

  onClickShopping = () => {
    const {history} = this.props
    history.push('/products')
  }

  renderProductLoadingView = () => {
    return (
      <div data-testid="loader" className="failure-container">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    )
  }

  renderProductFailureView = () => {
    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-view"
        />
        <h1 className="failure-head">Product Not Found</h1>
        <button className="failure-btn" onClick={this.onClickShopping}>
          Continue Shopping
        </button>
      </div>
    )
  }

  renderProductItemDetails = () => {
    const {productItemDetails, similarProductsList, itemsCount} = this.state
    const {
      id,
      imageUrl,
      title,
      price,
      brand,
      totalReviews,
      rating,
      availability,
      description,
    } = productItemDetails
    return (
      <div className="product-item-details-container">
        <div className="product-item-details-sub-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="details-container">
            <h1 className="title">{title} </h1>
            <p className="price">Rs {price}/- </p>
            <div className="rating-and-reviews-container">
              <button className="rating-btn">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </button>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description} </p>
            <p className="available">
              <span className="brand">Available: </span>
              {availability}
            </p>
            <p className="available">
              <span className="brand">Brand: </span>
              {brand}
            </p>
            <hr className="hr-line" />
            <div className="count-container">
              <button
                onClick={this.onDecrementCount}
                className="btn"
                data-testid="minus"
              >
                <BsDashSquare />
              </button>

              <p className="count">{itemsCount} </p>
              <button
                onClick={this.onIncrementCount}
                className="btn"
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-to-cart-btn">ADD TO CART</button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-head">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProductsList.map(eachProduct => (
              <SimilarProductItem
                eachProduct={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductsResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderProductFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProductLoadingView()
      default:
        return null
    }
  }
  render() {
    const {productItemDetails, similarProductsList, itemsCount, apiStatus} =
      this.state
    const {
      id,
      imageUrl,
      title,
      price,
      brand,
      totalReviews,
      rating,
      availability,
      description,
    } = productItemDetails
    return (
      <div>
        <Header />
        {this.renderProductsResult()}
      </div>
    )
  }
}

export default ProductItemDetails
