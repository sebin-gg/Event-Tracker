import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FOCES Events heading', () => {
  render(<App />);
  const heading = screen.getByText(/FOCES Events/i);
  expect(heading).toBeInTheDocument();
});
