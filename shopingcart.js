"use client";

import { useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { products } from "../lib/data";

export default function Home() {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Hero />

      <div className="p-6">
        <SearchBar setSearch={setSearch} />

        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
	"use client";

import { useCart } from "../../../context/CartContext";
import { products } from "../../../lib/data";

export default function ProductPage({ params }) {
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === params.id);

  return (
    <div className="p-6 grid md:grid-cols-2 gap-10">
      <img src={product.image} />

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p>{product.description}</p>
        <p className="text-xl mt-3">${product.price}</p>

        <button
          onClick={() => addToCart(product)}
          className="mt-5 bg-black text-white px-5 py-2"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
"use client";

import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, increase, decrease, remove, total } = useCart();

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between border-b py-3"
        >
          <span>{item.name}</span>

          <div>
            <button onClick={() => decrease(item.id)}>-</button>
            <span className="mx-2">{item.qty}</span>
            <button onClick={() => increase(item.id)}>+</button>
          </div>

          <span>${item.price * item.qty}</span>

          <button onClick={() => remove(item.id)}>❌</button>
        </div>
      ))}

      <h2 className="mt-6 font-bold">Total: ${total}</h2>
    </div>
  );
}
"use client";

export default function SearchBar({ setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-3 border rounded mb-6"
    />
  );
}
export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-black to-gray-700 text-white text-center py-16">
      <h1 className="text-5xl font-bold mb-4">
        Premium Online Store
      </h1>
      <p className="text-lg">Best products. Best prices.</p>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="text-2xl font-bold">ShopUltra</h1>

      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/cart">Cart ({cart.length})</Link>
      </div>
    </nav>
  );
}import "../styles/globals.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increase = (id) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decrease = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const remove = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increase, decrease, remove, total }}
    >
      {children}
    </CartContext.Provider>
  );
};
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
};
    </>
  );
}
