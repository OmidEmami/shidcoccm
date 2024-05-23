
const initialState = {
    cartItems: []
  };
function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CART_QUANTITY':
  return {
    ...state,
    cartItems: state.cartItems.map(item =>
      item._id === action.payload.variantId
        ? { ...item, quantity: action.payload.quantity }
        : item
    )
  };
  case 'REMOVE_FROM_CART':
  return {
    ...state,
    cartItems: state.cartItems.filter(item => item._id !== action.payload),
  };
    case 'ADD_TO_CART':
      // Check if the item is already in the cart
      const inCart = state.cartItems.find(item => item.VariantName === action.payload.VariantName);

      if (inCart) {
        // If the item is already in the cart, increase the quantity
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.VariantName === action.payload.VariantName ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      } else {
        // Item not in cart, add as a new item
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }]
        };
      }
      case 'RESET_CART':
        // Reset the cart to initial state
        return initialState;
    default:
      return state;
  }
}

export default cartReducer;
