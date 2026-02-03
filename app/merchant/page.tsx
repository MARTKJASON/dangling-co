'use client';

import React, { FC } from 'react';

import { useAuth } from '../hooks/useAuth';
import { Category } from '../lib/products';
import { useProducts } from '../hooks/useProducts';
import { useProductUpload } from '../hooks/useProductUpload';
import { useProductFilter } from '../hooks/useProductFilter';
import { UserHeader } from './components/UserHeader';
import { LoginPage } from './components/LoginPage';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';


const MerchantPage: FC = () => {
  const categories: Category[] = ['keychain', 'necklace', 'bracelet', 'anklet', 'magnet'];

  // Authentication
  const { user, loading: authLoading, error: authError, signInWithGoogle, signOut, isAuthenticated } = useAuth();

  // Hooks for product management
  const { products, loading, loadProducts, deleteProduct, addProduct } = useProducts();
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

  // Load products on mount (only if authenticated)
  React.useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated, loadProducts]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage
        onGoogleSignIn={signInWithGoogle}
        loading={authLoading}
        error={authError}
      />
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Product Form */}
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
            if (file) {
              handleImageChange(file);
            }
          }}
          onImageRemove={removeImage}
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const newProduct = await uploadProduct();
              addProduct(newProduct);
              alert('Product uploaded successfully!');
            } catch (err) {
              console.error('Error uploading product:', err);
            }
          }}
        />

        {/* Product List */}
        <ProductList
          products={products}
          categories={categories}
          loading={loading}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          onSearchChange={setSearchQuery}
          onCategoryChange={setActiveCategory}
          onDelete={async (id, imageUrl) => {
            if (!confirm('Are you sure you want to delete this product?')) return;

            try {
              await deleteProduct(id, imageUrl);
              alert('Product deleted successfully');
            } catch (err) {
              console.error('Error deleting product:', err);
            }
          }}
        />
      </div>
    </div>
  );
};

export default MerchantPage;