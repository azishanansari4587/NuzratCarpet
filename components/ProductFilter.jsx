import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, FilterIcon, Minus, Plus } from 'lucide-react';



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
]



const ProductFilter = ({ onFilterChange }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);

  const toggleMobileFilter = () => setIsMobileFilterOpen(!isMobileFilterOpen);

  const [categories, setCategories] = useState([]);  // categories from backend
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);



  // ...existing states
  const [openSections, setOpenSections] = useState({
    categories: true,
    colors: true,
    sizes: true,
    designers: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
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
        console.log('Fetched categories:', data);
        if (res.ok) {
          setCategories(data.categories || data); // fallback in case categories key missing
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
      updatedCategories = selectedCategories.filter(id => id !== categoryId);
    }
    setSelectedCategories(updatedCategories);
  
    // 👇 Apply filter immediately on desktop
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: updatedCategories,
        colors: selectedColors,
        sizes: selectedSizes,
        designers: selectedDesigners
      });
    }
  };
  

  const handleColorChange = (colorId, checked) => {
    const colorName = colors.find(c => c.id === colorId)?.name;
    if (!colorName) return;
  
    let updatedColors;
    if (checked) {
      updatedColors = [...selectedColors, colorName];
    } else {
      updatedColors = selectedColors.filter(c => c !== colorName);
    }
    setSelectedColors(updatedColors);
  
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: selectedCategories,
        colors: updatedColors, // Now contains names instead of hex codes
        sizes: selectedSizes,
        designers: selectedDesigners
      });
    }
  };

  const handleSizeChange = (sizeId, checked) => {
    let updatedSizes;
    if (checked) {
      updatedSizes = [...selectedSizes, sizeId];
    } else {
      updatedSizes = selectedSizes.filter(id => id !== sizeId);
    }
    setSelectedSizes(updatedSizes);
  
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: selectedCategories,
        colors: selectedColors,
        sizes: updatedSizes,
      });
    }
  };

  const handleDesignerChange = (designerId, checked) => {
    let updatedDesigners;
    if (checked) {
      updatedDesigners = [...selectedDesigners, designerId];
    } else {
      updatedDesigners = selectedDesigners.filter(id => id !== designerId);
    }
    setSelectedDesigners(updatedDesigners);
  
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: selectedCategories,
        colors: selectedColors,
        sizes: selectedSizes,
        designers: updatedDesigners
      });
    }
  };


  

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      designers: selectedDesigners
      // priceRange
    });
    setIsMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    // setPriceRange([0, 3000]);
    onFilterChange({
      categories: [],
      colors: [],
      sizes: [],
      designers: [],
      priceRange: [0, 3000]
    });
  };

  // Filter content component to avoid duplication
  const FilterContent = () => (
    <>
      {/* Categories */}
      <div className="mb-8">
        {/* <h3 className="text-lg font-medium mb-4">Categories</h3> */}
        <button
          className="flex justify-between items-center w-full mb-2 font-semibold text-lg"
          onClick={() => toggleSection('categories')}
          aria-expanded={openSections.categories}
          aria-controls="categories-section"
        >
          <span>Categories</span>
          {openSections.categories ? <Minus size={20} /> : <Plus size={20} />}
        </button>
        {openSections.categories && (
        <div id="categories-section" className="space-y-2">
          {Array.isArray(categories) && categories.map(category => (
              <div key={`${category.name}`} className="flex items-center">
                <Checkbox 
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked )}
                  className="mr-2"
                />
                <label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm flex items-center justify-between w-full cursor-pointer"
                >
                  <span>{category.name}</span>
                </label>
              </div>
          ))}
        </div>
        )}
      </div>

      {/* Designers */}
       {/* <div className="mb-8">
        <button
            className="flex justify-between items-center w-full mb-2 font-semibold text-lg"
            onClick={() => toggleSection('designers')}
            aria-expanded={openSections.designers}
            aria-controls="designers-section"
          >
            <span>Designers</span>
            {openSections.designers ? <Minus size={20} /> : <Plus size={20} />}
          </button>
        {openSections.designers && (
        <div className="space-y-2">
          {designers.map(designer => (
            <div key={designer.id} className="flex items-center">
              <Checkbox 
                id={`designer-${designer.id}`}
                checked={selectedDesigners.includes(designer.id)}
                onCheckedChange={(checked) => handleDesignerChange(designer.id, checked )}
                className="mr-2"
              />
              <label 
                htmlFor={`designer-${designer.id}`}
                className="text-sm flex items-center justify-between w-full cursor-pointer"
              >
                <span>{designer.name}</span>
              </label>
            </div>
          ))}
        </div>
        )}
      </div> */}

      {/* Colors */}
      <div className="mb-8">
        <button
          className="flex justify-between items-center w-full mb-2 font-semibold text-lg"
          onClick={() => toggleSection('colors')}
          aria-expanded={openSections.colors}
          aria-controls="colors-section"
        >
          <span>Colors</span>
          {openSections.colors ? <Minus size={20} /> : <Plus size={20} />}
        </button>
        {openSections.colors && (
          <div id="colors-section"  className="grid grid-cols-1 gap-2">
            {colors.map(color => (
              <div key={color.id} className="flex items-center">
                <Checkbox 
                  id={`color-${color.id}`}
                  checked={selectedColors.includes(color.name)} 
                  onCheckedChange={(checked) => handleColorChange(color.id, checked )}
                  className="mr-2"
                />
                <label 
                  htmlFor={`color-${color.id}`}
                  className="text-sm flex items-center cursor-pointer"
                >
                  <span 
                    className="w-4 h-4 rounded-full mr-2 border"
                    style={{ background: color.color }}
                  ></span>
                  <span>{color.name}</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      {/* <div className="mb-8">
        <button
            className="flex justify-between items-center w-full mb-2 font-semibold text-lg"
            onClick={() => toggleSection('sizes')}
            aria-expanded={openSections.sizes}
            aria-controls="sizes-section"
          >
            <span>Sizes</span>
            {openSections.sizes ? <Minus size={20} /> : <Plus size={20} />}
          </button>
        {openSections.sizes && (
        <div className="space-y-2">
          {sizes.map(size => (
            <div key={size.id} className="flex items-center">
              <Checkbox 
                id={`size-${size.id}`}
                checked={selectedSizes.includes(size.id)}
                onCheckedChange={(checked) => handleSizeChange(size.id, checked )}
                className="mr-2"
              />
              <label 
                htmlFor={`size-${size.id}`}
                className="text-sm flex items-center justify-between w-full cursor-pointer"
              >
                <span>{size.name}</span>
              </label>
            </div>
          ))}
        </div>
        )}
      </div> */}

      {/* Action buttons for mobile */}
      <div className="mt-8 space-y-3 lg:hidden">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline" 
          onClick={toggleMobileFilter}
          className="w-full flex items-center justify-center gap-2"
        >
          <FilterIcon size={18} />
          Filter Products
        </Button>
      </div>

      {/* Mobile filter drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-medium">Filters</h2>
              <Button variant="ghost" size="icon" onClick={toggleMobileFilter}>
                <X size={24} />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop filter sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Filters</h2>
            <Button 
              variant="ghost" 
              onClick={resetFilters} 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Reset All
            </Button>
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
