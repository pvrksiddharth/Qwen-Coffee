import { useState, useEffect, useRef, useMemo } from 'react';
import { products, categories, roastLevels, Product } from './data/products';
import SparkleField from './components/SparkleField';
import { CartItem, addItem, cartCount, cartTotal, removeItem, setQuantity } from './lib/cart';
import { filterProducts } from './lib/filters';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const filteredProducts = useMemo(
    () => filterProducts(products, { search: searchQuery, category: selectedCategory, roast: selectedRoast }),
    [searchQuery, selectedCategory, selectedRoast]
  );

  const addToCart = (product: Product) => setCart(prev => addItem(prev, product));

  const removeFromCart = (productId: number) => setCart(prev => removeItem(prev, productId));

  const updateQuantity = (productId: number, quantity: number) =>
    setCart(prev => setQuantity(prev, productId, quantity));

  const total = cartTotal(cart);
  const count = cartCount(cart);

  const handleCheckout = () => {
    setShowCheckout(true);
    setCheckoutStep(1);
  };

  const completeOrder = () => {
    setCheckoutStep(3);
    setTimeout(() => {
      setOrderComplete(true);
      setCart([]);
    }, 2000);
  };

  const resetCheckout = () => {
    setShowCheckout(false);
    setCheckoutStep(1);
    setOrderComplete(false);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      <SparkleField />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-cream/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">☕</span>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-espresso tracking-tight">Ember & Bloom</h1>
                <p className="text-[10px] sm:text-xs text-mocha/60 tracking-widest uppercase">Specialty Coffee</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Shop', 'Our Story', 'Brewing', 'Contact'].map((item) => (
                <a key={item} href="#" className="nav-link text-sm font-medium text-espresso/80 hover:text-espresso transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-latte/50 transition-all duration-300 group tooltip"
                data-tooltip={`${count} items in cart`}
                aria-label={`Open cart, ${count} items`}
              >
                <svg className="w-6 h-6 text-espresso transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-caramel text-white text-xs rounded-full flex items-center justify-center font-bold animate-scale-in">
                    {count}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-latte/50 transition-all"
              >
                <svg className="w-6 h-6 text-espresso" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 animate-fade-in">
              {['Shop', 'Our Story', 'Brewing', 'Contact'].map((item) => (
                <a key={item} href="#" className="block py-2 text-sm font-medium text-espresso/80 hover:text-espresso transition-colors">
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-espresso mb-4 sm:mb-6 leading-tight">
            Crafted with <span className="text-caramel italic">Passion</span>,
            <br />Roasted to <span className="text-mocha">Perfection</span>
          </h2>
          <p className="text-base sm:text-lg text-mocha/70 max-w-2xl mx-auto mb-8">
            Discover our curated selection of the world's finest specialty coffees, 
            sourced directly from sustainable farms and roasted in small batches.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="group flex items-center gap-2 px-4 py-2 bg-latte/50 rounded-full hover:bg-caramel/20 transition-all duration-300 cursor-pointer">
              <span className="text-lg group-hover:scale-125 transition-transform">🌱</span>
              <span className="text-sm text-espresso/70">Sustainably Sourced</span>
            </div>
            <div className="group flex items-center gap-2 px-4 py-2 bg-latte/50 rounded-full hover:bg-caramel/20 transition-all duration-300 cursor-pointer">
              <span className="text-lg group-hover:scale-125 transition-transform">🔥</span>
              <span className="text-sm text-espresso/70">Small Batch Roasted</span>
            </div>
            <div className="group flex items-center gap-2 px-4 py-2 bg-latte/50 rounded-full hover:bg-caramel/20 transition-all duration-300 cursor-pointer">
              <span className="text-lg group-hover:scale-125 transition-transform">📦</span>
              <span className="text-sm text-espresso/70">Fresh to Your Door</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8 sm:mb-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-latte/30">
          {/* Search */}
          <div className="relative mb-4 sm:mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, origin, or flavor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-cream rounded-xl border border-latte/50 focus:border-caramel focus:ring-2 focus:ring-caramel/20 outline-none transition-all text-espresso placeholder:text-mocha/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-mocha/40 hover:text-mocha transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-mocha/60 uppercase tracking-wider mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-espresso text-cream shadow-md'
                        : 'bg-latte/40 text-espresso/70 hover:bg-latte hover:text-espresso'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-mocha/60 uppercase tracking-wider mb-2">Roast Level</p>
              <div className="flex flex-wrap gap-2">
                {roastLevels.map(roast => (
                  <button
                    key={roast}
                    onClick={() => setSelectedRoast(roast)}
                    className={`filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedRoast === roast
                        ? 'bg-caramel text-white shadow-md'
                        : 'bg-latte/40 text-espresso/70 hover:bg-latte hover:text-espresso'
                    }`}
                  >
                    {roast}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-espresso">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Coffee' : 'Coffees'} Found
          </h3>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-lg text-mocha/60">No coffees match your search. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="coffee-card bg-white rounded-2xl overflow-hidden shadow-sm border border-latte/20 cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div
                  className="relative h-48 sm:h-56 overflow-hidden"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-espresso">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-caramel/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                      {product.roast}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                      className="w-full py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-espresso hover:bg-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-espresso text-base sm:text-lg group-hover:text-caramel transition-colors duration-300">
                        {product.name}
                      </h4>
                      <p className="text-xs text-mocha/60 mt-0.5">{product.origin} · {product.weight}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gold text-sm">★</span>
                      <span className="text-sm font-medium text-espresso">{product.rating}</span>
                    </div>
                  </div>

                  {/* Flavor Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.flavor.map(f => (
                      <span key={f} className="px-2 py-0.5 bg-cream rounded-full text-[11px] text-mocha/70 hover:bg-caramel/10 hover:text-caramel transition-colors cursor-default">
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-3 border-t border-latte/30">
                    <span className="price-tag text-xl font-bold text-espresso cursor-pointer">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-2 px-4 py-2 bg-espresso text-cream rounded-xl text-sm font-medium hover:bg-caramel transition-all duration-300 hover:shadow-lg hover:shadow-caramel/20 active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" />
          <div
            className="relative bg-cream rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scroll-container shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-espresso hover:bg-espresso hover:text-cream transition-all duration-300"
            >
              ✕
            </button>

            {/* Image */}
            <div className="relative h-56 sm:h-72 overflow-hidden rounded-t-3xl">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 -mt-8 relative">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-espresso/10 rounded-full text-xs font-medium text-espresso">
                  {selectedProduct.category}
                </span>
                <span className="px-3 py-1 bg-caramel/10 rounded-full text-xs font-medium text-caramel">
                  {selectedProduct.roast} Roast
                </span>
                <span className="px-3 py-1 bg-sage/10 rounded-full text-xs font-medium text-sage">
                  {selectedProduct.weight}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-espresso mb-1">{selectedProduct.name}</h2>
              <p className="text-mocha/60 mb-4">{selectedProduct.origin}</p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(selectedProduct.rating) ? 'text-gold' : 'text-latte'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm text-mocha/60">{selectedProduct.rating} / 5.0</span>
              </div>

              <p className="text-mocha/80 leading-relaxed mb-6">{selectedProduct.description}</p>

              {/* Flavor Profile */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-espresso uppercase tracking-wider mb-2">Flavor Profile</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.flavor.map(f => (
                    <span key={f} className="px-3 py-1.5 bg-latte/50 rounded-full text-sm text-espresso hover:bg-caramel/20 hover:text-caramel transition-all cursor-default">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Brewing Suggestions */}
              <div className="mb-6 p-4 bg-white/60 rounded-xl border border-latte/30">
                <h4 className="text-sm font-semibold text-espresso uppercase tracking-wider mb-2">Brewing Suggestions</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['Pour Over', 'French Press', 'Espresso'].map(method => (
                    <div key={method} className="text-center p-2 rounded-lg hover:bg-latte/30 transition-colors cursor-pointer group">
                      <span className="text-lg block mb-1 group-hover:scale-125 transition-transform">
                        {method === 'Pour Over' ? '🫖' : method === 'French Press' ? '☕' : '⚡'}
                      </span>
                      <span className="text-xs text-mocha/70">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between pt-4 border-t border-latte/30">
                <div>
                  <p className="text-xs text-mocha/60">Price</p>
                  <p className="text-2xl font-bold text-espresso">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="flex items-center gap-2 px-6 py-3 bg-espresso text-cream rounded-xl font-medium hover:bg-caramel transition-all duration-300 hover:shadow-lg hover:shadow-caramel/20 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70]" onClick={() => !showCheckout && setIsCartOpen(false)}>
          <div className="absolute inset-0 bg-espresso/40 backdrop-blur-sm" />
          <div
            ref={cartRef}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-cream shadow-2xl animate-fade-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-latte/30">
              <div>
                <h3 className="text-xl font-bold text-espresso">Your Cart</h3>
                <p className="text-sm text-mocha/60">{count} {count === 1 ? 'item' : 'items'}</p>
              </div>
              <button
                onClick={() => { setIsCartOpen(false); setShowCheckout(false); setOrderComplete(false); }}
                className="w-10 h-10 rounded-full bg-latte/50 flex items-center justify-center text-espresso hover:bg-espresso hover:text-cream transition-all duration-300"
              >
                ✕
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto scroll-container p-6">
              {showCheckout ? (
                /* Checkout Flow */
                <div className="animate-fade-in">
                  {orderComplete ? (
                    <div className="text-center py-12">
                      <span className="text-6xl block mb-4">🎉</span>
                      <h3 className="text-2xl font-bold text-espresso mb-2">Order Complete!</h3>
                      <p className="text-mocha/70 mb-6">Your specialty coffees are on their way. Expect delivery in 2-3 business days.</p>
                      <p className="text-sm text-mocha/50 mb-6">Order #EB-{Math.floor(Math.random() * 90000 + 10000)}</p>
                      <button
                        onClick={resetCheckout}
                        className="px-6 py-3 bg-espresso text-cream rounded-xl font-medium hover:bg-caramel transition-all"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Progress Steps */}
                      <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map(step => (
                          <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                              step <= checkoutStep ? 'bg-caramel text-white' : 'bg-latte/50 text-mocha/40'
                            }`}>
                              {step < checkoutStep ? '✓' : step}
                            </div>
                            {step < 3 && (
                              <div className={`w-8 sm:w-12 h-0.5 mx-1 transition-all ${
                                step < checkoutStep ? 'bg-caramel' : 'bg-latte/50'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>

                      {checkoutStep === 1 && (
                        <div className="animate-fade-in">
                          <h4 className="text-lg font-bold text-espresso mb-4">Shipping Details</h4>
                          <div className="space-y-3">
                            <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-white rounded-xl border border-latte/50 focus:border-caramel focus:ring-2 focus:ring-caramel/20 outline-none transition-all text-espresso placeholder:text-mocha/40" />
                            <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-white rounded-xl border border-latte/50 focus:border-caramel focus:ring-2 focus:ring-caramel/20 outline-none transition-all text-espresso placeholder:text-mocha/40" />
                            <input type="text" placeholder="Street Address" className="w-full px-4 py-3 bg-white rounded-xl border border-latte/50 focus:border-caramel focus:ring-2 focus:ring-caramel/20 outline-none transition-all text-espresso placeholder:text-mocha/40" />
                            <div className="grid grid-cols-2 gap-3">
                              <input type="text" placeholder="City" className="w-full px-4 py-3 bg-white rounded-xl border border-latte/50 focus:border-caramel focus:ring-2 focus:ring-caramel/20 outline-none transition-all text-espresso placeholder:text-mocha/40" />
                              <input type="text" placeholder="ZIP Code" className="w-full px-4 py-3 bg-white rounded-xl border border-latte/50 focus:border-caramel focus:ring-2 focus:ring-caramel/20 outline-none transition-all text-espresso placeholder:text-mocha/40" />
                            </div>
                          </div>
                          <button
                            onClick={() => setCheckoutStep(2)}
                            className="w-full mt-6 py-3 bg-espresso text-cream rounded-xl font-medium hover:bg-caramel transition-all duration-300"
                          >
                            Continue to Payment
                          </button>
                        </div>
                      )}

                      {checkoutStep === 2 && (
                        <div className="animate-fade-in">
                          <h4 className="text-lg font-bold text-espresso mb-4">Payment</h4>
                          <div className="space-y-3">
                            <input type="text" placeholder="Card Number" className="w-full px-4 py-3 bg-white rounded-xl border border-latte/50 focus:border-caramel focus:ring-2 focus:ring-caramel/20 outline-none transition-all text-espresso placeholder:text-mocha/40" />
                            <div className="grid grid-cols-2 gap-3">
                              <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white rounded-xl border border-latte/50 focus:border-caramel focus:ring-2 focus:ring-caramel/20 outline-none transition-all text-espresso placeholder:text-mocha/40" />
                              <input type="text" placeholder="CVC" className="w-full px-4 py-3 bg-white rounded-xl border border-latte/50 focus:border-caramel focus:ring-2 focus:ring-caramel/20 outline-none transition-all text-espresso placeholder:text-mocha/40" />
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="mt-6 p-4 bg-white/60 rounded-xl border border-latte/30">
                            <h5 className="text-sm font-semibold text-espresso mb-2">Order Summary</h5>
                            {cart.map(item => (
                              <div key={item.product.id} className="flex justify-between text-sm text-mocha/70 py-1">
                                <span>{item.product.name} × {item.quantity}</span>
                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t border-latte/30 mt-2 pt-2 flex justify-between font-bold text-espresso">
                              <span>Total</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              onClick={() => setCheckoutStep(1)}
                              className="flex-1 py-3 bg-latte/50 text-espresso rounded-xl font-medium hover:bg-latte transition-all"
                            >
                              Back
                            </button>
                            <button
                              onClick={completeOrder}
                              className="flex-1 py-3 bg-caramel text-white rounded-xl font-medium hover:bg-espresso transition-all duration-300"
                            >
                              Place Order
                            </button>
                          </div>
                        </div>
                      )}

                      {checkoutStep === 3 && (
                        <div className="text-center py-12 animate-fade-in">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-caramel/20 flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-caramel border-t-transparent rounded-full animate-spin" />
                          </div>
                          <h4 className="text-lg font-bold text-espresso mb-2">Processing your order...</h4>
                          <p className="text-sm text-mocha/60">Please wait while we confirm your payment.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl block mb-4">🛒</span>
                  <h4 className="text-lg font-bold text-espresso mb-2">Your cart is empty</h4>
                  <p className="text-sm text-mocha/60 mb-4">Discover our specialty coffees and add your favorites.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2 bg-espresso text-cream rounded-xl text-sm font-medium hover:bg-caramel transition-all"
                  >
                    Browse Coffees
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={item.product.id}
                      className="cart-item-enter flex gap-3 p-3 bg-white/60 rounded-xl border border-latte/20 hover:border-caramel/30 transition-all group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => { setSelectedProduct(item.product); setIsCartOpen(false); }}
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-espresso text-sm truncate group-hover:text-caramel transition-colors cursor-pointer" onClick={() => { setSelectedProduct(item.product); setIsCartOpen(false); }}>
                          {item.product.name}
                        </h5>
                        <p className="text-xs text-mocha/60">{item.product.origin}</p>
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-latte/50 flex items-center justify-center text-espresso hover:bg-espresso hover:text-cream transition-all text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-espresso">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-latte/50 flex items-center justify-center text-espresso hover:bg-espresso hover:text-cream transition-all text-sm"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-espresso price-tag">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="w-6 h-6 rounded-full text-mocha/40 hover:text-rose hover:bg-rose/10 flex items-center justify-center transition-all text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && !showCheckout && (
              <div className="p-6 border-t border-latte/30 bg-white/40">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-mocha/60">Subtotal</span>
                  <span className="text-sm text-espresso">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-mocha/60">Shipping</span>
                  <span className="text-sm text-sage">Free</span>
                </div>
                <div className="flex justify-between items-center mb-4 pt-2 border-t border-latte/30">
                  <span className="font-bold text-espresso">Total</span>
                  <span className="text-xl font-bold text-espresso">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-espresso text-cream rounded-xl font-medium hover:bg-caramel transition-all duration-300 hover:shadow-lg hover:shadow-caramel/20 active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-2 py-2 text-sm text-mocha/60 hover:text-espresso transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-espresso text-cream/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">☕</span>
                <h4 className="text-lg font-bold text-cream">Ember & Bloom</h4>
              </div>
              <p className="text-sm text-cream/60 leading-relaxed">
                Specialty coffee roasters dedicated to bringing you the world's finest beans, ethically sourced and expertly roasted.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-cream mb-3 text-sm uppercase tracking-wider">Shop</h5>
              <ul className="space-y-2">
                {['All Coffees', 'Single Origin', 'Blends', 'Subscriptions'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-cream/60 hover:text-caramel transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-cream mb-3 text-sm uppercase tracking-wider">Learn</h5>
              <ul className="space-y-2">
                {['Brewing Guides', 'Coffee Origins', 'Roast Profiles', 'Our Process'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-cream/60 hover:text-caramel transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-cream mb-3 text-sm uppercase tracking-wider">Connect</h5>
              <ul className="space-y-2">
                {['Instagram', 'Twitter', 'Newsletter', 'Contact Us'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-cream/60 hover:text-caramel transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-cream/10 text-center">
            <p className="text-sm text-cream/40">© 2026 Ember & Bloom. All rights reserved. Crafted with ☕ and care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
