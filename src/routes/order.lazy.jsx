import { useState, useEffect, useContext } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import Pizza from '../Pizza';
import Cart from '../Cart';
import { CartContext } from '../contexts';
import { intl } from '../utils/currency';

export const Route = createLazyFileRoute('/order')({
  component: Order,
});

export default function Order() {
  const [pizzaType, setPizzaType] = useState('pepperoni');
  const [pizzaSize, setPizzaSize] = useState('M');
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [cart, setCart] = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function checkout() {
    setLoading(true);

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });

      setCart([]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(`We couldn't load your order. Please try again later.`);
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchPizzaTypes() {
      try {
        const pizzasRes = await fetch('/api/pizzas');

        if (pizzasRes.ok) {
          const pizzaJson = await pizzasRes.json();
          setPizzaTypes(pizzaJson);
          setLoading(false);
        } else {
          setLoading(false);
          setError(`Failed to load pizzas. Please try again later.`);
          console.error(pizzasRes);
        }
      } catch (error) {
        setLoading(false);
        setError(`Failed to connect. Please check your internet connection.`);
        console.error(error);
      }
    }

    fetchPizzaTypes();
  }, []);

  let price, selectedPizza;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = intl.format(
      selectedPizza.sizes ? selectedPizza.sizes[pizzaSize] : '',
    );
  }

  return (
    <div className="order-page">
      <div className="order">
        <h2>Create Order</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCart([
              ...cart,
              {
                pizza: selectedPizza,
                size: pizzaSize,
                price,
                id: Date.now() + Math.random(),
              },
            ]);
          }}
        >
          <div>
            <div>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                onChange={(e) => setPizzaType(e.target.value)}
                name="pizza-type"
                value={pizzaType}
              >
                {pizzaTypes.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pizza-size">Pizza Size</label>
              <div>
                <span>
                  <input
                    onChange={(e) => setPizzaSize(e.target.value)}
                    checked={pizzaSize === 'S'}
                    type="radio"
                    name="pizza-size"
                    value="S"
                    id="pizza-s"
                  />
                  <label htmlFor="pizza-s">Small</label>
                </span>
                <span>
                  <input
                    onChange={(e) => setPizzaSize(e.target.value)}
                    checked={pizzaSize === 'M'}
                    type="radio"
                    name="pizza-size"
                    value="M"
                    id="pizza-m"
                  />
                  <label htmlFor="pizza-m">Medium</label>
                </span>
                <span>
                  <input
                    onChange={(e) => setPizzaSize(e.target.value)}
                    checked={pizzaSize === 'L'}
                    type="radio"
                    name="pizza-size"
                    value="L"
                    id="pizza-l"
                  />
                  <label htmlFor="pizza-l">Large</label>
                </span>
              </div>
            </div>
            <button type="submit">Add to Cart</button>
          </div>
          {loading ? (
            <h3>LOADING …</h3>
          ) : (
            !error &&
            selectedPizza && (
              <div className="order-pizza">
                <Pizza
                  name={selectedPizza.name}
                  description={selectedPizza.description}
                  image={selectedPizza.image}
                />
                <p>{price}</p>
              </div>
            )
          )}
        </form>
        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}
      </div>
      {loading ? <h2>LOADING...</h2> : <Cart checkout={checkout} cart={cart} />}
    </div>
  );
}
