export const useCart = () => {
  const cartItems = useState<any[]>('cart', () => {
    if (process.client) {
      return JSON.parse(localStorage.getItem('cart') || '[]')
    }
    return []
  })

  const cartItemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.quantity || 0), 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0) * (item.quantity || 0)
    }, 0)
  })

  const addToCart = (item: any) => {
    const cart = [...cartItems.value]
    
    // Check if item already exists
    const existingIndex = cart.findIndex((cartItem) => {
      if (item.is_variant) {
        return cartItem.id === item.id && cartItem.is_variant
      } else {
        return cartItem.id === item.id && !cartItem.is_variant
      }
    })

    if (existingIndex !== -1) {
      // Update quantity
      cart[existingIndex].quantity += item.quantity
    } else {
      // Add new item
      cart.push(item)
    }

    // Update state and localStorage
    cartItems.value = cart
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(cart))
      // Trigger storage event for other tabs/components
      window.dispatchEvent(new Event('cart-updated'))
    }
  }

  const removeFromCart = (itemId: string | number, isVariant: boolean = false) => {
    const cart = cartItems.value.filter((item) => {
      if (isVariant) {
        return !(item.id === itemId && item.is_variant)
      } else {
        return !(item.id === itemId && !item.is_variant)
      }
    })
    
    cartItems.value = cart
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cart-updated'))
    }
  }

  const updateQuantity = (itemId: string | number, quantity: number, isVariant: boolean = false) => {
    const cart = [...cartItems.value]
    const index = cart.findIndex((item) => {
      if (isVariant) {
        return item.id === itemId && item.is_variant
      } else {
        return item.id === itemId && !item.is_variant
      }
    })

    if (index !== -1) {
      if (quantity <= 0) {
        cart.splice(index, 1)
      } else {
        cart[index].quantity = quantity
      }
      
      cartItems.value = cart
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('cart-updated'))
      }
    }
  }

  const clearCart = () => {
    cartItems.value = []
    if (process.client) {
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cart-updated'))
    }
  }

  const loadCart = () => {
    if (process.client) {
      cartItems.value = JSON.parse(localStorage.getItem('cart') || '[]')
    }
  }

  // Listen for cart updates
  if (process.client) {
    const handleCartUpdate = () => {
      loadCart()
    }
    
    window.addEventListener('cart-updated', handleCartUpdate)
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        loadCart()
      }
    })
  }

  return {
    cartItems,
    cartItemCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
  }
}
