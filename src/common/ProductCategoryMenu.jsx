import './ProductCategoryMenu.css'

function ProductCategoryMenu({ categories, selectedCategory, onSelect }) {
  return (
    <nav className="category-menu" aria-label="Categorías de productos">
      {categories.map((category, index) => {
        const isSelected = selectedCategory.id === category.id

        return (
          <button
            className={`category-menu__item ${isSelected ? 'category-menu__item--active' : ''}`}
            type="button"
            key={category.id}
            onClick={() => onSelect(category)}
            aria-pressed={isSelected}
          >
            <span className="category-menu__number">{String(index + 1).padStart(2, '0')}</span>
            <span className="category-menu__name">{category.name}</span>
            <span className="category-menu__short-name">{category.shortName}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default ProductCategoryMenu
