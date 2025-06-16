import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Select from "@/components/misc/Select";
import { getUsers, getExpenseCategories } from '@/stores/features/ajaxFeature';
import { CalendarDays, Upload, X, Eye } from 'lucide-react';

const ExpenseForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { users, expenseCategories } = useSelector((state) => state.ajax);

  // State for select components to work with FormData
  const [selectedUser, setSelectedUser] = useState(initialData?.user_id || '');
  const [selectedCategory, setSelectedCategory] = useState(initialData?.expense_category_id || '');
  
  // State for file preview
  const [proofPreview, setProofPreview] = useState(null);
  const [proofFile, setProofFile] = useState(null);

  useEffect(() => {
    if (!users) dispatch(getUsers());
    if (!expenseCategories) dispatch(getExpenseCategories());
  }, [dispatch, users, expenseCategories]);

  useEffect(() => {
    if (initialData) {
      setSelectedUser(initialData.user_id || '');
      setSelectedCategory(initialData.expense_category_id || '');
      
      // Set existing receipt preview if available
      if (initialData.receipt_path) {
        setProofPreview(initialData.receipt_path);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // Add the proof file if selected
    if (proofFile) {
      formData.append('receipt', proofFile);
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

  const userOptions = users ? users.map(user => ({
    value: user.id,
    label: user.name
  })) : [];

  const categoryOptions = expenseCategories ? expenseCategories.map(category => ({
    value: category.id,
    label: category.name
  })) : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden inputs for select values */}
      <input type="hidden" name="user_id" value={selectedUser} />
      <input type="hidden" name="expense_category_id" value={selectedCategory} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <Label htmlFor="receipt">{t('Receipt')}</Label>
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

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('Saving...') : (initialData ? t('Update') : t('Create'))}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
