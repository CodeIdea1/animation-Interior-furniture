'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProductsSection.module.css';

const products = [
  { id: '01', name: 'CLOUD LOUNGE',     desc1: 'SOFT CURVES.',      desc2: 'COZY VIBES.',         image: '/product-1.png' },
  { id: '02', name: 'STRIPED MOD',      desc1: 'BOLD STRIPES.',     desc2: 'RETRO CHARM.',        image: '/product-2.png' },
  { id: '03', name: 'MINIMAL BOLSTER',  desc1: 'SIMPLE SHAPE.',     desc2: 'MAX COMFORT.',        image: '/product-3.png' },
  { id: '04', name: 'ARCH ACCENT',      desc1: 'SCULPTURAL &',      desc2: 'STATEMENT-MAKING.',   image: '/product-4.png' },
  { id: '05', name: 'RATTAN HUG',       desc1: 'NATURAL TOUCH.',    desc2: 'WARM FEEL.',          image: '/product-5.png' },
  { id: '06', name: 'VELVET RETREAT',   desc1: 'LUXURIOUS LOOK.',   desc2: 'ULTRA SOFT.',         image: '/product-6.png' },
  { id: '07', name: 'BOUCLÉ BUBBLE',    desc1: 'TEXTURED & TRENDY.',desc2: 'ALWAYS COZY.',        image: '/product-7.png' },
  { id: '08', name: 'WOODEN FRAME',     desc1: 'CLEAN LINES.',      desc2: 'NATURAL BEAUTY.',     image: '/product-8.png' },
  { id: '09', name: 'LEATHER LOUNGE',   desc1: 'RICH LEATHER.',     desc2: 'RELAXED STYLE.',      image: '/product-9.png' },
];

type Toast = { id: number; type: 'cart' | 'wishlist'; name: string; action: 'added' | 'removed' };

const ProductsSection: React.FC = () => {
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [animating, setAnimating] = useState<{ [key: string]: 'cart' | 'wishlist' | null }>({});

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    setWishlist(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  }, []);

  const showToast = useCallback((type: 'cart' | 'wishlist', name: string, action: 'added' | 'removed') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, name, action }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const toggleCart = (productId: string, productName: string) => {
    setAnimating(prev => ({ ...prev, [productId]: 'cart' }));
    setTimeout(() => setAnimating(prev => ({ ...prev, [productId]: null })), 600);

    const isIn = cart.includes(productId);
    const next = isIn ? cart.filter(id => id !== productId) : [...cart, productId];
    localStorage.setItem('cart', JSON.stringify(next));
    setCart(next);
    showToast('cart', productName, isIn ? 'removed' : 'added');
  };

  const toggleWishlist = (productId: string, productName: string) => {
    setAnimating(prev => ({ ...prev, [productId]: 'wishlist' }));
    setTimeout(() => setAnimating(prev => ({ ...prev, [productId]: null })), 600);

    const isIn = wishlist.includes(productId);
    const next = isIn ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    localStorage.setItem('wishlist', JSON.stringify(next));
    setWishlist(next);
    showToast('wishlist', productName, isIn ? 'removed' : 'added');
  };

  return (
    <section className={styles.productsSection}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.topImage}>
          <img src="/n.png" alt="" />
        </div>
        <h3 className={styles.subtitle}>MODERN</h3>
        <h1 className={styles.title}>COZY CHAIRS</h1>
        <p className={styles.tagline}>for your dream space</p>
        <p className={styles.description}>COMFY. STYLISH. TIMELESS.</p>
        <div className={styles.heartRow}>
          <span className={styles.heartLine} />
          <span className={styles.heartSymbol}>♥</span>
          <span className={styles.heartLine} />
        </div>
      </div>

      {/* Products Grid */}
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productNumber}>{product.id}</div>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productDesc}>{product.desc1}</p>
            <p className={styles.productDesc}>{product.desc2}</p>
            <div className={styles.productImageWrapper}>
              <img src={product.image} alt={product.name} className={styles.productImage} />
              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  className={`${styles.actionBtn} ${styles.wishlistBtn} ${wishlist.includes(product.id) ? styles.active : ''} ${animating[product.id] === 'wishlist' ? styles.pop : ''}`}
                  onClick={() => toggleWishlist(product.id, product.name)}
                  aria-label="Add to wishlist"
                >
                  <svg viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.cartBtn} ${cart.includes(product.id) ? styles.active : ''} ${animating[product.id] === 'cart' ? styles.pop : ''}`}
                  onClick={() => toggleCart(product.id, product.name)}
                  aria-label="Add to cart"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  {cart.includes(product.id) && <span className={styles.cartDot} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>♥ FIND YOUR PERFECT CHAIR. CREATE YOUR PERFECT CORNER. ♥</p>
      </div>

      {/* Toasts */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles.toastIn}`}>
            <div className={styles.toastIcon}>
              {toast.type === 'cart' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
            </div>
            <div className={styles.toastText}>
              <span className={styles.toastTitle}>
                {toast.action === 'added'
                  ? toast.type === 'cart' ? 'Added to Cart' : 'Saved to Wishlist'
                  : toast.type === 'cart' ? 'Removed from Cart' : 'Removed from Wishlist'}
              </span>
              <span className={styles.toastName}>{toast.name}</span>
            </div>
            <div className={styles.toastProgress} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
