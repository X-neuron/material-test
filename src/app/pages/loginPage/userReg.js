import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { makeStyles } from '@material-ui/core/styles';

// import ecc from 'eosjs-ecc';
import  * as nacl from 'tweetnacl-ts';
import { useStoreState, useStoreActions } from 'easy-peasy';

import axios from '../../../../static/axiosConfig';
import { SchemaModel, StringType } from '../../utils/schema-typed/index';
import { useFormx } from '../../utils/hookFormX/hookFormX';


function Uint8ArrayToString(fileData) {
  let dataString = '';
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }

  return dataString
}

function stringToUint8Array(str) {
  const arr = [];
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }

  const tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array;
}


const userRegSchema = SchemaModel({
  account: StringType().isRequired('用户账户不能为空').rangeLength(3, 18, '账户由3~18位只能包含字母、数字和下划线的字符组成'),
  tel: StringType().isRequired('手机号不建议为空，注册后可以用手机号登陆').addRule((value, data) => {
    const telPattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
    return !!telPattern.test(value);
  }, '请输入正确的手机号'),
  email: StringType().isRequired('邮箱号不建议为空，注册后可以用邮箱号登陆').isEmail('请输入正确的邮件账号'),
  pwd: StringType().isRequired('密码不能为空').rangeLength(6, 18, '密码由6~18位只能包含字母、数字和下划线的字符组成').addRule((value, data) => {
    if (data.conformPwd == null) {
      return true
    }
    if (value !== data.conformPwd) {
      return false;
    }
    return true;
  }, '密码输入不一致'),
  conformPwd: StringType().isRequired('密码不能为空').rangeLength(6, 18, '密码由6~18位只能包含字母、数字和下划线的字符组成').addRule((value, data) => {
    if (value !== data.pwd) {
      return false;
    }
    return true;
  }, '密码输入不一致')
  // birthday:DateType().isRequired('出生日期不能为空'),
  // education:StringType().isRequired('学历不能为空')
});

const useStyles = makeStyles(theme => ({
  textfield: {
    margin: theme.spacing(2),
    width: '95%',
    '& input:valid:focus ~ fieldset': {
      borderLeftWidth: 6
    }
  },
  submit: {
    margin: theme.spacing(2),
    width: '95%'
  }
}));

export default function UserReg() {
  const classes = useStyles();

  const tel = useStoreState(state => state.loginModel.regItems.tel);
  const account = useStoreState(state => state.loginModel.regItems.account);
  const pwd = useStoreState(state => state.loginModel.regItems.pwd);
  const email = useStoreState(state => state.loginModel.regItems.email);
  const clientPriKey = useStoreState(state => state.loginModel.regItems.clientPriKey);
  const clientPubKey = useStoreState(state => state.loginModel.regItems.clientPubKey);

  const setRegMess = useStoreActions(actions => actions.loginModel.setRegMess);

  const { useInput, isValid, values } = useFormx({ tel, account, pwd, email }, userRegSchema);
  const [statics, setStatics] = React.useState({
    showPassword: false
  });
  const handleClickShowPassword = () => {
    setStatics({ ...statics, showPassword: !statics.showPassword });
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleRegUser = async (e) => {
    e.preventDefault();
    const boxKeyPair = nacl.box_keyPair();
    const signBoxKeyPair = nacl.sign_keyPair(); // just for exchange


    const res = await axios.get('/session', {
      params: {
        reqKey: nacl.encodeBase64(nacl.sign(boxKeyPair.publicKey, signBoxKeyPair.secretKey)),
        reqSig: nacl.encodeBase64(signBoxKeyPair.publicKey)
        // requestKey:
      }
    });
    console.log(res);
    if (res.status === 200) {
      const serverKey = nacl.sign_open(nacl.decodeBase64(res.data.res_data.resKey), nacl.decodeBase64(res.data.res_data.resSig));
      const shareKey = nacl.box_before(serverKey, boxKeyPair.secretKey)
      // const xn_ss = nacl.box_after(nacl.decodeBase64(res.data.res_data.xn_ss), nacl.decodeBase64(res.data.res_data.nonce), shareKey);
      // console.log(Uint8ArrayToString(xn_ss));
    }

    //   const regres = await axios.post('/users', {
    //     params: {
    //       account: ecc.Aes.encrypt(priKey, serverPubKey, values.account),
    //       tel: ecc.Aes.encrypt(priKey, serverPubKey, values.tel),
    //       email: ecc.Aes.encrypt(priKey, serverPubKey, values.email),
    //       pwd: ecc.Aes.encrypt(priKey, serverPubKey, values.pwd)
    //     }
    //   });

    //   setRegMess({ ...values, clientPriKey: priKey, clientPubKey: pubKey, serverPubKey });
    //   // 使用 serverPubKey 加密敏感信息
    // }
  }
  return (
    <>
      <TextField
        className={classes.textfield}
        autoComplete
        placeholder="hello"
        label="账户名"
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          )
        }}
        {...useInput('account', 'blur')}
      />
      <TextField
        className={classes.textfield}
        autoComplete
        placeholder="hello"
        label="手机号"
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon />
            </InputAdornment>
          )
        }}
        {...useInput('tel', 'blur')}
      />
      <TextField
        className={classes.textfield}
        autoComplete
        placeholder="hello"
        label="邮箱"
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          )
        }}
        {...useInput('email', 'blur')}
      />
      <TextField
        className={classes.textfield}
        autoComplete
        placeholder="hello"
        label="密码"
        margin="normal"
        variant="outlined"
        type={statics.showPassword ? 'text' : 'password'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VpnKeyIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {statics.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        {...useInput('pwd', 'change')}
      />
      <TextField
        className={classes.textfield}
        autoComplete
        label="确认密码"
        margin="normal"
        variant="outlined"
        type={statics.showPassword ? 'text' : 'password'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VpnKeyIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {statics.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        {...useInput('conformPwd', 'change')}
      />
      <Button
        type="submit"
        fullWidth
        // disabled={isValid}
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={handleRegUser}
      >
        确 认 注 册
      </Button>
    </>
  )
}
