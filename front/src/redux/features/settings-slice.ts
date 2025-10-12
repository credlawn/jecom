import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SiteSettings } from "@/types/settings";

const initialState: SiteSettings = {
  visitorTracking: 0,
  currency: '₹',
  showMobileLogo: 1,
  autoSlideHero: 1,
  logoUrl: '',
  cardSize: 72,
  mobileCardSize: 72,
  tabCardSize: 72,
  imageSize: 56,
  mobileImageSize: 56,
  tabImageSize: 56,
  cardBg: 'white',
  imageBg: 'transparent',
  textColor: 'black',
  primaryColor: 'red-500',
  secondaryColor: 'natural-900',
  thirdColor: 'red-500',
  button1Color: 'red-500',
  button2Color: 'green-600',
  button3Color: 'blue-500',
  button1TextColor: 'natural-900',
  button2TextColor: 'white',
  button3TextColor: 'blue',
  starColor1: '#f51818',
  starColor2: '#f51818',
  showTopBanner: 0,
  bannerUrl: '',
  bannerAnimation: '',
  bgColor: '',
  bgShadowColor: '',
  mobFontColor: '',
  lapFontColor: '',
  mobFtWeight: 0,
  lapFtWeight: 0,
  mobFtSize: 0,
  lapFtSize: 0,
  mobHeight: '',
  lapHeight: '',
};


export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SiteSettings>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export const selectSettings = (state: { settingsReducer: SiteSettings }) => state.settingsReducer;
export default settingsSlice.reducer;
