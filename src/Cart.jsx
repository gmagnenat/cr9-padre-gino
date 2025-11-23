import { Link } from '@tanstack/react-router';
import { intl } from './utils/currency';

export default function Cart({ cart, checkout }) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const current = cart[i];
    total += current.pizza.sizes[current.size];
  }

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <>
          <p>Your cart is empty</p>
          <Link to="/order">Start adding Pizzas to your cart</Link>
        </>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <span className="size">{item.size}</span> -
                <span className="type">{item.pizza.name}</span> -
                <span className="price">{item.price}</span>
              </li>
            ))}
          </ul>

          <p>Total: {intl.format(total)}</p>
          <button onClick={checkout}>Checkout</button>
        </>
      )}
    </div>
  );
}
