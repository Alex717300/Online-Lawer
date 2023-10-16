import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    authorization: false, checkedAgree: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeAuthUserStatus (state, action) {
            state.authorization = action.payload.authorization;
        },
        changeCheckedAgree (state, action) {
            state.checkedAgree = action.payload.checkedAgree;
        },
    }
});

export const {changeAuthUserStatus, changeCheckedAgree} = authSlice.actions;

export default authSlice.reducer;