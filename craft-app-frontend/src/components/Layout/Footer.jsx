export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">About</h3>
            <p className="mt-4 text-sm text-gray-600">
              CraftMarket connects artisans with customers who value unique, handcrafted products.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><a href="/products" className="hover:text-gray-900">Products</a></li>
              <li><a href="/about" className="hover:text-gray-900">About</a></li>
              <li><a href="/contact" className="hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li><a href="/orders" className="hover:text-gray-900">My Orders</a></li>
              <li><a href="/profile" className="hover:text-gray-900">Profile</a></li>
              <li><a href="/login" className="hover:text-gray-900">Login</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
            <p className="mt-4 text-sm text-gray-600">
              Follow us for the latest updates on new crafts and artisan stories.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t py-6 text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CraftMarket. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 space-x-4">
            <a href="/privacy" className="hover:text-gray-900">Privacy</a>
            <a href="/terms" className="hover:text-gray-900">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
