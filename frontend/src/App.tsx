import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: 'auto',
  maxWidth: 300,
  backgroundColor: theme.palette.background.default,
}));

const DisplayTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    textAlign: 'right',
    fontSize: '1.5rem',
    fontFamily: 'monospace',
  },
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      performCalculation(operator, inputValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = async (op: string, secondOperand: number) => {
    if (firstOperand === null) {
      return;
    }

    setLoading(true);
    try {
      const result = await backend.calculate(firstOperand, secondOperand, op);
      if (result !== null) {
        setDisplay(result.toString());
        setFirstOperand(result);
        setOperator(null);
      } else {
        setDisplay('Error');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setDisplay('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      performCalculation(operator, parseFloat(display));
    }
  };

  const buttonConfig = [
    { text: '7', onClick: () => inputDigit('7') },
    { text: '8', onClick: () => inputDigit('8') },
    { text: '9', onClick: () => inputDigit('9') },
    { text: '÷', onClick: () => handleOperator('/') },
    { text: '4', onClick: () => inputDigit('4') },
    { text: '5', onClick: () => inputDigit('5') },
    { text: '6', onClick: () => inputDigit('6') },
    { text: '×', onClick: () => handleOperator('*') },
    { text: '1', onClick: () => inputDigit('1') },
    { text: '2', onClick: () => inputDigit('2') },
    { text: '3', onClick: () => inputDigit('3') },
    { text: '-', onClick: () => handleOperator('-') },
    { text: '0', onClick: () => inputDigit('0') },
    { text: '.', onClick: inputDecimal },
    { text: '=', onClick: handleEquals },
    { text: '+', onClick: () => handleOperator('+') },
  ];

  return (
    <CalculatorPaper elevation={3}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <DisplayTextField
            fullWidth
            variant="outlined"
            value={display}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={clear}
          >
            Clear
          </Button>
        </Grid>
        {buttonConfig.map((button, index) => (
          <Grid item xs={3} key={index}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={button.onClick}
              disabled={loading}
            >
              {button.text}
            </Button>
          </Grid>
        ))}
      </Grid>
      {loading && (
        <CircularProgress
          size={24}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </CalculatorPaper>
  );
};

export default App;
