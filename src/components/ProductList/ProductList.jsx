import { useEffect, useState } from 'react';
import { fetchProducts } from '../../utils/products';
import './product-list.css'
import Product from '../Product';
import Skeleton from '../Skeleton';

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [query, setQuery] = useState('');

	async function fetchElements() {
		const { hash } = new URL(window.location.href);
		const q = atob(hash.replace("#", ""));
		setQuery(q);
		const products = await fetchProducts(q);
		setProducts(products);
	}

	useEffect(() => {
		fetchElements()
	}, []);

	function buttonBack() {
		window.history.back();
	}

	return (
		<div>
			<div className='product-list__heading'>
				<img className='product-list__icon-back'
					src='/img/icons/flip-backward-dark.svg' 
					onClick={buttonBack} />
				<h2 className=''>Your Pick</h2>
				<h3>{query}</h3>
			</div>
			<ul className='product-list'>
			{ products.length ? (
					products.map((product) => (
						<Product {...product} />
				))
				) : (
					<>
					{[1,2,3,4,5].map((i) => (
						<Skeleton key={i} />
					))}
					</>
				)
			}
			</ul>
		</div>
	)
}

export default ProductList;