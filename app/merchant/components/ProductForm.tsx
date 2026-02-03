import React from 'react';
import { Upload, Loader, Image as ImageIcon, X } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Category } from '@/app/components/CategoryTabs';

interface ProductFormProps {
  formData: {
    name: string;
    description: string;
    category: Category;
    price: number
  };
  imagePreview: string;
  uploading: boolean;
  error?: string | null;
  categories: Category[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  imagePreview,
  uploading,
  error,
  categories,
  onInputChange,
  onImageChange,
  onImageRemove,
  onSubmit,
}) => {
  return (
    <div className="mb-12 bg-white rounded-2xl border-2 border-purple-200 p-6 md:p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-purple-500" />
        Add New Product
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Form Inputs */}
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="e.g., Colorful Beaded Keychain"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                placeholder="Describe your product..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 resize-none"
              />
            </div>
            {/* Price */}
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price
        </label>
        <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onInputChange}
            min={0}
            step={0.01}
            placeholder="e.g., 150.00"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
        />
        </div>


            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={onInputChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
                id="image-input"
                disabled={uploading}
              />
              <label
                htmlFor="image-input"
                className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 bg-gray-50"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <ImageIcon className="w-12 h-12 text-purple-400 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">Click to upload image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 50MB</p>
                  </div>
                )}
              </label>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={onImageRemove}
                className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Remove Image
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Product
            </>
          )}
        </button>
      </form>
    </div>
  );
};