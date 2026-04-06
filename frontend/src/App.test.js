import { render, screen } from '@testing-library/react';
import App from './App';

test('renders detectx hero title', () => {
  render(<App />);
  const title = screen.getByText(/DetectX – Fake Profile Detection Platform/i);
  expect(title).toBeInTheDocument();
});
