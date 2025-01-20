import { useReducer } from 'react';

const useRequestFormReducer = () => {
  const initialState = {
    description: '',
    amount: '',
    recipient: '',
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case 'SET_DESCRIPTION':
        return { ...state, description: action.payload };
      case 'SET_AMOUNT':
        return { ...state, amount: action.payload };
      case 'SET_RECIPIENT':
        return { ...state, recipient: action.payload };
      case 'RESET_FORM':
        return initialState;
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  return [state, dispatch];
};

export default useRequestFormReducer;
