import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    // height: '100vh',
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    dispaly:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  paper: {
    // margin: theme.spacing(8, 4),
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textfield:{
    width: '100%',
    '& input:valid:focus ~ fieldset':{
      borderLeftWidth: 6
    }
  }

}));

export default function Animate1() {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  const props = useSpring({
    number:value,
    from:{
      number:0
    }
  });
  return (
    <>
      <CssBaseline classes={classes.root}>
        <Typography>
          <Grid container component={Paper} direction="column">
            <TextField
              label="账户名"
              margin="normal"
              variant="outlined"
              type="number"

            >
            </TextField>
            <animated.span>{props.number}</animated.span>
          </Grid>
        </Typography>
      </CssBaseline>
    </>
  )
}
