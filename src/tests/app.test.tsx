import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { products } from '../data/products';

describe('<App /> — shop UI', () => {
  it('renders the hero and every product card by default', () => {
    render(<App />);
    // hero heading + footer tagline both mention "Crafted with"
    expect(screen.getAllByText(/Crafted with/i).length).toBeGreaterThan(0);
    const resultsHeading = screen.getByRole('heading', { level: 3 });
    expect(resultsHeading.textContent).toContain(`${products.length}`);
    expect(screen.getAllByAltText(products[0].name).length).toBeGreaterThan(0);
  });

  it('filters the grid when searching by flavor note', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText(/search by name/i), 'blueberry');
    expect(screen.queryByText(products[1].name)).not.toBeInTheDocument(); // Colombian Supremo has no blueberry
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
  });

  it('shows the empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText(/search by name/i), 'zzz-no-such-coffee');
    expect(screen.getByText(/No coffees match your search/i)).toBeInTheDocument();
  });

  it('clears the search via the ✕ button', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, 'ethiopia');
    await user.click(screen.getByRole('button', { name: '✕' }));
    expect(input).toHaveValue('');
    expect(screen.getByText(products[1].name)).toBeInTheDocument();
  });

  it('narrows results with category + roast chips', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Blend' }));
    const blends = products.filter((p) => p.category === 'Blend');
    expect(blends.length).toBeGreaterThan(0);
    for (const p of blends) expect(screen.getByText(p.name)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dark' }));
    const darkBlends = blends.filter((p) => p.roast === 'Dark');
    for (const p of darkBlends) expect(screen.getByText(p.name)).toBeInTheDocument();
    // products outside the intersection must be hidden
    for (const p of blends.filter((x) => x.roast !== 'Dark')) {
      expect(screen.queryByText(p.name)).not.toBeInTheDocument();
    }
  });

  it('adds a product to the cart and shows the badge count', async () => {
    const user = userEvent.setup();
    render(<App />);
    const addButtons = screen.getAllByRole('button', { name: /^Add$/ });
    await user.click(addButtons[0]);
    await user.click(addButtons[0]);
    expect(screen.getByText('2')).toBeInTheDocument(); // badge
  });

  it('opens the cart drawer showing line items and total', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole('button', { name: /^Add$/ })[0]);
    await user.click(screen.getByRole('button', { name: /cart/i }));
    expect(screen.getByRole('heading', { name: 'Your Cart' })).toBeInTheDocument();
    // product name appears both on the grid card and the cart line item
    expect(screen.getAllByText(products[0].name).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(`$${products[0].price.toFixed(2)}`).length).toBeGreaterThan(0);
  });

  it('walks the checkout flow to confirmation and empties the cart', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole('button', { name: /^Add$/ })[0]);
    await user.click(screen.getByRole('button', { name: /cart/i }));
    await user.click(screen.getByRole('button', { name: /Proceed to Checkout/i }));
    await user.click(screen.getByRole('button', { name: /Continue to Payment/i }));
    await user.click(screen.getByRole('button', { name: /Place Order/i }));
    expect(screen.getByText(/Processing your order/i)).toBeInTheDocument();
    expect(await screen.findByText(/Order Complete!/i, {}, { timeout: 4000 })).toBeInTheDocument();
  });

  it('opens the product detail modal from a card image', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole('button', { name: /View Details/i })[0]);
    expect(screen.getByText(/Brewing Suggestions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '✕' }));
    expect(screen.queryByText(/Brewing Suggestions/i)).not.toBeInTheDocument();
  });

  it('mounts the sparkle canvas only in desktop-pointer environments', () => {
    const { unmount } = render(<App />);
    // setup.ts stubs matchMedia as desktop+fine pointer → canvas present
    expect(document.querySelector('[data-testid="sparkle-field"]')).toBeInTheDocument();
    unmount();
  });

  it('scroll state toggles header backdrop classes without crashing', () => {
    render(<App />);
    // jsdom always reports scrollY = 0; firing the listener just must not throw
    fireEvent(window, new Event('scroll'));
    expect(screen.getAllByText('Ember & Bloom').length).toBeGreaterThan(0);
  });
});
