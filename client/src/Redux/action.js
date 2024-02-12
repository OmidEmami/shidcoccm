export const addToken = (token) => ({
    type: 'ADDTOKEN',
    payload: token
  });
  export const addMessage = (messages) =>({
    type:'ADDMESSAGE',
    payload: messages
  })


export function addToCart(cartItems) {
  return {
    type: 'ADD_TO_CART',
    payload: cartItems
  };
}
export function cartModifier(variantId,quantity){
  return{
    type: 'UPDATE_CART_QUANTITY',
    payload: {
      variantId, // Include the variantId to identify the cart item
      quantity   // Include the new quantity to update the cart item with
    }
  }
}

export function removeFromCart(variantId) {
  return {
    type: 'REMOVE_FROM_CART',
    payload: variantId,
  };
}
