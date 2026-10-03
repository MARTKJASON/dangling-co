'use client';

import React, { FC, useEffect, useState } from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
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
  const categories: Category[] = ['keychain', 'necklace', 'bracelet / anklet', 'magnet'];
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('products');

  const {
    user, loading: authLoading, error: authError,
    signInWithGoogle, signOut, isAuthenticated,
  } = useAuth();

  const { products, loading, loadProducts, deleteProduct, addProduct, updateProduct } = useProducts();
  const {
    formData, images, uploading, error: uploadError,
    setFormData, addImages, removeImage, removeAllImages, reorderImage, uploadProduct,
  } = useProductUpload();
  const { searchQuery, activeCategory, setSearchQuery, setActiveCategory } = useProductFilter(products);
  const {
    editingProduct, editFormData, imageSlots, updating, error: editError,
    openEdit, closeEdit, setEditFormData,
    addImages: addEditImages,
    replaceImage: replaceEditImage,
    removeImage: removeEditImage,
    reorderImage: reorderEditImage,
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
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3" role="status">
          <Loader2 className="w-8 h-8 animate-spin text-peri-600" aria-hidden="true" />
          <p className="text-[15px] text-ink-600">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onGoogleSignIn={signInWithGoogle} loading={authLoading} error={authError} />;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      <UserHeader
        userName={user!.name}
        userEmail={user!.email}
        userAvatar={user!.avatar_url}
        onSignOut={signOut}
        loading={authLoading}
      >
        <nav aria-label="Dashboard sections" className="flex h-full gap-6">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-2 h-full min-h-[44px] border-b-2 text-[15px] font-semibold transition-colors ${
                  isActive
                    ? 'text-ink-900 border-peri-600'
                    : 'text-ink-600 border-transparent hover:text-ink-900'
                }`}
              >
                {tab.label}
                {tab.id === 'orders' && pendingCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-butter-400 text-ink-900 text-xs font-bold tabular-nums"
                    aria-label={`${pendingCount} pending`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </UserHeader>

      <main className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="space-y-8">

          {/* Page title */}
          <div className="space-y-1.5">
            <h1 className="font-display text-4xl font-semibold text-ink-900">
              {activeTab === 'products' ? 'Products' : 'Orders'}
            </h1>
            <p className="text-[15px] text-ink-600">
              {activeTab === 'products'
                ? 'Add new pieces and keep your catalog up to date.'
                : 'Confirm, make and complete customer orders.'}
            </p>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto rounded-card">
                  <ProductForm
                    formData={formData}
                    images={images}
                    uploading={uploading}
                    error={uploadError}
                    categories={categories}
                    onInputChange={(e) => {
                      const { name, value } = e.target;
                      setFormData({ [name]: name === 'price' ? parseFloat(value) || 0 : value });
                    }}
                    onAddImages={addImages}
                    onRemoveImage={removeImage}
                    onReorderImage={reorderImage}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const newProduct = await uploadProduct();
                        addProduct(newProduct);
                        addToast('Product uploaded successfully!', 'success');
                        setFormData({ name: '', description: '', category: 'keychain', price: 0 });
                        removeAllImages();
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
            <div className="animate-fade-in">
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
          imageSlots={imageSlots}
          updating={updating}
          error={editError}
          categories={categories}
          onInputChange={(e) => {
            const { name, value } = e.target;
            setEditFormData({ [name]: name === 'price' ? parseFloat(value) || 0 : value });
          }}
          onAddImages={addEditImages}
          onReplaceImage={replaceEditImage}
          onRemoveImage={removeEditImage}
          onReorderImage={reorderEditImage}
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
      <div
        className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-[60] flex flex-col gap-3 sm:w-[360px] pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-overlay animate-fade-up pointer-events-auto ${
              toast.type === 'success' ? 'bg-ink-900 text-white' : 'bg-cherry-100 text-cherry-700'
            }`}
          >
            {toast.type === 'success' ? (
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-sage-400 text-ink-900">
                <Check className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
              </span>
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            )}
            <p className="text-[15px] font-semibold">{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantPage;