import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
// import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Switch from '@material-ui/core/Switch';

import Slide from '@material-ui/core/Slide';


// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   DateTimePicker
// } from '@material-ui/pickers';

// import { SchemaModel, StringType, DateType, useFormx } from 'hookformx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import loadable from '@loadable/component';
import axios from '../../../../static/axiosConfig';

import { SchemaModel, StringType, BooleanType } from '../../utils/schema-typed/index';
import { useFormx } from '../../utils/hookFormX/hookFormX';

import { store } from '../../store/store';
import loginModel from './model/loginModel';

const UserReg = loadable(() => import('./userReg'));


store.addModel('loginModel', loginModel);

function getStepContent(step) {
  switch (step) {
    case 0:
      return <UserReg />;
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}


const loginFormSchema = SchemaModel({
  account: StringType().isRequired(' 你是不是傻！？ 没有账号怎么登录？'),
  pwd: StringType().isRequired('密码不能为空'),
  rememberMe: BooleanType()
});


const Transition = React.forwardRef(function Transition(props, ref) {
  // return <Slide direction="up" ref={ref} {...props} />;
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    dispaly: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  regRadio: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  paper: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textfield: {
    margin: theme.spacing(2),
    width: '95%',
    '& input:valid:focus ~ fieldset': {
      borderLeftWidth: 6
    }
  },
  avatar: {
    // margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignInSide() {
  const classes = useStyles();
  const [regOpen, setRegOpen] = useState(false);
  const [mesOpen, setMesOpen] = useState(false);

  const { useInput, isValid, values } = useFormx({}, loginFormSchema);

  const [statics, setStatics] = React.useState({
    showPassword: false
  });
  const handleClickShowPassword = () => {
    setStatics({ ...statics, showPassword: !statics.showPassword });
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = ['账号注册', '账号登陆', '完善账户(开发者)信息', '创建应用', '创建成功'];

  const isStepOptional = step => step === 1;

  const isStepSkipped = step => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('/users', {
      params: {
        ...regValues
      }
    }).then((res) => {

    });
    // axios.post('/user', JSON.stringify(regValues)).then((res) => {

    // });
  }
  return (
    // <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={6} md={3} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            登  陆
          </Typography>
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
            {...useInput('account', 'change')}
          />
          {/* <TextField */}
          {/* <OutlinedInput */}
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
          <Grid container alignContent="space-between" alignItems="baseline">
            <Grid item xs>
              {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="记住我"
                /> */}
              <FormControlLabel control={<Switch {...useInput('rememberMe', 'change')} />} label="记住我" />
            </Grid>
            <Grid item>
              <Button>
                忘记密码？
              </Button>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            disabled={isValid}
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            登     陆
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={() => setRegOpen(true)}>
                账户/APP应用注册
              </Button>
              <Dialog open={regOpen} onClose={() => setRegOpen(false)} TransitionComponent={Transition}>
                <DialogTitle>账户/APP应用注册</DialogTitle>
                <DialogContent>
                  <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                      const stepProps = {};
                      const labelProps = {};
                      if (isStepOptional(index)) {
                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                      }
                      if (isStepSkipped(index)) {
                        stepProps.completed = false;
                      }
                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  <div>
                    {activeStep === steps.length ? (
                      <div>
                        <Typography className={classes.instructions}>
                          All steps completed - you&apos;re finished
                        </Typography>
                        <Button onClick={handleReset} className={classes.button}>
                          Reset
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                        <div>
                          <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                              Back
                          </Button>
                          {isStepOptional(activeStep) && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSkip}
                            className={classes.button}
                          >
                                Skip
                          </Button>
                          )}

                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setRegOpen(false)} color="primary">
                    取  消
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
          {/* <Box mt={5}> */}
          {/* <MadeWithLove /> */}
          {/* </Box> */}

        </div>
      </Grid>
    </Grid>
    // </MuiPickersUtilsProvider>
  );
}
