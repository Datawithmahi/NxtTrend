import './index.css'

const SimilarProductItem = props => {
  const {product} = props
  const {title, imageUrl, price, rating, brand} = product

  return (
    <li>
      <img src={imageUrl} alt={`similar product ${title}`} />
      <p>{title}</p>
      <p>Rs {price}</p>

      <div>
        <p>{rating}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
        />
      </div>

      <p>{brand}</p>
    </li>
  )
}

export default SimilarProductItem
