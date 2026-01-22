// lib/products.ts

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  category: Category;
}

export interface ProductsByCategory {
  [key: string]: Product[];
  necklace: Product[];
  bracelet: Product[];
  keychain: Product[];
  anklet: Product[];
  magnet: Product[];
}

export type Category = 'necklace' | 'bracelet' | 'keychain' | 'anklet' | 'magnet';

export const products: ProductsByCategory = {
  necklace: [
    { id: 1, name: 'Cherry Choker', price: '₱79', image: '/product-images/danglingco/cherry-choker.jpg', category: 'necklace', description: 'A beautiful cherry-themed choker necklace with vibrant beads.' },
    { id: 2, name: 'Green Flora', price: '₱69', image: '/product-images/danglingco/green-flora.jpg', category: 'necklace', description: 'An elegant green flora-inspired necklace with nature-themed design.' },
    { id: 3, name: 'Blue Flora', price: '₱59', image: '/product-images/danglingco/necklace2.jpg', category: 'necklace', description: 'A serene blue flora necklace perfect for nature lovers.' },
    { id: 4, name: 'The Collections', price: '₱79', image: '/product-images/danglingco/necklace1.jpg', category: 'necklace', description: 'A curated collection piece featuring multiple design elements.' },
     { id: 17, name: 'Choker Edition', price: '₱79', image: '/product-images/danglingco/choker-unique-beads.jpg', category: 'necklace', description: 'A curated collection piece featuring multiple design elements.' },
  ],
  bracelet: [
    { id: 5, name: 'Wave Bracelet', price: '₱69', image: '/product-images/danglingco/spiral-braclet-for-bg.jpg', category: 'bracelet', description: 'A flowing wave-designed bracelet with elegant curves.' },
    { id: 6, name: 'Circles of Season Bracelet', price: '₱49', image: '/product-images/danglingco/brclet2.jpg', category: 'bracelet', description: 'A seasonal bracelet featuring circular patterns representing the four seasons.' },
    { id: 7, name: 'Evil Eye Bracelet', price: '₱49', image: '/product-images/danglingco/evileye brclet.jpg', category: 'bracelet', description: 'A protective evil eye bracelet with intricate detailing.' },
    { id: 8, name: 'Friendship Bracelet', price: '₱49', image: '/product-images/danglingco/couple bracelet.jpg', category: 'bracelet', description: 'A delicate periwinkle-colored bracelet perfect for everyday wear.' },
  ],
  keychain: [
    { id: 9, name: 'Cherry Keychain', price: '₱59', image: '/product-images/danglingco/cherry-keychain-forbg.jpg', category: 'keychain', description: 'A cute cherry-themed keychain perfect as a gift or personal accessory.' },
    { id: 10, name: 'Bouquet Keychain', price: '₱89', image: '/product-images/danglingco/bouquet 2.jpg', category: 'keychain', description: 'A charming bouquet-themed keychain with delicate beads.' },
    { id: 11, name: 'Name ur Keychain', price: '₱70', image: '/product-images/danglingco/for-bg-2.jpg', category: 'keychain', description: 'A customizable keychain where you can add your own name or message.' },
    { id: 12, name: 'SunFlower Keychain', price: '₱89', image: '/product-images/danglingco/keychain.jpg', category: 'keychain', description: 'A bright and cheerful sunflower-themed keychain.' },
    { id: 16, name: 'Tulips  Keychain', price: '₱59', image: '/product-images/danglingco/tulips keychain.jpg', category: 'keychain', description: 'A delicate tulips keychain celebrating spring and botanical beauty.' },
     { id: 18, name: 'Ribbon   Keychain', price: '₱59', image: '/product-images/danglingco/ribbon2.jpg', category: 'keychain', description: 'A delicate ribbon keychain celebrating spring and botanical beauty.' },
  ],
  anklet: [
    { id: 13, name: 'Cherry Anklet', price: '₱59', image: '/product-images/danglingco/cherry-anklet.jpg', category: 'anklet', description: 'A playful cherry-themed anklet with vibrant red and green beads.' },
    { id: 14, name: 'Circles of Season Anklet', price: '₱59', image: '/product-images/danglingco/circles-of-season.jpg', category: 'anklet', description: 'A four-season-themed anklet representing the beauty of each season.' },
    { id: 15, name: 'Spiral Anklet', price: '₱59', image: '/product-images/danglingco/spiral-detail.jpg', category: 'anklet', description: 'A geometric spiral anklet with modern appeal and visual interest.' },
  ],
  magnet: [
    { id: 17, name: 'Decorative Bead Magnet', price: '₱59.99', image: '/product-images/danglingco/keychain bo.jpg', category: 'magnet', description: 'A decorative magnet featuring beautiful handcrafted beads.' },
    { id: 18, name: 'Colorful Magnet Set', price: '₱59.99', image: '/product-images/danglingco/keychain dragoin.jpg', category: 'magnet', description: 'A vibrant set of colorful magnets to brighten up your space.' },
    { id: 19, name: 'Cherry Magnet', price: '₱59.99', image: '/product-images/danglingco/cherry-keychain-1.jpg', category: 'magnet', description: 'An elegant crystal magnet that catches the light beautifully.' },
    { id: 20, name: 'Name ur magnet', price: '₱59.99', image: '/product-images/danglingco/name-ur-keychain.jpg', category: 'magnet', description: 'Premium quality magnet with exquisite bead craftsmanship.' },
  ],
};