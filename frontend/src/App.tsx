import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { ProductPage } from './pages/ProductPage/ProductPage';
import './index.scss';

const ReduxDebugger = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log('Redux está funcionando correctamente');
    console.log('Store inicial:', store.getState());
    
    import('./store/slices/uiSlice').then(({ openSummaryBackdrop }) => {
      console.log('Probando dispatch de openSummaryBackdrop');
      dispatch(openSummaryBackdrop());
      setTimeout(() => {
        console.log('Estado después de dispatch:', store.getState());
      }, 100);
    });
  }, [dispatch]);
  
  return null;
};

function App() {
  return (
    <Provider store={store}>
      <ReduxDebugger />
      <div className="App">
        <ProductPage />
      </div>
    </Provider>
  );
}

export default App;