export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  price: number;
  weight: string;
  roast: string;
  flavor: string[];
  description: string;
  image: string;
  rating: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    category: "Single Origin",
    price: 24.99,
    weight: "250g",
    roast: "Light",
    flavor: ["Blueberry", "Jasmine", "Citrus"],
    description: "A luminous, complex coffee from the birthplace of arabica. Grown at 1,800m elevation in the Yirgacheffe region, this washed process lot delivers an explosion of floral and fruit notes. Each cup reveals layers of blueberry, jasmine, and bright citrus that dance across the palate.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&crop=center",
    rating: 4.9,
    inStock: true
  },
  {
    id: 2,
    name: "Colombian Supremo",
    origin: "Colombia",
    category: "Single Origin",
    price: 21.99,
    weight: "250g",
    roast: "Medium",
    flavor: ["Caramel", "Walnut", "Red Apple"],
    description: "From the lush highlands of Huila, Colombia, this Supremo grade bean delivers a perfectly balanced cup. Rich caramel sweetness meets toasted walnut undertones, with a crisp red apple acidity that keeps each sip interesting. A timeless classic.",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    inStock: true
  },
  {
    id: 3,
    name: "Midnight Velvet Blend",
    origin: "Brazil & Guatemala",
    category: "Blend",
    price: 19.99,
    weight: "250g",
    roast: "Dark",
    flavor: ["Dark Chocolate", "Smoky", "Molasses"],
    description: "Our signature dark roast blend combines Brazilian Santos with Guatemalan Antigua beans. The result is a bold, full-bodied cup with intense dark chocolate notes, a whisper of smoke, and a lingering molasses sweetness. Perfect for espresso lovers.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    inStock: true
  },
  {
    id: 4,
    name: "Kenyan AA Peaberry",
    origin: "Kenya",
    category: "Single Origin",
    price: 28.99,
    weight: "250g",
    roast: "Medium-Light",
    flavor: ["Blackcurrant", "Tomato", "Grapefruit"],
    description: "An extraordinary peaberry selection from Kenya's central highlands. These rare single-bean cherries produce an intensely vibrant cup with bold blackcurrant notes, savory tomato acidity, and a sparkling grapefruit finish. A coffee for the adventurous palate.",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop&crop=center",
    rating: 4.8,
    inStock: true
  },
  {
    id: 5,
    name: "Morning Ritual Blend",
    origin: "Ethiopia & Costa Rica",
    category: "Blend",
    price: 18.99,
    weight: "250g",
    roast: "Medium",
    flavor: ["Honey", "Vanilla", "Toasted Almond"],
    description: "Designed to be your daily companion, this blend marries Ethiopian naturals with Costa Rican honeys. The cup is smooth and approachable with honey sweetness, subtle vanilla aromatics, and a comforting toasted almond finish. Your morning ritual, perfected.",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=400&fit=crop&crop=center",
    rating: 4.5,
    inStock: true
  },
  {
    id: 6,
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    category: "Single Origin",
    price: 23.99,
    weight: "250g",
    roast: "Dark",
    flavor: ["Earthy", "Cedar", "Dark Cocoa"],
    description: "From the volcanic soils of northern Sumatra, this wet-hulled gem offers an earthy, full-bodied experience unlike any other. Deep cedar and forest floor notes intertwine with rich dark cocoa, creating a contemplative cup that rewards slow sipping.",
    image: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    inStock: true
  }
];

export const categories = ["All", "Single Origin", "Blend"];
export const roastLevels = ["All", "Light", "Medium-Light", "Medium", "Dark"];
