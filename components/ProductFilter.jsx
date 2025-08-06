import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X, FilterIcon } from 'lucide-react';

// Mock data
const categories = [
  { id: 'persian', name: 'Persian', count: 48 },
  { id: 'modern', name: 'Modern', count: 36 },
  { id: 'traditional', name: 'Traditional', count: 52 },
  { id: 'handmade', name: 'Handmade', count: 29 },
  { id: 'vintage', name: 'Vintage', count: 18 },
  { id: 'contemporary', name: 'Contemporary', count: 24 },
];

const colors = [
  { id: 'beige', name: 'Beige', color: '#e8d9c7' },
  { id: 'blue', name: 'Blue', color: '#a4c2e3' },
  { id: 'red', name: 'Red', color: '#c25e5e' },
  { id: 'green', name: 'Green', color: '#87a987' },
  { id: 'gray', name: 'Gray', color: '#9f9ea1' },
  { id: 'brown', name: 'Brown', color: '#8b5e46' },
  { id: 'black', name: 'Black', color: '#333333' },
  { id: 'multicolor', name: 'Multicolor', color: 'linear-gradient(90deg, #e8d9c7, #a4c2e3, #c25e5e, #87a987)' },
];

const sizes = [
  { id: 'small', name: 'Small (2\'x3\')', count: 24 },
  { id: 'medium', name: 'Medium (5\'x7\')', count: 45 },
  { id: 'large', name: 'Large (8\'x10\')', count: 38 },
  { id: 'xlarge', name: 'X-Large (9\'x12\')', count: 22 },
  { id: 'runner', name: 'Runner (2\'x8\')', count: 19 },
  { id: 'round', name: 'Round (6\' dia)', count: 15 },
];



const ProductFilter = ({ onFilterChange }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
//   const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const toggleMobileFilter = () => setIsMobileFilterOpen(!isMobileFilterOpen);

  // const handleCategoryChange = (categoryId, checked) => {
  //   if (checked) {
  //     setSelectedCategories([...selectedCategories, categoryId]);
  //   } else {
  //     setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
  //   }
  // };

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
      });
    }
  };
  

  // const handleColorChange = (colorId, checked) => {
  //   if (checked) {
  //     setSelectedColors([...selectedColors, colorId]);
  //   } else {
  //     setSelectedColors(selectedColors.filter(id => id !== colorId));
  //   }
  // };

  // const handleColorChange = (colorId, checked) => {
  //   let updatedColors;
  //   if (checked) {
  //     updatedColors = [...selectedColors, colorId];
  //   } else {
  //     updatedColors = selectedColors.filter(id => id !== colorId);
  //   }
  //   setSelectedColors(updatedColors);
  
  //   if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
  //     onFilterChange({
  //       categories: selectedCategories,
  //       colors: updatedColors,
  //       sizes: selectedSizes,
  //     });
  //   }
  // };

  // const handleColorChange = (colorId, checked) => {
  //   const hexCode = colors.find(c => c.id === colorId)?.color;
  //   if (!hexCode) return;
  
  //   let updatedColors;
  //   if (checked) {
  //     updatedColors = [...selectedColors, hexCode];
  //   } else {
  //     updatedColors = selectedColors.filter(c => c !== hexCode);
  //   }
  //   setSelectedColors(updatedColors);
  
  //   if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
  //     onFilterChange({
  //       categories: selectedCategories,
  //       colors: updatedColors,
  //       sizes: selectedSizes,
  //     });
  //   }
  // };

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
      });
    }
  };
  
  
  

  // const handleSizeChange = (sizeId, checked) => {
  //   if (checked) {
  //     setSelectedSizes([...selectedSizes, sizeId]);
  //   } else {
  //     setSelectedSizes(selectedSizes.filter(id => id !== sizeId));
  //   }
  // };

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

  

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
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
      priceRange: [0, 3000]
    });
  };

  // Filter content component to avoid duplication
  const FilterContent = () => (
    <>
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center">
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
                {/* <span className="text-muted-foreground">({category.count})</span> */}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Colors</h3>
        <div className="grid grid-cols-1 gap-2">
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
      </div>

      {/* Sizes */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Sizes</h3>
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
                {/* <span className="text-muted-foreground">({size.count})</span> */}
              </label>
            </div>
          ))}
        </div>
      </div>

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
