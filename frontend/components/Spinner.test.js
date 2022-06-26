// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import Spinner from './Spinner'
import { render, screen } from '@testing-library/react'

test('renders', () => {
  render(<Spinner on={true}/>)
})

test('if spinner on it is in the document', () => {
  render(<Spinner on={true} />);
  const spinner = screen.getByText(/please wait.../i);
  expect(spinner).toBeTruthy();
})

test('if spinner is false it is NOT in the document', () => {
  render(<Spinner on={false} />);
  const spinner = screen.queryByText(/please wait.../i);
  expect(spinner).toBeFalsy();
})
