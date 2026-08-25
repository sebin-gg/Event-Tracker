import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FOCES Events heading', async () => {
  render(<App />);
  const heading = await screen.findByText(/FOCES Events/i);
  expect(heading).toBeInTheDocument();
});
