import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, FilterIcon, Minus, Plus, RotateCcw, Check } from 'lucide-react';

const colors = [
  { id: 'beige', name: 'Beige', color: '#e8d9c7' },
  { id: 'blue', name: 'Blue', color: '#a4c2e3' },
  { id: 'pink', name: 'Pink', color: '#FF69B4' },
  { id: 'yellow', name: 'Yellow', color: '#FFFF00' },
  { id: 'gold', name: 'Golden', color: '#CFB53B' },
  { id: 'red', name: 'Red', color: '#c25e5e' },
  { id: 'green', name: 'Green', color: '#87a987' },
  { id: 'gray', name: 'Gray', color: '#9f9ea1' },
  { id: 'brown', name: 'Brown', color: '#8b5e46' },
  { id: 'black', name: 'Black', color: '#333333' },
  { id: 'purple', name: 'Purple', color: '#9B177E' },
  { id: 'multicolor', name: 'Multicolor', color: 'linear-gradient(90deg, #e8d9c7, #a4c2e3, #c25e5e, #87a987)' },
];

const designers = [
  { id: 'KarimRashid', name: 'Karim Rashid' },
  { id: 'IngridKulper', name: 'Ingrid Kulper' },
];

const ProductFilter = ({ onFilterChange }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);

  const toggleMobileFilter = () => setIsMobileFilterOpen(!isMobileFilterOpen);

  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const [openSections, setOpenSections] = useState({
    categories: true,
    colors: true,
    sizes: true,
    designers: true
  });

  const activeFilterCount =
    selectedCategories.length +
    selectedColors.length +
    selectedSizes.length +
    selectedDesigners.length;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        if (res.ok) {
          setCategories(data.categories || data);
        } else {
          console.error('Failed to load categories:', data.message);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId, checked) => {
    let updatedCategories;
    if (checked) {
      updatedCategories = [...selectedCategories, categoryId];
    } else {
      updatedCategories = selectedCategories.filter((id) => id !== categoryId);
    }
    setSelectedCategories(updatedCategories);

    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: updatedCategories,
        colors: selectedColors,
        sizes: selectedSizes,
        designers: selectedDesigners,
      });
    }
  };

  const handleColorChange = (colorId, checked) => {
    const colorName = colors.find((c) => c.id === colorId)?.name;
    if (!colorName) return;

    let updatedColors;
    if (checked) {
      updatedColors = [...selectedColors, colorName];
    } else {
      updatedColors = selectedColors.filter((c) => c !== colorName);
    }
    setSelectedColors(updatedColors);

    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: selectedCategories,
        colors: updatedColors,
        sizes: selectedSizes,
        designers: selectedDesigners,
      });
    }
  };

  const handleSizeChange = (sizeId, checked) => {
    let updatedSizes;
    if (checked) {
      updatedSizes = [...selectedSizes, sizeId];
    } else {
      updatedSizes = selectedSizes.filter((id) => id !== sizeId);
    }
    setSelectedSizes(updatedSizes);

    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: selectedCategories,
        colors: selectedColors,
        sizes: updatedSizes,
        designers: selectedDesigners,
      });
    }
  };

  const handleDesignerChange = (designerId, checked) => {
    let updatedDesigners;
    if (checked) {
      updatedDesigners = [...selectedDesigners, designerId];
    } else {
      updatedDesigners = selectedDesigners.filter((id) => id !== designerId);
    }
    setSelectedDesigners(updatedDesigners);

    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: selectedCategories,
        colors: selectedColors,
        sizes: selectedSizes,
        designers: updatedDesigners,
      });
    }
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      designers: selectedDesigners,
    });
    setIsMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedDesigners([]);
    onFilterChange({
      categories: [],
      colors: [],
      sizes: [],
      designers: [],
      priceRange: [0, 3000],
    });
  };

  const FilterContent = ({ isMobile = false }) => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="border-b border-gray-100 pb-5">
        <button
          className="flex justify-between items-center w-full mb-3 font-semibold text-base text-gray-900 hover:text-amber-800 transition-colors"
          onClick={() => toggleSection('categories')}
          aria-expanded={openSections.categories}
          aria-controls="categories-section"
        >
          <div className="flex items-center gap-2">
            <span>Categories</span>
            {selectedCategories.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {selectedCategories.length}
              </span>
            )}
          </div>
          {openSections.categories ? (
            <Minus size={18} className="text-gray-500" />
          ) : (
            <Plus size={18} className="text-gray-500" />
          )}
        </button>

        {openSections.categories && (
          <div id="categories-section" className="space-y-2 pt-1">
            {isLoadingCategories ? (
              <div className="text-sm text-gray-400 py-2">Loading categories...</div>
            ) : Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => {
                const isChecked = selectedCategories.includes(category.id);
                return (
                  <div
                    key={`${category.name}`}
                    onClick={() => handleCategoryChange(category.id, !isChecked)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-amber-600 bg-amber-50/60 font-semibold text-amber-950 shadow-sm'
                        : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                      />
                      <span className="text-sm">{category.name}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-400 py-1">No categories available</div>
            )}
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="border-b border-gray-100 pb-5">
        <button
          className="flex justify-between items-center w-full mb-3 font-semibold text-base text-gray-900 hover:text-amber-800 transition-colors"
          onClick={() => toggleSection('colors')}
          aria-expanded={openSections.colors}
          aria-controls="colors-section"
        >
          <div className="flex items-center gap-2">
            <span>Colors</span>
            {selectedColors.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {selectedColors.length}
              </span>
            )}
          </div>
          {openSections.colors ? (
            <Minus size={18} className="text-gray-500" />
          ) : (
            <Plus size={18} className="text-gray-500" />
          )}
        </button>

        {openSections.colors && (
          <div id="colors-section" className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {colors.map((color) => {
              const isChecked = selectedColors.includes(color.name);
              return (
                <div
                  key={color.id}
                  onClick={() => handleColorChange(color.id, !isChecked)}
                  className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-amber-600 bg-amber-50/70 font-semibold text-amber-900 shadow-sm'
                      : 'border-gray-100 hover:border-gray-300 text-gray-700 bg-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0 shadow-inner flex items-center justify-center"
                    style={{ background: color.color }}
                  >
                    {isChecked && <Check size={10} className="text-white drop-shadow" />}
                  </span>
                  <span className="text-xs truncate">{color.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={toggleMobileFilter}
          className="w-full flex items-center justify-between px-4 py-3 border-gray-300 shadow-sm rounded-xl hover:bg-amber-50 hover:border-amber-500 transition-all text-gray-800 font-medium h-12"
        >
          <div className="flex items-center gap-2.5">
            <FilterIcon size={18} className="text-amber-700" />
            <span className="font-semibold text-sm">Filter Products</span>
          </div>
          {activeFilterCount > 0 ? (
            <span className="bg-amber-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {activeFilterCount} Active
            </span>
          ) : (
            <span className="text-xs text-gray-400">Tap to filter</span>
          )}
        </Button>
      </div>

      {/* Mobile filter drawer / bottom sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Dark Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={toggleMobileFilter}
            aria-hidden="true"
          />

          {/* Sheet Container */}
          <div className="relative z-10 w-full max-h-[88vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Top Drag Pill */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Filter Products</h2>
                {activeFilterCount > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
                    {activeFilterCount} Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-amber-700 font-medium hover:underline flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-amber-50"
                  >
                    <RotateCcw size={13} />
                    Reset
                  </button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileFilter}
                  className="rounded-full w-8 h-8 hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 no-scrollbar bg-white">
              <FilterContent isMobile={true} />
            </div>

            {/* Sticky Bottom Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3 shadow-lg z-20">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-1/3 border-gray-300 text-gray-700 font-medium rounded-xl h-11"
              >
                Reset
              </Button>
              <Button
                onClick={applyFilters}
                className="w-2/3 bg-black hover:bg-amber-700 text-white font-semibold rounded-xl h-11 shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop filter sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="text-xs text-amber-700 hover:text-amber-900 hover:bg-amber-50 h-8 px-2"
              >
                Reset All
              </Button>
            )}
          </div>
          <FilterContent isMobile={false} />
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
