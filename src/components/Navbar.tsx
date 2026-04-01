import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Store, Package, LogOut, User, Menu, X, Shield } from 'lucide-react';
import { LoginForm, SignUpForm } from './AuthForms';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSignOut() {
    signOut();
    window.location.href = '/';
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <a href="/" className="text-2xl font-bold text-gray-900">
                MarketPlace
              </a>

              <div className="hidden md:flex items-center gap-6">
                <a
                  href="/"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Shop
                </a>
                {profile?.role === 'vendor' && (
                  <a
                    href="/vendor"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <Store size={18} />
                    My Store
                  </a>
                )}
                {profile?.role === 'admin' && (
                  <a
                    href="/admin"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <Shield size={18} />
                    Admin
                  </a>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <a
                    href="/orders"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <Package size={20} />
                    Orders
                  </a>
                  {profile?.role === 'vendor' && (
                    <a
                      href="/vendor/orders"
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <Package size={20} />
                      Vendor Orders
                    </a>
                  )}
                  <a
                    href="/cart"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <ShoppingCart size={20} />
                    Cart
                  </a>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={20} />
                    <span className="text-sm">{profile?.full_name || profile?.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <a href="/" className="text-gray-700 hover:text-gray-900">
                  Shop
                </a>
                {user ? (
                  <>
                    {profile?.role === 'vendor' && (
                      <>
                        <a href="/vendor" className="text-gray-700 hover:text-gray-900">
                          My Store
                        </a>
                        <a href="/vendor/orders" className="text-gray-700 hover:text-gray-900">
                          Vendor Orders
                        </a>
                      </>
                    )}
                    {profile?.role === 'admin' && (
                      <a href="/admin" className="text-gray-700 hover:text-gray-900">
                        Admin Panel
                      </a>
                    )}
                    <a href="/orders" className="text-gray-700 hover:text-gray-900">
                      My Orders
                    </a>
                    <a href="/cart" className="text-gray-700 hover:text-gray-900">
                      Cart
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="text-left text-gray-700 hover:text-gray-900"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-gray-700 hover:text-gray-900"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('signup');
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-gray-700 hover:text-gray-900"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {authMode === 'login' ? (
              <LoginForm onClose={() => setShowAuthModal(false)} />
            ) : (
              <SignUpForm onClose={() => setShowAuthModal(false)} />
            )}

            <div className="mt-4 text-center text-sm text-gray-600">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
