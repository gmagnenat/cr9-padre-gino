import { useState } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PizzaOfTheDay from '../PizzaOfTheDay';
import Header from '../Header';
import { CartContext } from '../contexts';

function RootComponent() {
  const cartHook = useState([]);
  return (
    <>
      <CartContext value={cartHook}>
        <div>
          <Header />
          <Outlet />
          <PizzaOfTheDay />
        </div>
      </CartContext>
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
