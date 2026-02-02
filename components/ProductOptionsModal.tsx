'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  sizes?: string[];
  colors?: string[];
  description?: string | null;
}

interface ProductOptionsModalProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onAddToCart: (options: { size: string; color: string; quantity: number }) => void;
}

export default function ProductOptionsModal({ isOpen, product, onClose, onAddToCart }: ProductOptionsModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
      setErrors({});
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      newErrors.size = 'Please select a size';
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      newErrors.color = 'Please select a color';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onAddToCart({
        size: selectedSize,
        color: selectedColor,
        quantity
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-md animate-scale-in shadow-2xl border border-[var(--bg-elevated)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">{product.name}</h3>
              <p className="text-[var(--accent)] font-semibold">${product.price.toFixed(2)}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)] rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Size <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        if (errors.size) setErrors(prev => ({ ...prev, size: '' }));
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-[var(--accent)] text-[#0A0A0A]'
                          : 'bg-[var(--bg-elevated)] text-white hover:bg-[var(--accent)] hover:text-[#0A0A0A]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.size && <p className="text-red-400 text-xs mt-1">{errors.size}</p>}
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Color <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        if (errors.color) setErrors(prev => ({ ...prev, color: '' }));
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'bg-[var(--accent)] text-[#0A0A0A]'
                          : 'bg-[var(--bg-elevated)] text-white hover:bg-[var(--accent)] hover:text-[#0A0A0A]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {errors.color && <p className="text-red-400 text-xs mt-1">{errors.color}</p>}
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--accent)]"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[var(--bg-elevated)] text-white border border-[var(--bg-elevated)] rounded-lg py-3 px-4 hover:bg-[var(--bg-elevated)]/80 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[var(--accent)] text-[#0A0A0A] rounded-lg py-3 px-4 hover:scale-105 transition-transform font-semibold"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}