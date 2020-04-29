import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Grid  from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper  from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { store } from '../../store/store';
import { counterModel } from './counterModel';

store.addModel('counter', counterModel);

const useStyles = makeStyles(theme => ({
  grid: {
    margin:theme.spacing(2),
    padding:theme.spacing(1)
  },
  avatar: {
    margin: theme.spacing(1),
    width: 30,
    height:30
  },
  bigAvatar: {
    margin: theme.spacing(1),
    width: 60,
    height: 60
  },
  // Badge:{
  //   margin: theme.spacing(1)
  // },
  form:{
    margin:theme.spacing(2),
    display:'flex',
    flexWrap:'wrap',
    flexDirection:'column'
  },
  TextField:{
    margin:theme.spacing(1)
  }
}));

export default function Counter() {
  const classes = useStyles();

  const curCounter = useStoreState(state => state.counter.items);
  const setStartNum = useStoreActions(actions => actions.counter.setStartNum);
  const setStep = useStoreActions(actions => actions.counter.setStep);
  const startCount = useStoreActions(actions => actions.counter.startCount);
  const stopCount = useStoreActions(actions => actions.counter.stopCount);
  const addStep = useStoreActions(actions => actions.counter.addStep);

  useEffect(() => {
    const i = setInterval(() => addStep(), 1000);
    return () => clearInterval(i);
  }, [curCounter.calStatic, addStep]);

  return (
    <Grid container justify="center" alignItems="center">
      <CssBaseline>
        <Grid className={classes.grid} item xs={2} component={Paper}>

          <Badge badgeContent={curCounter.curNum} color="primary" max={1000}>
            <Avatar alt="user1" src="/statics/images/1.jpg" className={classes.avatar} />
          </Badge>

        </Grid>
        <Grid className={classes.grid} item xs={2} component={Paper}>

          <Badge badgeContent={curCounter.curNum} color="primary">
            <Avatar alt="user2" src="/statics/images/2.jpg" className={classes.bigAvatar} />
          </Badge>

        </Grid>
        <Grid className={classes.grid} item xs={12} component={Paper}>
          <Typography align="center" variant="h5">
            current message is {curCounter.curNum}
          </Typography>
        </Grid>
        <form className={classes.form}>
          <TextField
            className={classes.TextField}
            autoComplete
            autoFocus
            placeholder="设置初始值"
            required
            label="设置消息数"
            helperText="设置该值可以改变当前的显示的消息数"
            // multiline
            margin="normal"
            variant="outlined"
            defaultValue={0}
            error={false}
            value={curCounter.startNum}
            type="number"
            onChange={e => setStartNum(e.target.value)}
          />
          <TextField
            className={classes.TextField}
            autoComplete
            autoFocus
            placeholder="步进值必须大于0"
            required
            label="设置步进值"
            // multiline
            margin="normal"
            variant="outlined"
            defaultValue={0}
            error={false}
            value={curCounter.step}
            type="number"
            onChange={e => setStep(e.target.value)}
          />
          <Button disabled={curCounter.startBtnDisable} color="primary" variant="contained" onClick={() => startCount()}>
            开始计数
          </Button>
          <Button disabled={curCounter.stopBtnDisable} color="primary" variant="contained" onClick={() => stopCount()}>
            停止计数
          </Button>
        </form>
      </CssBaseline>
    </Grid>
  )
}


