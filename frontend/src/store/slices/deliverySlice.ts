import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryInfo } from '../../types/payment.types';

interface DeliveryState {
  deliveryInfo: DeliveryInfo | null;
}

const initialState: DeliveryState = {
  deliveryInfo: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setDeliveryInfo: (state, action: PayloadAction<DeliveryInfo>) => {
      state.deliveryInfo = action.payload;
    },
    clearDeliveryInfo: (state) => {
      state.deliveryInfo = null;
    },
  },
});

export const { setDeliveryInfo, clearDeliveryInfo } = deliverySlice.actions;
export default deliverySlice.reducer;