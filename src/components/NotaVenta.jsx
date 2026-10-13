import { useState } from 'react'
import ProductCategoryMenu from '../common/ProductCategoryMenu'
import CashRegister from './CashRegister'
import Cart from './Cart'
import ConfirmModal from './ConfirmModal'
import ProductCard from './ProductCard'
import SectionPage from './SectionPage'
import NoticeModal from './NoticeModal'
import { getSavedProducts, productCategories, saveProducts } from '../products'
import './NotaVenta.css'

const REGISTER_STORAGE_KEY = 'sistema-ventas-caja'
const MOVEMENTS_STORAGE_KEY = 'sistema-ventas-movimientos'
const SALES_STORAGE_KEY = 'sistema-ventas-facturaciones'
const getSavedRegister = () => {
  try {
    const savedRegister = localStorage.getItem(REGISTER_STORAGE_KEY)
    return savedRegister
      ? JSON.parse(savedRegister)
      : { isOpen: false, openedAt: null, closedAt: null }
  } catch {
    return { isOpen: false, openedAt: null, closedAt: null }
  }
}

function NotaVenta() {
  const [products, setProducts] = useState(getSavedProducts)
  const [selectedCategory, setSelectedCategory] = useState(productCategories[0])
  const [cart, setCart] = useState([])
  const [register, setRegister] = useState(getSavedRegister)
  const [showClosedRegisterNotice, setShowClosedRegisterNotice] = useState(false)
  const [stockNotice, setStockNotice] = useState('')
  const [showInvoiceConfirmation, setShowInvoiceConfirmation] = useState(false)
  const [showInvoiceSuccess, setShowInvoiceSuccess] = useState(false)
  const visibleProducts = products.filter(
    (product) => product.category === selectedCategory.id,
  )

  const saveRegister = (newRegister) => {
    setRegister(newRegister)
    localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(newRegister))
  }

  const saveMovement = (type, date, cashSessionId) => {
    try {
      const savedMovements = JSON.parse(
        localStorage.getItem(MOVEMENTS_STORAGE_KEY) || '[]',
      )
      const newMovement = {
        id: `${date}-${type}`,
        type,
        date,
        cashSessionId,
      }

      localStorage.setItem(
        MOVEMENTS_STORAGE_KEY,
        JSON.stringify([...savedMovements, newMovement]),
      )
    } catch {
      const newMovement = { id: `${date}-${type}`, type, date, cashSessionId }
      localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify([newMovement]))
    }
  }

  const openRegister = () => {
    const openedAt = new Date().toISOString()
    const sessionId = `caja-${Date.now()}`
    saveRegister({
      isOpen: true,
      sessionId,
      openedAt,
      closedAt: null,
    })
    saveMovement('apertura', openedAt, sessionId)
  }

  const closeRegister = () => {
    const closedAt = new Date().toISOString()
    saveRegister({
      ...register,
      isOpen: false,
      closedAt,
    })
    saveMovement('cierre', closedAt, register.sessionId || register.openedAt)
  }

  const addToCart = (product) => {
    if (!register.isOpen) {
      setShowClosedRegisterNotice(true)
      return
    }

    const cartItem = cart.find((item) => item.id === product.id)
    if (product.quantity < (cartItem?.quantity || 0) + 1) {
      setStockNotice(`No hay más unidades disponibles de ${product.name}.`)
      return
    }

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
    if (amount > 0 && !register.isOpen) {
      setShowClosedRegisterNotice(true)
      return
    }

    const cartItem = cart.find((item) => item.id === productId)
    const product = products.find((item) => item.id === productId)
    if (amount > 0 && cartItem.quantity + amount > (product?.quantity || 0)) {
      setStockNotice(`No hay más unidades disponibles de ${cartItem.name}.`)
      return
    }

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

  const invoiceSale = () => {
    if (!register.isOpen) {
      setShowInvoiceConfirmation(false)
      setShowClosedRegisterNotice(true)
      return
    }

    if (cart.length === 0) return

    const unavailableItem = cart.find((cartItem) => {
      const product = products.find((item) => item.id === cartItem.id)
      return !product || product.quantity < cartItem.quantity
    })
    if (unavailableItem) {
      setStockNotice(`Revisá el stock disponible de ${unavailableItem.name}.`)
      return
    }

    const createdAt = new Date().toISOString()
    const total = cart.reduce(
      (saleTotal, item) => saleTotal + item.price * item.quantity,
      0,
    )
    const invoice = {
      id: `venta-${Date.now()}`,
      cashSessionId: register.sessionId || register.openedAt,
      cashOpenedAt: register.openedAt,
      createdAt,
      items: cart.map(({ id, name, price, quantity }) => ({
        productId: id,
        name,
        price,
        quantity,
        subtotal: price * quantity,
      })),
      total,
    }

    try {
      const savedSales = JSON.parse(
        localStorage.getItem(SALES_STORAGE_KEY) || '[]',
      )
      localStorage.setItem(
        SALES_STORAGE_KEY,
        JSON.stringify([...savedSales, invoice]),
      )
    } catch {
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify([invoice]))
    }

    const updatedProducts = products.map((product) => {
      const soldItem = cart.find((item) => item.id === product.id)
      return soldItem
        ? { ...product, quantity: product.quantity - soldItem.quantity }
        : product
    })
    saveProducts(updatedProducts)
    setProducts(updatedProducts)

    setCart([])
    setShowInvoiceConfirmation(false)
    setShowInvoiceSuccess(true)
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
        <CashRegister
          register={register}
          onOpen={openRegister}
          onClose={closeRegister}
        />

        <ProductCategoryMenu
          categories={productCategories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="products-heading">
          <div>
            <h2>Productos · {selectedCategory.name}</h2>
            <p>Seleccioná un producto para agregarlo al carrito.</p>
          </div>
          <span>{visibleProducts.length} disponibles</span>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="products-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="products-empty">
            <p>Todavía no cargamos productos en esta categoría.</p>
          </div>
        )}

        <Cart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onClear={() => setCart([])}
          onInvoice={() => setShowInvoiceConfirmation(true)}
          canInvoice={register.isOpen}
        />

        {showClosedRegisterNotice && (
          <NoticeModal
            title="La caja está cerrada"
            message="Para cargar productos al carrito, primero tenés que abrir la caja."
            onClose={() => setShowClosedRegisterNotice(false)}
          />
        )}

        {stockNotice && (
          <NoticeModal
            title="Stock insuficiente"
            message={stockNotice}
            onClose={() => setStockNotice('')}
          />
        )}

        {showInvoiceConfirmation && (
          <ConfirmModal
            title="¿Facturar esta venta?"
            message="La venta quedará registrada y el carrito se vaciará para comenzar una nueva."
            confirmText="Sí, facturar"
            onCancel={() => setShowInvoiceConfirmation(false)}
            onConfirm={invoiceSale}
          />
        )}

        {showInvoiceSuccess && (
          <NoticeModal
            title="Venta facturada"
            message="La venta se registró correctamente. El carrito ya está listo para el próximo cliente."
            onClose={() => setShowInvoiceSuccess(false)}
          />
        )}
      </div>
    </SectionPage>
  )
}

export default NotaVenta
