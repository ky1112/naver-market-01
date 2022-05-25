import { Step, StepLabel, Stepper } from '@material-ui/core';
import React from 'react';
import useStyles from '../utils/styles';

export default function CheckoutWizard({ activeStep = 0 }) {
  const classes = useStyles();
  return (
    <Stepper
      className={classes.transparentBackgroud}
      activeStep={activeStep}
      alternativeLabel
    >
      {['로그인', '배송주소', '결제방법', '주문완료'].map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
