export const PRODUCTS_STORAGE_KEY = 'sistema-ventas-stock-productos'

const LEGACY_PRICES_STORAGE_KEY = 'sistema-ventas-precios-productos'

export const productCategories = [
  { id: 'celulares', name: 'Celulares', shortName: 'Celulares' },
  { id: 'computacion', name: 'Computación', shortName: 'Computación' },
  { id: 'audio', name: 'Audio', shortName: 'Audio' },
  { id: 'accesorios', name: 'Accesorios', shortName: 'Accesorios' },
  { id: 'videojuegos', name: 'Videojuegos', shortName: 'Gaming' },
  { id: 'smart-home', name: 'Hogar inteligente', shortName: 'Smart home' },
]

export const defaultProducts = [
  { id: 'smartphone-android', category: 'celulares', name: 'Celular Android', price: 0, quantity: 0, icon: '📱' },
  { id: 'smartphone-iphone', category: 'celulares', name: 'iPhone', price: 0, quantity: 0, icon: '📱' },
  { id: 'smartphone-gama-media', category: 'celulares', name: 'Celular gama media', price: 0, quantity: 0, icon: '📱' },
  { id: 'smartphone-gama-alta', category: 'celulares', name: 'Celular gama alta', price: 0, quantity: 0, icon: '📱' },
  { id: 'notebook', category: 'computacion', name: 'Notebook', price: 0, quantity: 0, icon: '💻' },
  { id: 'tablet', category: 'computacion', name: 'Tablet', price: 0, quantity: 0, icon: '📟' },
  { id: 'mouse-inalambrico', category: 'computacion', name: 'Mouse inalámbrico', price: 0, quantity: 0, icon: '🖱️' },
  { id: 'teclado', category: 'computacion', name: 'Teclado', price: 0, quantity: 0, icon: '⌨️' },
  { id: 'auriculares-bluetooth', category: 'audio', name: 'Auriculares Bluetooth', price: 0, quantity: 0, icon: '🎧' },
  { id: 'auriculares-cable', category: 'audio', name: 'Auriculares con cable', price: 0, quantity: 0, icon: '🎧' },
  { id: 'parlante-bluetooth', category: 'audio', name: 'Parlante Bluetooth', price: 0, quantity: 0, icon: '🔊' },
  { id: 'microfono', category: 'audio', name: 'Micrófono', price: 0, quantity: 0, icon: '🎙️' },
  { id: 'cargador-usb-c', category: 'accesorios', name: 'Cargador USB-C', price: 0, quantity: 0, icon: '🔌' },
  { id: 'cable-usb-c', category: 'accesorios', name: 'Cable USB-C', price: 0, quantity: 0, icon: '🔌' },
  { id: 'funda-celular', category: 'accesorios', name: 'Funda para celular', price: 0, quantity: 0, icon: '📱' },
  { id: 'protector-pantalla', category: 'accesorios', name: 'Protector de pantalla', price: 0, quantity: 0, icon: '🛡️' },
  { id: 'consola-videojuegos', category: 'videojuegos', name: 'Consola de videojuegos', price: 0, quantity: 0, icon: '🎮' },
  { id: 'control-videojuegos', category: 'videojuegos', name: 'Control inalámbrico', price: 0, quantity: 0, icon: '🎮' },
  { id: 'juego-consola', category: 'videojuegos', name: 'Videojuego', price: 0, quantity: 0, icon: '🕹️' },
  { id: 'silla-gamer', category: 'videojuegos', name: 'Silla gamer', price: 0, quantity: 0, icon: '🪑' },
  { id: 'smartwatch', category: 'smart-home', name: 'Smartwatch', price: 0, quantity: 0, icon: '⌚' },
  { id: 'camara-seguridad', category: 'smart-home', name: 'Cámara de seguridad Wi-Fi', price: 0, quantity: 0, icon: '📹' },
  { id: 'foco-inteligente', category: 'smart-home', name: 'Foco inteligente', price: 0, quantity: 0, icon: '💡' },
  { id: 'enchufe-inteligente', category: 'smart-home', name: 'Enchufe inteligente', price: 0, quantity: 0, icon: '🔌' },
]

export function getSavedProducts() {
  try {
    const savedProducts = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY))
    if (Array.isArray(savedProducts)) return savedProducts

    const savedPrices = JSON.parse(
      localStorage.getItem(LEGACY_PRICES_STORAGE_KEY) || '{}',
    )
    return defaultProducts.map((product) => ({
      ...product,
      price: Number(savedPrices[product.id]) || product.price,
    }))
  } catch {
    return defaultProducts
  }
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
}