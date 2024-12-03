// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
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
  } = eachProduct

  return (
    <li className="product-item">
      <img
        src={imageUrl}
        className="product-image"
        alt={`similar product {title}`}
      />
      <p className="product-title">{title}</p>
      <p className="product-brand">by {brand}</p>
      <div className="product-price-and-rating-container">
        <p className="product-price">Rs {price} </p>
        <button className="product-btn">
          <p className="product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </button>
      </div>
    </li>
  )
}
export default SimilarProductItem
