
import { action } from 'easy-peasy';

export const counterModel = {
  items:{
    startNum: 0,
    curNum: 0,
    step: 0,
    calStatic: false,
    startBtnDisable: false,
    stopBtnDisable: true
  },

  addStep: action((state) => {
    state.items.calStatic && (state.items.curNum += state.items.step);
  }),

  subStep: action((state) => {
    state.items.calStatic && (state.items.curNum -= state.items.step);
  }),

  setStartNum: action((state, payload) => {
    // console.log(state)
    state.items.startNum = parseInt(payload, 16);
    state.items.curNum = parseInt(payload, 16);
  }),

  setStep: action((state, payload) => {
    state.items.step = parseInt(payload, 16);
  }),

  startCount: action((state) => {
    state.items.calStatic = true;
    state.items.startBtnDisable = !state.items.startBtnDisable;
    state.items.stopBtnDisable = !state.items.stopBtnDisable;
  }),

  stopCount: action((state) => {
    state.items.calStatic = false;
    state.items.startBtnDisable = !state.items.startBtnDisable;
    state.items.stopBtnDisable = !state.items.stopBtnDisable;
  })
}
