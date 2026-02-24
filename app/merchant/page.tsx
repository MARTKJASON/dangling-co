'use client';

import React, { FC, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Category } from '../lib/products';
import { useProducts } from '../hooks/useProducts';
import { useProductUpload } from '../hooks/useProductUpload';
import { useProductFilter } from '../hooks/useProductFilter';
import { useProductEdit } from '../hooks/useProductEdit'; 
import { UserHeader } from './components/UserHeader';
import { LoginPage } from './components/LoginPage';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { EditProductModal } from './components/EditProductModal'; // ← new modal

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

const MerchantPage: FC = () => {
  const categories: Category[] = ['keychain', 'necklace', 'bracelet', 'anklet', 'magnet'];
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Authentication
  const {
    user,
    loading: authLoading,
    error: authError,
    signInWithGoogle,
    signOut,
    isAuthenticated,
  } = useAuth();

  // Hooks for product management
  const { products, loading, loadProducts, deleteProduct, addProduct, updateProduct } = useProducts();
  const {
    formData,
    imageFile,
    imagePreview,
    uploading,
    error: uploadError,
    setFormData,
    handleImageChange,
    removeImage,
    uploadProduct,
  } = useProductUpload();
  const { searchQuery, activeCategory, filteredProducts, setSearchQuery, setActiveCategory } =
    useProductFilter(products);

  const {
    editingProduct,
    editFormData,
    imagePreview: editImagePreview,
    updating,
    error: editError,
    openEdit,
    closeEdit,
    setEditFormData,
    handleImageChange: handleEditImageChange,
    removeImage: removeEditImage,
    updateProduct: commitEdit,
  } = useProductEdit();


  // Load products on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated, loadProducts]);

  // Toast notification handler
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Show loading state while checking authentication
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

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage onGoogleSignIn={signInWithGoogle} loading={authLoading} error={authError} />
    );
  }

  // Show authenticated dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-pink-50">
      {/* User Header */}
      <UserHeader
        userName={user!.name}
        userEmail={user!.email}
        userAvatar={user!.avatar_url}
        onSignOut={signOut}
        loading={authLoading}
      />

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">
          {/* Page Title Section */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Manage Your Products
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Add, edit, and organize your beaded jewelry collection
            </p>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Left Column - Product Form */}
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

            {/* Right Column - Product List */}
            <div className="lg:col-span-2">
              <ProductList
                products={products}
                categories={categories}
                loading={loading}
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                onSearchChange={setSearchQuery}
                onCategoryChange={setActiveCategory}
                onEdit={openEdit} // ← pass openEdit handler
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
        </div>
      </main>

      {/* ── Edit Product Modal ─────────────────────────────────────────────── */}
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
              updateProduct(updatedProduct); // update in local state
              addToast('Product updated successfully!', 'success');
              closeEdit();
            } catch (err) {
              console.error('Error updating product:', err);
              addToast('Failed to update product', 'error');
            }
          }}
        />
      )}
      {/* ──────────────────────────────────────────────────────────────────── */}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 pointer-events-auto ${
              toast.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`text-sm sm:text-base font-medium ${
                toast.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {toast.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantPage;