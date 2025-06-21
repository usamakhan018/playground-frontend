import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Select from "@/components/misc/Select";
import { getUsers, getExpenseCategories, getGameAssets } from '@/stores/features/ajaxFeature';
import { CalendarDays, Upload, X, Eye, Plus, Trash2 } from 'lucide-react';

const ExpenseForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { users, expenseCategories, gameAssets } = useSelector((state) => state.ajax);

  // State for select components to work with FormData
  const [selectedUser, setSelectedUser] = useState(initialData?.user_id || '');
  const [selectedCategory, setSelectedCategory] = useState(initialData?.expense_category_id || '');
  const [selectedExpenseType, setSelectedExpenseType] = useState(initialData?.expense_type || 'user');
  const [selectedAsset, setSelectedAsset] = useState(initialData?.game_asset_id || '');
  const [selectedStatus, setSelectedStatus] = useState(initialData?.status || 'pending');
  
  // State for file preview (legacy single receipt)
  const [proofPreview, setProofPreview] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  
  // State for multiple images
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    if (!users) dispatch(getUsers());
    if (!expenseCategories) dispatch(getExpenseCategories());
    if (!gameAssets) dispatch(getGameAssets());
  }, [dispatch, users, expenseCategories, gameAssets]);

  useEffect(() => {
    if (initialData) {
      setSelectedUser(initialData.user_id || '');
      setSelectedCategory(initialData.expense_category_id || '');
      setSelectedExpenseType(initialData.expense_type || 'user');
      setSelectedAsset(initialData.game_asset_id || '');
      setSelectedStatus(initialData.status || 'pending');
      
      // Set existing receipt preview if available (legacy)
      if (initialData.receipt_path) {
        setProofPreview(`${import.meta.env.VITE_BASE_URL}${initialData.receipt_path}`);
      }
      
      // Set existing images if available
      if (initialData.images && initialData.images.length > 0) {
        setExistingImages(initialData.images);
      }
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProofPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs and other files, just show filename
        setProofPreview(file.name);
      }
    }
  };

  const removeProof = () => {
    setProofFile(null);
    setProofPreview(null);
    // Reset file input
    const fileInput = document.getElementById('receipt');
    if (fileInput) fileInput.value = '';
  };

  // Handle multiple images
  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newImageFiles = [];
    const newImagePreviews = [];

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        newImageFiles.push(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          newImagePreviews.push({
            id: Date.now() + Math.random(),
            url: e.target.result,
            name: file.name,
            isNew: true
          });
          
          // Update state when all files are processed
          if (newImagePreviews.length === files.length) {
            setImageFiles(prev => [...prev, ...newImageFiles]);
            setImagePreviews(prev => [...prev, ...newImagePreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset file input
    e.target.value = '';
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      const imageToDelete = existingImages[index];
      setImagesToDelete(prev => [...prev, imageToDelete.id]);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // Add the proof file if selected (legacy support)
    if (proofFile) {
      formData.append('receipt', proofFile);
    }
    
    // Add multiple images
    imageFiles.forEach((file, index) => {
      formData.append('images[]', file);
    });
    
    // Add images to delete
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach((imageId) => {
        formData.append('delete_images[]', imageId);
      });
    }
    
    if (initialData) {
      formData.append('id', initialData.id);
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle expense type change to clear dependent fields
  const handleExpenseTypeChange = (selectedOption) => {
    const newType = selectedOption?.value || '';
    setSelectedExpenseType(newType);
    
    // Clear user selection if not user expense
    if (newType !== 'user') {
      setSelectedUser('');
    }
    
    // Clear asset selection if not asset expense
    if (newType !== 'asset') {
      setSelectedAsset('');
    }
  };

  const userOptions = users ? users.map(user => ({
    value: user.id,
    label: user.name
  })) : [];

  const categoryOptions = expenseCategories ? expenseCategories.map(category => ({
    value: category.id,
    label: category.name
  })) : [];

  const assetOptions = gameAssets ? gameAssets.map(asset => ({
    value: asset.id,
    label: `${asset.name} (${asset.game?.name || 'Unknown Game'})`
  })) : [];

  const expenseTypeOptions = [
    { value: 'user', label: t('User Expense') },
    { value: 'company', label: t('Company Expense') },
    { value: 'asset', label: t('Asset Expense') },
    { value: 'general', label: t('General Expense') }
  ];

  const statusOptions = [
    { value: 'pending', label: t('Pending') },
    { value: 'approved', label: t('Approved') },
    { value: 'rejected', label: t('Rejected') }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden inputs for select values */}
      <input type="hidden" name="user_id" value={selectedUser} />
      <input type="hidden" name="expense_category_id" value={selectedCategory} />
      <input type="hidden" name="expense_type" value={selectedExpenseType} />
      <input type="hidden" name="game_asset_id" value={selectedAsset} />
      <input type="hidden" name="status" value={selectedStatus} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expense_type">{t('Expense Type')} *</Label>
          <Select
            options={expenseTypeOptions}
            value={expenseTypeOptions.find(option => option.value === selectedExpenseType) || null}
            onChange={handleExpenseTypeChange}
            placeholder={t('Select Expense Type')}
            isClearable={false}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expense_category_id">{t('Category')} *</Label>
          <Select
            options={categoryOptions}
            value={categoryOptions.find(option => option.value == selectedCategory) || null}
            onChange={(selectedOption) => setSelectedCategory(selectedOption?.value || '')}
            placeholder={t('Select Category')}
            isLoading={!expenseCategories}
            isClearable
          />
        </div>
      </div>

      {/* Conditional User Field - Only for user expenses */}
      {selectedExpenseType === 'user' && (
        <div className="space-y-2">
          <Label htmlFor="user_id">{t('User')} *</Label>
          <Select
            options={userOptions}
            value={userOptions.find(option => option.value == selectedUser) || null}
            onChange={(selectedOption) => setSelectedUser(selectedOption?.value || '')}
            placeholder={t('Select User')}
            isLoading={!users}
            isClearable
          />
        </div>
      )}

      {/* Conditional Asset Field - Only for asset expenses */}
      {selectedExpenseType === 'asset' && (
        <div className="space-y-2">
          <Label htmlFor="game_asset_id">{t('Asset')} *</Label>
          <Select
            options={assetOptions}
            value={assetOptions.find(option => option.value == selectedAsset) || null}
            onChange={(selectedOption) => setSelectedAsset(selectedOption?.value || '')}
            placeholder={t('Select Asset')}
            isLoading={!gameAssets}
            isClearable
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">{t('Amount')} *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialData?.amount || ''}
            placeholder={t('Enter amount')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">{t('Date')} *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={initialData?.date || ''}
            required
            className="w-full cursor-pointer"
            onClick={(e) => e.target.showPicker && e.target.showPicker()}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">{t('Status')}</Label>
        <Select
          options={statusOptions}
          value={statusOptions.find(option => option.value === selectedStatus) || null}
          onChange={(selectedOption) => setSelectedStatus(selectedOption?.value || 'pending')}
          placeholder={t('Select Status')}
          isClearable={false}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('Description')}</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description || ''}
          placeholder={t('Enter description')}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="receipt">{t('Receipt')} ({t('Legacy')})</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              id="receipt"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Upload className="h-4 w-4 text-gray-400" />
          </div>
          
          {/* File Preview */}
          {proofPreview && (
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('Receipt Preview')}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeProof}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {typeof proofPreview === 'string' && proofPreview.startsWith('data:image') ? (
                // New image preview
                <img 
                  src={proofPreview} 
                  alt="Receipt preview" 
                  className="max-w-full h-32 object-contain rounded"
                />
              ) : typeof proofPreview === 'string' && proofPreview.startsWith('http') ? (
                // Existing image from server
                <div className="flex items-center gap-2">
                  <img 
                    src={proofPreview} 
                    alt="Receipt preview" 
                    className="max-w-full h-32 object-contain rounded"
                  />
                  <Button
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(proofPreview, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {t('View Full')}
                  </Button>
                </div>
              ) : (
                // PDF or other file
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📄 {proofPreview}</span>
                  {typeof proofPreview === 'string' && proofPreview.startsWith('http') && (
                    <Button
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(proofPreview, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {t('View')}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          
          <p className="text-xs text-gray-500">{t('Supported formats: JPG, PNG, PDF (Max 2MB)')}</p>
        </div>
      </div>

      {/* Multiple Images Section */}
      <div className="space-y-2">
        <Label htmlFor="images">{t('Multiple Images')} ({t('Recommended')})</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              id="images"
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={handleMultipleImagesChange}
              className="flex-1"
            />
            <Plus className="h-4 w-4 text-gray-400" />
          </div>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">{t('Existing Images')}</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {existingImages.map((image, index) => (
                  <div key={image.id} className="relative border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}${image.image}`}
                      alt={`Existing image ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}${image.image}`, '_blank')}
                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index, true)}
                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New Images Preview */}
          {imagePreviews.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">{t('New Images')}</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={preview.id} className="relative border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={preview.url}
                      alt={`New image ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index, false)}
                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                      {preview.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500">{t('Supported formats: JPG, PNG (Max 2MB each)')}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('Saving...') : (initialData ? t('Update') : t('Create'))}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
