import { CommonModule } from '@angular/common';
import { Component, signal, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

// --- Interfaces ---
interface MenuItem {
  id: number;
  name: string;
  price: string;
  desc: string;
  image: string;
  tags: string[];
}

interface MenuCategory {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  items: MenuItem[];
}

interface ContactItem {
  icon: string;
  title: string;
  lines: string[];
  subText?: string;
}

// --- Static Data (Moved outside component for optimization) ---
const MENU_DATA: MenuCategory[] = [
  {
    id: 'pizza',
    title: 'Pizzas',
    description: 'Hand-tossed base with our signature sauce.',
    isExpanded: true,
    items: [
      { id: 1, name: 'OTC Pizza', price: '₹149', desc: 'Loaded with Onion, Tomato, and Capsicum on a crispy crust.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop', tags: ['Onion', 'Tomato', 'Capsicum'] },
      { id: 2, name: 'Veg Pizza', price: '₹129', desc: 'A classic delight with mixed seasonal vegetables and mozzarella.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop', tags: ['Mixed Veg', 'Mozzarella'] },
      { id: 3, name: 'Cheese Pizza', price: '₹199', desc: 'For the cheese lovers. Loaded with extra mozzarella and cheddar blend.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop', tags: ['Extra Cheese', 'Cheddar'] },
      { id: 4, name: 'Cheese Corn Capsicum', price: '₹229', desc: 'Sweet corn and crunchy capsicum meet a blanket of golden cheese.', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop', tags: ['Sweet Corn', 'Capsicum', 'Cheese'] },
      { id: 221, name: 'OTC Pizza', price: '₹149', desc: 'Loaded with Onion, Tomato, and Capsicum on a crispy crust.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop', tags: ['Onion', 'Tomato', 'Capsicum'] },
      { id: 222, name: 'Veg Pizza', price: '₹129', desc: 'A classic delight with mixed seasonal vegetables and mozzarella.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop', tags: ['Mixed Veg', 'Mozzarella'] },
      { id: 223, name: 'Cheese Pizza', price: '₹199', desc: 'For the cheese lovers. Loaded with extra mozzarella and cheddar blend.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop', tags: ['Extra Cheese', 'Cheddar'] },
      { id: 224, name: 'Cheese Corn Capsicum', price: '₹229', desc: 'Sweet corn and crunchy capsicum meet a blanket of golden cheese.', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop', tags: ['Sweet Corn', 'Capsicum', 'Cheese'] },
    ]
  },
  {
    id: 'snacks',
    title: 'Snacks & Quick Bites',
    description: 'Perfect companions for your hunger pangs.',
    isExpanded: true,
    items: [
      { id: 5, name: 'Veg Grilled Sandwich', price: '₹89', desc: 'Crispy grilled bread stuffed with spicy potato and veggie mix.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop', tags: ['Spicy', 'Grilled'] },
      { id: 6, name: 'Paneer Tikka Sandwich', price: '₹119', desc: 'Smoky paneer chunks marinated in spices, grilled to perfection.', image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?q=80&w=600&auto=format&fit=crop', tags: ['Paneer', 'Tandoori Sauce'] },
      { id: 7, name: 'Aloo Patties', price: '₹35', desc: 'Flaky puff pastry filled with spiced mashed potatoes.', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop', tags: ['Puff Pastry', 'Potato'] },
      { id: 8, name: 'Paneer Patties', price: '₹45', desc: 'Golden puff pastry stuffed with soft, seasoned paneer.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop', tags: ['Puff Pastry', 'Paneer'] },
      { id: 225, name: 'Veg Grilled Sandwich', price: '₹89', desc: 'Crispy grilled bread stuffed with spicy potato and veggie mix.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop', tags: ['Spicy', 'Grilled'] },
      { id: 226, name: 'Paneer Tikka Sandwich', price: '₹119', desc: 'Smoky paneer chunks marinated in spices, grilled to perfection.', image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?q=80&w=600&auto=format&fit=crop', tags: ['Paneer', 'Tandoori Sauce'] },
      { id: 227, name: 'Aloo Patties', price: '₹35', desc: 'Flaky puff pastry filled with spiced mashed potatoes.', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop', tags: ['Puff Pastry', 'Potato'] },
      { id: 228, name: 'Paneer Patties', price: '₹45', desc: 'Golden puff pastry stuffed with soft, seasoned paneer.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop', tags: ['Puff Pastry', 'Paneer'] },
  ]
  },
  {
    id: 'bakery',
    title: 'Cakes & Pastries',
    description: 'Freshly baked goodness to sweeten your day.',
    isExpanded: true,
    items: [
      { id: 9, name: 'Black Forest Pastry', price: '₹79', desc: 'Layers of chocolate sponge, whipped cream and cherries.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop', tags: ['Chocolate', 'Cherry', 'Cream'] },
      { id: 10, name: 'Pineapple Pastry', price: '₹69', desc: 'Light, airy sponge cake with fresh pineapple chunks and cream.', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=600&auto=format&fit=crop', tags: ['Fruity', 'Fresh'] },
      { id: 11, name: '7 Colors Pastry', price: '₹89', desc: 'Light, airy sponge cake with fresh pineapple chunks and cream.', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop', tags: ['Fruity', 'Fresh'] },
      { id: 12, name: 'Chocolate Truffle Cake (1kg)', price: '₹899', desc: 'Rich, dense chocolate cake covered in glossy ganache.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop', tags: ['1kg', 'Eggless Option'] },
      { id: 229, name: 'Black Forest Pastry', price: '₹79', desc: 'Layers of chocolate sponge, whipped cream and cherries.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop', tags: ['Chocolate', 'Cherry', 'Cream'] },
      { id: 220, name: 'Pineapple Pastry', price: '₹69', desc: 'Light, airy sponge cake with fresh pineapple chunks and cream.', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=600&auto=format&fit=crop', tags: ['Fruity', 'Fresh'] },
      { id: 221, name: '7 Colors Pastry', price: '₹89', desc: 'Light, airy sponge cake with fresh pineapple chunks and cream.', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop', tags: ['Fruity', 'Fresh'] },
      { id: 222, name: 'Chocolate Truffle Cake (1kg)', price: '₹899', desc: 'Rich, dense chocolate cake covered in glossy ganache.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop', tags: ['1kg', 'Eggless Option'] },
      
    ]
  },
  {
    id: 'beverages',
    title: 'Beverages',
    description: 'Cool down with our refreshing drinks.',
    isExpanded: true,
    items: [
      { id: 13, name: 'Coke / Pepsi', price: '₹40', desc: 'Chilled carbonated soft drink (300ml).', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop', tags: ['Chilled', 'Fizzy'] },
      { id: 14, name: 'Classic Cold Coffee', price: '₹109', desc: 'Brewed coffee blended with vanilla ice cream and milk.', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600&auto=format&fit=crop', tags: ['Caffeine', 'Ice Cream'] },
      { id: 15, name: 'Hazelnut Cold Coffee', price: '₹129', desc: 'Our signature cold coffee infused with hazelnut syrup.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop', tags: ['Hazelnut', 'Premium'] },
      { id: 16, name: 'Sprite', price: '₹40', desc: 'Lemon-lime flavored soft drink.', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=600&auto=format&fit=crop', tags: ['Citrus', 'Chilled'] },
      { id: 223, name: 'Coke / Pepsi', price: '₹40', desc: 'Chilled carbonated soft drink (300ml).', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop', tags: ['Chilled', 'Fizzy'] },
      { id: 224, name: 'Classic Cold Coffee', price: '₹109', desc: 'Brewed coffee blended with vanilla ice cream and milk.', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600&auto=format&fit=crop', tags: ['Caffeine', 'Ice Cream'] },
      { id: 225, name: 'Hazelnut Cold Coffee', price: '₹129', desc: 'Our signature cold coffee infused with hazelnut syrup.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop', tags: ['Hazelnut', 'Premium'] },
      { id: 226, name: 'Sprite', price: '₹40', desc: 'Lemon-lime flavored soft drink.', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=600&auto=format&fit=crop', tags: ['Citrus', 'Chilled'] },
    ]
  }
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // --- Signals & State ---
  isMobileMenuOpen = signal(false);
  currentFilter = signal<string>('all');
  selectedItem = signal<MenuItem | null>(null);
  
  // Use inject() instead of constructor for DomSanitizer
  private sanitizer = inject(DomSanitizer);
  
  // Initialize safeMapUrl immediately
  safeMapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.666755458066!2d75.8300!3d25.1600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396f9b6c00000001%3A0x0!2sKota!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin'
  );

  // Define Filter Options for the loop
  filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'bakery', label: 'Bakery & Cakes' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'beverages', label: 'Beverages' }
  ];

  // Raw Menu Data (now initialized with static data)
  menuCategories = signal<MenuCategory[]>(MENU_DATA);

  // Computed Values
  filteredMenu = computed(() => {
    const filter = this.currentFilter();
    const categories = this.menuCategories();
    
    if (filter === 'all') return categories;
    return categories.filter(cat => cat.id === filter);
  });

  // Constructor is no longer needed for DI
  constructor() {}

  // Contact Info Data
  contactInfo: ContactItem[] = [
    {
      icon: 'ph-map-pin',
      title: 'Our Location',
      lines: ['Shop No. 12, Food Street Market,', 'Near Central Park, Kota, Rajasthan, 324005'],
      subText: undefined
    },
    {
      icon: 'ph-phone',
      title: 'Phone',
      lines: ['+91 98765 43210'],
      subText: '(Available 10 AM - 10 PM)'
    },
    {
      icon: 'ph-envelope',
      title: 'Email',
      lines: ['hello@vedbakery.dummy'],
      subText: undefined
    }
  ];

  // Actions
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  setFilter(filter: string) {
    this.currentFilter.set(filter);
    
    // Auto-expand the filtered category if specific one selected
    if (filter !== 'all') {
      this.menuCategories.update(cats => 
        cats.map(c => ({...c, isExpanded: true}))
      );
    }
  }

  toggleCategory(categoryId: string) {
    this.menuCategories.update(cats => 
      cats.map(c => 
        c.id === categoryId ? { ...c, isExpanded: !c.isExpanded } : c
      )
    );
  }

  openModal(item: MenuItem) {
    this.selectedItem.set(item);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedItem.set(null);
    document.body.style.overflow = '';
  }

  scrollTo(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
