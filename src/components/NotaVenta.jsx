import { useState } from 'react'
import Cart from './Cart'
import ProductCard from './ProductCard'
import SectionPage from './SectionPage'
import './NotaVenta.css'

const products = [
  { id: 1, name: 'Hamburguesa', price: 8000, icon: '🍔' },
  { id: 2, name: 'Pancho', price: 4500, icon: '🌭' },
  { id: 3, name: 'Pepsi', price: 3000, icon: '🥤' },
  { id: 4, name: 'Fernet', price: 7000, icon: '🥃' },
  { id: 5, name: 'Chocotorta', price: 3500, icon: '🍰' },
  { id: 6, name: 'Postre Oreo', price: 4000, icon: '🍪' },
]

function NotaVenta() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart((currentCart) => {
      const itemExists = currentCart.find((item) => item.id === product.id)

      if (itemExists) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    )
  }

  return (
    <SectionPage
      eyebrow="Ventas"
      title="Nota de venta"
      description="Registrá los productos y el pago de una nueva venta."
      icon="NV"
      color="blue"
    >
      <div className="sales-area">
        <div className="products-heading">
          <div>
            <h2>Productos</h2>
            <p>Seleccioná un producto para agregarlo al carrito.</p>
          </div>
          <span>{products.length} disponibles</span>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addToCart}
            />
          ))}
        </div>

        <Cart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onClear={() => setCart([])}
        />
      </div>
    </SectionPage>
  )
}

export default NotaVenta
