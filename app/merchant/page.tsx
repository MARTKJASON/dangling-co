'use client';

import React, { FC, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, ShoppingBag, Package } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Category } from '../lib/products';
import { useProducts } from '../hooks/useProducts';
import { useProductUpload } from '../hooks/useProductUpload';
import { useProductFilter } from '../hooks/useProductFilter';
import { useProductEdit } from '../hooks/useProductEdit';
import { useOrders } from '../hooks/useOrders';
import { UserHeader } from './components/UserHeader';
import { LoginPage } from './components/LoginPage';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { EditProductModal } from './components/EditProductModal';
import { OrdersTab } from './components/OrdersTab';

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

type Tab = 'products' | 'orders';

const MerchantPage: FC = () => {
  const categories: Category[] = ['keychain', 'necklace', 'bracelet', 'anklet', 'magnet'];
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('products');

  const {
    user, loading: authLoading, error: authError,
    signInWithGoogle, signOut, isAuthenticated,
  } = useAuth();

  const { products, loading, loadProducts, deleteProduct, addProduct, updateProduct } = useProducts();
  const {
    formData, imagePreview, uploading, error: uploadError,
    setFormData, handleImageChange, removeImage, uploadProduct,
  } = useProductUpload();
  const { searchQuery, activeCategory, setSearchQuery, setActiveCategory } = useProductFilter(products);
  const {
    editingProduct, editFormData, imagePreview: editImagePreview, updating, error: editError,
    openEdit, closeEdit, setEditFormData,
    handleImageChange: handleEditImageChange,
    removeImage: removeEditImage,
    updateProduct: commitEdit,
  } = useProductEdit();

  // For pending badge on Orders tab
  const { orders, loadOrders } = useOrders();
  const pendingCount = orders.filter(o => o.status === 'pending_messenger_confirmation').length;

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
      loadOrders();
    }
  }, [isAuthenticated, loadProducts, loadOrders]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-600 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onGoogleSignIn={signInWithGoogle} loading={authLoading} error={authError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-pink-50">
      <UserHeader
        userName={user!.name}
        userEmail={user!.email}
        userAvatar={user!.avatar_url}
        onSignOut={signOut}
        loading={authLoading}
      />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

          {/* Page title */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Merchant Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your products and customer orders
            </p>
          </div>

          {/* Tab Bar */}
          <div className="flex gap-2 bg-white/60 backdrop-blur-sm p-1.5 rounded-2xl border border-purple-100 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 scale-[1.02]'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Package className="w-4 h-4" />
              Products
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 scale-[1.02]'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
              {pendingCount > 0 && (
                <span className={`inline-flex items-center justify-center w-5 h-5 text-xs font-black rounded-full ${
                  activeTab === 'orders'
                    ? 'bg-white text-purple-600'
                    : 'bg-amber-400 text-white animate-pulse'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 animate-in fade-in duration-300">
              <div className="lg:col-span-1">
                <div className="sticky top-24 sm:top-28 lg:top-32 z-30">
                  <ProductForm
                    formData={formData}
                    imagePreview={imagePreview}
                    uploading={uploading}
                    error={uploadError}
                    categories={categories}
                    onInputChange={(e) => {
                      const { name, value } = e.target;
                      setFormData({ [name]: value });
                    }}
                    onImageChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageChange(file);
                    }}
                    onImageRemove={removeImage}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const newProduct = await uploadProduct();
                        addProduct(newProduct);
                        addToast('Product uploaded successfully!', 'success');
                        setFormData({ name: '', description: '', category: 'keychain', price: 0 });
                        removeImage();
                      } catch (err) {
                        console.error('Error uploading product:', err);
                        addToast('Failed to upload product', 'error');
                      }
                    }}
                  />
                </div>
              </div>
              <div className="lg:col-span-2">
                <ProductList
                  products={products}
                  categories={categories}
                  loading={loading}
                  searchQuery={searchQuery}
                  activeCategory={activeCategory}
                  onSearchChange={setSearchQuery}
                  onCategoryChange={setActiveCategory}
                  onEdit={openEdit}
                  onDelete={async (id, imageUrl) => {
                    try {
                      await deleteProduct(id, imageUrl);
                      addToast('Product deleted successfully', 'success');
                    } catch (err) {
                      console.error('Error deleting product:', err);
                      addToast('Failed to delete product', 'error');
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="animate-in fade-in duration-300">
              <OrdersTab />
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          formData={editFormData}
          imagePreview={editImagePreview}
          updating={updating}
          error={editError}
          categories={categories}
          onInputChange={(e) => {
            const { name, value } = e.target;
            setEditFormData({ [name]: name === 'price' ? parseFloat(value) || 0 : value });
          }}
          onImageChange={handleEditImageChange}
          onImageRemove={removeEditImage}
          onClose={closeEdit}
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const updatedProduct = await commitEdit();
              updateProduct(updatedProduct);
              addToast('Product updated successfully!', 'success');
              closeEdit();
            } catch (err) {
              console.error('Error updating product:', err);
              addToast('Failed to update product', 'error');
            }
          }}
        />
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 space-y-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 pointer-events-auto ${
              toast.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            }
            <p className={`text-sm sm:text-base font-medium ${
              toast.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {toast.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantPage;