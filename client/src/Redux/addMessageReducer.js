const initialState = {
    messages: []
  };
  
  const addMessageReducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADDMESSAGE":
        return { ...state, messages: [...state.messages, action.payload] };
      default:
        return state;
    }
  };
  
  export default addMessageReducer;
  