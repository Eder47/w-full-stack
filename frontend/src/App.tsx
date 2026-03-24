import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ProductPage } from './pages/ProductPage/ProductPage';
import './index.scss';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <ProductPage />
      </div>
    </Provider>
  );
}

export default App;