import { PricingPackage, Testimonial, FaqItem, SelectedWorkItem } from '../types';

export const STUDIO_INFO = {
  name: 'Sanjib Bhowmik',
  phone: '7005175235',
  email: 'cammystery78@gmail.com',
  address: 'Hapania, Agartala, West Tripura, 799014',
  mapsUrl: 'https://maps.google.com/?q=Hapania,+Agartala,+West+Tripura,+799014',
};

export const HERO_SLIDES = [
  {
    id: 1,
    title: 'Every Love Story Holds a Mystery',
    subtitle: 'CaM-Mystery Wedding Photography',
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 2,
    title: 'Timeless Stories, Authentic Moments',
    subtitle: 'Cinematic Films & Fine-Art Portraits',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 3,
    title: 'Preserving Unscripted Emotions',
    subtitle: 'From Yes to I Do, and Forever',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=85',
  },
];

export const SELECTED_WORK: SelectedWorkItem[] = [
  {
    id: 1,
    title: 'The Terrace Promenade',
    category: 'Wedding Day',
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Quiet Serenity',
    category: 'Bridal Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Moments of Joy',
    category: 'Celebration',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Regal Crimson',
    category: 'Bridal Couture',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Endless Warmth',
    category: 'Couple Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1617059063772-34532796cdb5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'The Sacred Vows',
    category: 'Traditional Ceremony',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    title: 'Soft Anticipation',
    category: 'Fine Art',
    imageUrl: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    title: 'Laughter Unscripted',
    category: 'Reception',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9,
    title: 'Hills of Rishikesh',
    category: 'Pre Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 10,
    title: 'Ankit & Ashmita',
    category: 'Pre Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1617059063772-34532796cdb5?auto=format&fit=crop&w=800&q=80',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: '‘Working with CaM-Mystery was one of the best decisions we made for our wedding. They listened closely to what we wanted and delivered something far beyond our expectations. The care they brought to every single frame made us feel truly seen.’',
    authors: 'GAURAV + ANANYA',
  },
  {
    quote: '‘From our engagement session right through the wedding day, the experience was effortless. They blended into our day so naturally that we almost forgot they were there — and then we saw the photos. Absolute magic.’',
    authors: 'ASHKA + TINU',
  },
  {
    quote: '‘Professional, warm, and endlessly talented. The whole team made our day feel relaxed and joyful, and the final gallery left us speechless. We couldn’t recommend them highly enough.’',
    authors: 'RIYA + KEVIN',
  },
];

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'silver',
    name: 'SILVER PACKAGE',
    coverage: '2 Days Coverage',
    price: 'Rs. 75,000',
    features: [
      'Traditional Photography',
      'Traditional Videography',
      '30 Pages Album (250 Photos)',
      'Full Movie — 2.5 to 3 Hours',
    ],
  },
  {
    id: 'gold',
    name: 'GOLD PACKAGE',
    badge: 'MOST POPULAR',
    coverage: '2 Days Coverage',
    price: 'Rs. 1,75,000',
    isPopular: true,
    features: [
      'Traditional Photography',
      'Traditional Videography',
      'Cinematic Videography',
      'Candid Shoot',
      'Drone Shoot — 1 Day',
      'Album — 30 Pages (300 Photos)',
      'Highlight + Teaser',
      'Full Movie — 2.5 to 3 Hours',
    ],
  },
  {
    id: 'diamond',
    name: 'DIAMOND PACKAGE',
    coverage: '2 Days Coverage',
    price: 'Rs. 2,55,000',
    features: [
      'Traditional Photography',
      'Traditional Videography',
      'Cinematic Videography',
      'Candid Shoot',
      'Crowd Capture (Extra Photographer)',
      'Mobile Cinematographer',
      'AI Photo Scan',
      'Drone Shoot — 1 Day',
      'Album — 40 Pages (400 Photos) + Pen Drive',
      'Pre-Wedding Shoot — 1 Day',
      'Countdown 10-Day Photos + Cinematic Video',
      'Highlight + Teaser',
      'Full Movie — 2.5 to 3 Hours',
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'in-person',
    question: 'Will you be at my wedding in person?',
    answer: 'Yes, absolutely. Sanjib Bhowmik personally leads and shoots every primary wedding assignment along with our dedicated core team of cinematographers and second photographers to ensure a consistent artistic vision and flawless coverage.',
  },
  {
    id: 'destination',
    question: 'Do you photograph destination weddings?',
    answer: 'We photograph destination weddings all across India and internationally. Whether your celebration is in Rajasthan, Goa, the hills of Himachal, or abroad, our team travels seamlessly to document your story.',
  },
  {
    id: 'editing-style',
    question: 'How would you describe your editing style?',
    answer: 'Our editing philosophy is timeless, authentic, and true to life. We avoid passing fads or overly stylized filters, focusing instead on organic skin tones, rich dimensional light, and genuine colors that look breathtaking today and thirty years from now.',
  },
  {
    id: 'drone',
    question: 'Do you offer drone coverage?',
    answer: 'Yes, professional licensed aerial drone cinematography is included with our Gold and Diamond packages, capturing grand establishing perspectives of your venue, procession, and celebrations.',
  },
  {
    id: 'pricing',
    question: 'What is your pricing structure?',
    answer: 'Our bespoke wedding collections start at Rs. 75,000 for Silver, Rs. 1,75,000 for Gold, and Rs. 2,55,000 for Diamond. All packages can be fully customized with additional days, events, or specific family heirloom album requirements.',
  },
];

export const ABOUT_PARAGRAPHS = [
  'Every wedding has a story. Some are told through words, while the most unforgettable ones are told through moments. At CaM-Mystery, we exist to preserve those moments with authenticity, artistry, and emotion.',
  'Founded on the belief that memories deserve more than ordinary photographs, CaM-Mystery specializes in wedding photography and cinematic filmmaking that captures the essence of your celebration. We don’t just document events—we create timeless visual stories that allow you to relive every smile, every tear, every embrace, and every heartfelt promise for years to come.',
  'Our style is a seamless blend of candid storytelling, fine-art portraiture, and cinematic visuals. Whether it’s the quiet anticipation before the ceremony, the laughter shared with loved ones, the vibrant traditions, or the intimate moments between two souls, we focus on the emotions that make your wedding uniquely yours.',
  'Every couple is different, and so is every love story. That’s why we take a personalized approach to every wedding. We spend time understanding your personalities, traditions, and vision, ensuring that every photograph reflects your journey naturally rather than feeling staged. Our goal is to make you feel comfortable in front of the camera so that your genuine emotions shine through every frame.',
  'At CaM-Mystery, technical excellence meets creative storytelling. From thoughtful compositions and beautiful lighting to meticulous editing and handcrafted albums, every detail is handled with precision and care. We believe that a wedding film or photograph should not only look beautiful today but remain timeless decades from now.',
  'Over the years, we have had the privilege of documenting weddings across diverse cultures and traditions, building lasting relationships with couples who trust us to preserve one of the most important days of their lives. That trust is the foundation of everything we do.',
  'The name CaM-Mystery reflects our philosophy: every love story holds a unique mystery waiting to unfold. Our role is to discover those beautiful, unscripted moments and transform them into memories that will be treasured for generations.',
  'From “Yes” to “I Do,” and every moment in between—we don’t just capture weddings. We tell stories that last forever.',
];
