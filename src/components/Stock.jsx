import { useState } from 'react'
import ProductCategoryMenu from '../common/ProductCategoryMenu'
import ConfirmModal from './ConfirmModal'
import SectionPage from './SectionPage'
import { getSavedProducts, productCategories, saveProducts } from '../products'
import './Stock.css'

const allCategories = [
  { id: 'all', name: 'Todos los productos', shortName: 'Todos' },
  ...productCategories,
]

const categoryIcons = {
  celulares: '📱',
  computacion: '💻',
  audio: '🎧',
  accesorios: '🔌',
  videojuegos: '🎮',
  belleza: '💄',
  bazar: '🏠',
  'articulos-hogar': '🏠',
}

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const emptyForm = {
  name: '',
  category: productCategories[0].id,
  barcode: '',
  price: '',
  quantity: '',
}

function Stock() {
  const [products, setProducts] = useState(getSavedProducts)
  const [selectedCategory, setSelectedCategory] = useState(allCategories[0])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [barcodeError, setBarcodeError] = useState('')
  const [productToDelete, setProductToDelete] = useState(null)
  const visibleProducts = products.filter(
    (product) => selectedCategory.id === 'all' || product.category === selectedCategory.id,
  )
  const totalUnits = products.reduce((total, product) => total + product.quantity, 0)
  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  )

  const updateProducts = (updatedProducts) => {
    saveProducts(updatedProducts)
    setProducts(updatedProducts)
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const submitProduct = (event) => {
    event.preventDefault()
    const productData = {
      name: form.name.trim(),
      category: form.category,
      barcode: form.barcode.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    }

    if (!productData.name || !Number.isFinite(productData.price) ||
      !Number.isFinite(productData.quantity) || productData.price < 0 ||
      productData.quantity < 0 || !Number.isInteger(productData.quantity)) return

    const duplicateBarcode = products.some((product) => (
      productData.barcode &&
      product.barcode?.trim() === productData.barcode &&
      product.id !== editingId
    ))
    if (duplicateBarcode) {
      setBarcodeError('Ese código de barras ya está asignado a otro producto.')
      return
    }

    if (editingId) {
      updateProducts(products.map((product) => (
        product.id === editingId
          ? { ...product, ...productData, icon: categoryIcons[productData.category] }
          : product
      )))
    } else {
      const id = globalThis.crypto?.randomUUID?.() || `producto-${Date.now()}`
      updateProducts([
        ...products,
        { id, ...productData, icon: categoryIcons[productData.category] },
      ])
    }
    resetForm()
  }

  const startEditing = (product) => {
    setEditingId(product.id)
    setBarcodeError('')
    setForm({
      name: product.name,
      category: product.category,
      barcode: product.barcode || '',
      price: String(product.price),
      quantity: String(product.quantity),
    })
  }

  const deleteProduct = () => {
    if (!productToDelete) return
    updateProducts(products.filter((product) => product.id !== productToDelete.id))
    if (editingId === productToDelete.id) resetForm()
    setProductToDelete(null)
  }

  return (
    <SectionPage
      eyebrow="Inventario"
      title="Stock"
      description="Administrá los productos, sus precios y las unidades disponibles."
      icon="ST"
      color="green"
    >
      <div className="stock-summary">
        <article><span>Productos registrados</span><strong>{products.length}</strong></article>
        <article><span>Unidades disponibles</span><strong>{totalUnits}</strong></article>
        <article><span>Valor del inventario</span><strong>{currencyFormatter.format(inventoryValue)}</strong></article>
      </div>

      <section className="stock-editor" aria-labelledby="stock-editor-title">
        <div className="stock-editor__heading">
          <div>
            <p>{editingId ? 'Actualizar producto' : 'Nuevo producto'}</p>
            <h2 id="stock-editor-title">{editingId ? 'Editar datos' : 'Agregar al inventario'}</h2>
          </div>
        </div>
        <form className="stock-form" onSubmit={submitProduct}>
          <label>
            Nombre del producto
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Ej.: Auriculares inalámbricos"
              maxLength={80}
              required
            />
          </label>
          <label>
            Categoría
            <select
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              {productCategories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label>
            Código de barras
            <input
              type="text"
              value={form.barcode}
              onChange={(event) => {
                setForm({ ...form, barcode: event.target.value })
                setBarcodeError('')
              }}
              placeholder="Opcional"
              maxLength={80}
              autoComplete="off"
            />
            {barcodeError && <span className="stock-form__error" role="alert">{barcodeError}</span>}
          </label>
          <label>
            Precio (ARS)
            <input
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
              placeholder="0"
              required
            />
          </label>
          <label>
            Cantidad
            <input
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={(event) => setForm({ ...form, quantity: event.target.value })}
              placeholder="0"
              required
            />
          </label>
          <div className="stock-form__actions">
            {editingId && (
              <button className="stock-button stock-button--secondary" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}
            <button className="stock-button stock-button--primary" type="submit">
              {editingId ? 'Guardar cambios' : 'Agregar producto'}
            </button>
          </div>
        </form>
      </section>

      <div className="stock-list-heading">
        <div>
          <h2>Inventario</h2>
          <p>Actualizá cantidades y precios desde esta sección.</p>
        </div>
        <span>{visibleProducts.length} productos</span>
      </div>

      <ProductCategoryMenu
        categories={allCategories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {visibleProducts.length === 0 ? (
        <div className="stock-empty">
          <p>No hay productos en esta categoría.</p>
          <small>Agregá uno desde el formulario de inventario.</small>
        </div>
      ) : (
        <div className="stock-table-wrap">
          <div className="stock-table stock-table--header" aria-hidden="true">
            <span>Producto</span><span>Categoría</span><span>Cantidad</span><span>Precio</span><span>Acciones</span>
          </div>
          <div className="stock-table-body">
            {visibleProducts.map((product) => (
              <article className="stock-table" key={product.id}>
                <div className="stock-product-name">
                  <span aria-hidden="true">{product.icon}</span>
                  <div className="stock-product-meta">
                    <strong>{product.name}</strong>
                    {product.barcode && <small>Cód. {product.barcode}</small>}
                  </div>
                </div>
                <span className="stock-category">
                  {productCategories.find((category) => category.id === product.category)?.name || 'Sin categoría'}
                </span>
                <strong className={product.quantity === 0 ? 'stock-quantity stock-quantity--empty' : 'stock-quantity'}>
                  {product.quantity}
                </strong>
                <strong className="stock-price">{currencyFormatter.format(product.price)}</strong>
                <div className="stock-row-actions">
                  <button type="button" onClick={() => startEditing(product)} aria-label={`Editar ${product.name}`}>
                    Editar
                  </button>
                  <button type="button" className="stock-delete" onClick={() => setProductToDelete(product)} aria-label={`Eliminar ${product.name}`}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {productToDelete && (
        <ConfirmModal
          title="¿Eliminar producto?"
          message={`${productToDelete.name} dejará de aparecer en el inventario y en las ventas.`}
          confirmText="Sí, eliminar"
          onCancel={() => setProductToDelete(null)}
          onConfirm={deleteProduct}
        />
      )}
    </SectionPage>
  )
}

export default Stock