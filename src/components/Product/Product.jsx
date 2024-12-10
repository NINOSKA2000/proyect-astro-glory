import { setGTMEvent } from '../../utils/helpers';
import './product.css';

const Product = ({ image_url, id, brand, price, url }) => {

	const redirect = () => {
		setGTMEvent({ 
			event: 'Product click',
			tag: 'product_clicked',
			subtag: id + ' ' + brand,
		})
		if (url) {
			window.open(url, '_blank');
		}
		return;
	}

	function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}

	function formatPrice(price) {
		const bill = "£";
		const priceWithoutBill= price.toString().replace(' GBP', "");
		return bill + numberWithCommas(priceWithoutBill);
	}

	return (
		<div className='product-card' key={id} onClick={redirect}>
			<div className='product-card__image'>
				<img src={image_url} loading='lazy' />
			</div>
			<h4 className='product-card__title'>{brand}</h4>
			{ price && (
				<button className='product-card__button'>
					<img src="/img/icons/shopping-cart.svg" />
						<span>Buy for {formatPrice(price)}</span> 
				</button>
			)}
		</div>
	)
}

export default Product;