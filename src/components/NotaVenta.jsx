import { useState } from 'react'
import ProductCategoryMenu from '../common/ProductCategoryMenu'
import CashRegister from './CashRegister'
import Cart from './Cart'
import ConfirmModal from './ConfirmModal'
import PriceEditModal from './PriceEditModal'
import ProductCard from './ProductCard'
import SectionPage from './SectionPage'
import NoticeModal from './NoticeModal'
import './NotaVenta.css'

const REGISTER_STORAGE_KEY = 'sistema-ventas-caja'
const MOVEMENTS_STORAGE_KEY = 'sistema-ventas-movimientos'
const SALES_STORAGE_KEY = 'sistema-ventas-facturaciones'
const PRODUCT_PRICES_STORAGE_KEY = 'sistema-ventas-precios-productos'

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

const initialProducts = [
  { id: 'molida-chica-comun', category: 'sandwich-molida', name: 'Milanesa chica de molida común', price: 0, icon: '🥪' },
  { id: 'molida-chica-especial', category: 'sandwich-molida', name: 'Milanesa chica de molida especial', price: 0, icon: '🥪' },
  { id: 'molida-gigante-comun', category: 'sandwich-molida', name: 'Milanesa gigante de molida común', price: 0, icon: '🥪' },
  { id: 'molida-gigante-especial', category: 'sandwich-molida', name: 'Milanesa gigante de molida especial', price: 0, icon: '🥪' },
  { id: 'carne-chica-comun', category: 'sandwich-carne', name: 'Milanesa chica de carne común', price: 0, icon: '🥩' },
  { id: 'carne-chica-especial', category: 'sandwich-carne', name: 'Milanesa chica de carne especial', price: 0, icon: '🥩' },
  { id: 'carne-gigante-comun', category: 'sandwich-carne', name: 'Milanesa gigante de carne común', price: 0, icon: '🥩' },
  { id: 'carne-gigante-especial', category: 'sandwich-carne', name: 'Milanesa gigante de carne especial', price: 0, icon: '🥩' },
  { id: 'hamburguesa-americana', category: 'hamburguesas', name: 'Hamburguesa americana', price: 0, icon: '🍔' },
  { id: 'hamburguesa-sanguchera', category: 'hamburguesas', name: 'Hamburguesa sanguchera especial', price: 0, icon: '🍔' },
  { id: 'pancho', category: 'panchos', name: 'Pancho', price: 0, icon: '🌭' },
  { id: 'super-pancho', category: 'panchos', name: 'Súper pancho', price: 0, icon: '🌭' },
  { id: 'cerveza-norte-lata', category: 'bebidas', name: 'Cerveza Norte en lata', price: 0, icon: '🍺' },
  { id: 'fernet-pepsi-promo', category: 'bebidas', name: 'Fernet + Pepsi (promo)', price: 0, icon: '🥃' },
  { id: 'vaso-fernet', category: 'bebidas', name: 'Vaso de fernet', price: 0, icon: '🥃' },
  { id: 'pepsi-3l', category: 'bebidas', name: 'Pepsi 3 Lt', price: 0, icon: '🥤' },
  { id: 'pepsi-2l', category: 'bebidas', name: 'Pepsi 2 Lt', price: 0, icon: '🥤' },
  { id: 'jugo-fresh', category: 'bebidas', name: 'Jugo Fresh', price: 0, icon: '🧃' },
  { id: 'chocotorta', category: 'postres', name: 'Chocotorta', price: 3500, icon: '🍰' },
  { id: 'postre-oreo', category: 'postres', name: 'Postre Oreo', price: 4000, icon: '🍪' },
  { id: 'donas', category: 'postres', name: 'Donas', price: 0, icon: '🍩' },
  { id: 'cono-papa-chico', category: 'conos-papa', name: 'Cono de papa chico', price: 0, icon: '🍟' },
  { id: 'cono-papa-grande', category: 'conos-papa', name: 'Cono de papa grande', price: 0, icon: '🍟' },
  { id: 'bombas-papa', category: 'conos-papa', name: 'Bombas de papa', price: 0, icon: '🥔' },
  { id: 'empanadas', category: 'conos-papa', name: 'Empanadas', price: 0, icon: '🥟' },
]

const getSavedProducts = () => {
  try {
    const savedPrices = JSON.parse(
      localStorage.getItem(PRODUCT_PRICES_STORAGE_KEY) || '{}',
    )

    return initialProducts.map((product) => {
      const savedPrice = Number(savedPrices[product.id])
      return Number.isFinite(savedPrice) && savedPrice > 0
        ? { ...product, price: savedPrice }
        : product
    })
  } catch {
    return initialProducts
  }
}

const productCategories = [
  { id: 'sandwich-molida', name: 'Sándwich de molida', shortName: 'Molida' },
  { id: 'sandwich-carne', name: 'Sándwich de carne', shortName: 'Carne' },
  { id: 'hamburguesas', name: 'Hamburguesas', shortName: 'Hamburguesas' },
  { id: 'panchos', name: 'Panchos', shortName: 'Panchos' },
  { id: 'bebidas', name: 'Bebidas', shortName: 'Bebidas' },
  { id: 'postres', name: 'Postres', shortName: 'Postres' },
  { id: 'conos-papa', name: 'Conos de papa', shortName: 'Conos' },
]

function NotaVenta() {
  const [products, setProducts] = useState(getSavedProducts)
  const [selectedCategory, setSelectedCategory] = useState(productCategories[0])
  const [cart, setCart] = useState([])
  const [register, setRegister] = useState(getSavedRegister)
  const [productToEdit, setProductToEdit] = useState(null)
  const [showClosedRegisterNotice, setShowClosedRegisterNotice] = useState(false)
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

  const updatePrice = (productId, newPrice) => {
    setProducts((currentProducts) => {
      const updatedProducts = currentProducts.map((product) =>
        product.id === productId ? { ...product, price: newPrice } : product,
      )
      const pricesToSave = Object.fromEntries(
        updatedProducts.map((product) => [product.id, product.price]),
      )

      localStorage.setItem(
        PRODUCT_PRICES_STORAGE_KEY,
        JSON.stringify(pricesToSave),
      )
      return updatedProducts
    })
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, price: newPrice } : item,
      ),
    )
  }

  const invoiceSale = () => {
    if (!register.isOpen) {
      setShowInvoiceConfirmation(false)
      setShowClosedRegisterNotice(true)
      return
    }

    if (cart.length === 0) return

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
                onEdit={setProductToEdit}
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

        {productToEdit && (
          <PriceEditModal
            item={productToEdit}
            onClose={() => setProductToEdit(null)}
            onConfirm={(newPrice) => {
              updatePrice(productToEdit.id, newPrice)
              setProductToEdit(null)
            }}
          />
        )}

        {showClosedRegisterNotice && (
          <NoticeModal
            title="La caja está cerrada"
            message="Para cargar productos al carrito, primero tenés que abrir la caja."
            onClose={() => setShowClosedRegisterNotice(false)}
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
