import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import App from '../src/App';

test('renders main UI', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByText(/Todos/i)).toBeInTheDocument();
  expect(screen.getByText(/Categories/i)).toBeInTheDocument();
});
