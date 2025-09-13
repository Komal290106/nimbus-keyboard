import { useState } from 'react';
import { LuCheck, LuX, LuShoppingCart } from 'react-icons/lu';

// Add this to your PurchaseButton component
type CartNotificationProps = {
  isVisible: boolean;
  onClose: () => void;
};

const CartNotification = ({ isVisible, onClose }: CartNotificationProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <LuCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Added to Cart!
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Vapor75 Keyboard has been added to your cart.
            </p>
            
            <div className="flex gap-2">
              <button 
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Continue Shopping
              </button>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <LuShoppingCart className="w-4 h-4" />
                View Cart
              </button>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated PurchaseButton component with notification
type PurchaseButtonWithNotificationProps = {
  slice: unknown; // Replace 'unknown' with the actual type if available
};

export default function PurchaseButtonWithNotification({ slice }: PurchaseButtonWithNotificationProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handlePurchaseClick = async () => {
    setIsPressed(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsPressed(false);
    setShowNotification(true);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  return (
    <>
      <button
        onClick={handlePurchaseClick}
        disabled={isPressed}
        className="group relative w-full overflow-hidden rounded-full border-8 border-gray-900 bg-gradient-to-r from-sky-300 to-sky-600 px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/40 active:scale-95 focus:ring-[24px] focus:ring-sky-500/50 focus:outline-none md:border-[12px] md:px-20 md:py-16"
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        
        <div className="relative z-10 flex items-center justify-center gap-6 md:gap-8">
          <span className="text-4xl font-black text-gray-900 uppercase tracking-wide transition-transform duration-300 group-hover:-translate-y-1 md:text-7xl lg:text-9xl">
            {isPressed ? (
              <span className="flex items-center gap-4 md:gap-6">
                <LuShoppingCart className="size-12 animate-pulse text-gray-900 md:size-16" />
                Adding...
              </span>
            ) : (
              "Buy Now"
            )}
          </span>
        </div>
      </button>
      
      <CartNotification 
        isVisible={showNotification} 
        onClose={() => setShowNotification(false)} 
      />
    </>
  );
}