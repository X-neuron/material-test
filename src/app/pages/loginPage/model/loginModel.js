
import { action } from 'easy-peasy';


const loginModel = {
  regItems: {
    tel: '',
    account: '',
    Pwd: '',
    conformPwd: '',
    email: '',
    clientPriKey: '',
    clientPubKey: ''
  },

  setRegMess: action((state, playload) => {
    state.regItems = { ...playload }
  })
}

export default loginModel;
