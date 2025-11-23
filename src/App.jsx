import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PizzaOfTheDay from './PizzaOfTheDay';
import Order from './Order';
import Header from './Header';
import { CartContext } from './contexts';

const App = () => {
  const cartHook = useState([]);
  return (
    <StrictMode>
      <CartContext value={cartHook}>
        <div>
          <Header />
          <Order />
          <PizzaOfTheDay />
        </div>
      </CartContext>
    </StrictMode>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
