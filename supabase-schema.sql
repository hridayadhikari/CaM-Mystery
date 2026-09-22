-- ==============================================================================
-- CaM-Mystery Wedding Studio - Supabase Schema & Seed Script
-- ==============================================================================
-- Run this script directly in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- It creates all required tables, applies Row Level Security (RLS) with public read
-- and public/anon write policies for client-side CMS updates, and seeds the initial data.
-- ==============================================================================

-- 1. SITE SETTINGS TABLE (key-value store for Studio Info, Hero Slides, Video Teaser)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PORTFOLIO / SELECTED WORK TABLE
CREATE TABLE IF NOT EXISTS public.portfolio (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    aspect TEXT,
    "isFeatured" BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migration safety: add isFeatured column if portfolio table already exists
ALTER TABLE public.portfolio ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN DEFAULT false;

-- 3. PRICING PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.pricing_packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    badge TEXT,
    coverage TEXT NOT NULL,
    price TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    isPopular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    iconName TEXT DEFAULT 'Camera',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    quote TEXT NOT NULL,
    authors TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CLIENT ENQUIRIES / LEADS TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    eventDate TEXT,
    eventLocation TEXT,
    coverageType TEXT,
    message TEXT NOT NULL,
    referralSource TEXT,
    isRead BOOLEAN DEFAULT false,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    package TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_location TEXT NOT NULL,
    remarks TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allows read access to all users and write access for CMS / Contact form
-- ==============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if any
DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can manage site_settings" ON public.site_settings;
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can manage site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Public can manage portfolio" ON public.portfolio;
CREATE POLICY "Public can read portfolio" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Public can manage portfolio" ON public.portfolio FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read pricing_packages" ON public.pricing_packages;
DROP POLICY IF EXISTS "Public can manage pricing_packages" ON public.pricing_packages;
CREATE POLICY "Public can read pricing_packages" ON public.pricing_packages FOR SELECT USING (true);
CREATE POLICY "Public can manage pricing_packages" ON public.pricing_packages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read team_members" ON public.team_members;
DROP POLICY IF EXISTS "Public can manage team_members" ON public.team_members;
CREATE POLICY "Public can read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public can manage team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public can manage testimonials" ON public.testimonials;
CREATE POLICY "Public can read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public can manage testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read faqs" ON public.faqs;
DROP POLICY IF EXISTS "Public can manage faqs" ON public.faqs;
CREATE POLICY "Public can read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public can manage faqs" ON public.faqs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can manage enquiries" ON public.enquiries;
CREATE POLICY "Public can read enquiries" ON public.enquiries FOR SELECT USING (true);
CREATE POLICY "Public can manage enquiries" ON public.enquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can manage bookings" ON public.bookings;
CREATE POLICY "Public can read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public can manage bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);


-- ==============================================================================
-- INITIAL DATA SEEDING
-- ==============================================================================

-- 1. Seed site_settings (Studio Info, Hero Slides, Pre-Wedding Video)
INSERT INTO public.site_settings (key, value)
VALUES
(
    'studio_info',
    '{
        "name": "Sanjib Bhowmik",
        "phone": "7005175235",
        "email": "cammystery78@gmail.com",
        "address": "Hapania, Agartala, West Tripura, 799014",
        "mapsUrl": "https://maps.google.com/?q=Hapania,+Agartala,+West+Tripura,+799014"
    }'::jsonb
),
(
    'hero_slides',
    '[
        {
            "id": 1,
            "title": "Every Love Story Holds a Mystery",
            "subtitle": "CaM-Mystery Wedding Photography",
            "imageUrl": "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=2000&q=85"
        },
        {
            "id": 2,
            "title": "Timeless Stories, Authentic Moments",
            "subtitle": "Cinematic Films & Fine-Art Portraits",
            "imageUrl": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85"
        },
        {
            "id": 3,
            "title": "Preserving Unscripted Emotions",
            "subtitle": "From Yes to I Do, and Forever",
            "imageUrl": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=85"
        }
    ]'::jsonb
),
(
    'video_feature',
    '{
        "title": "Ankit & Ashmita",
        "subtitle": "Pre-Wedding Cinema Teaser",
        "description": "Captured amidst the scenic hills of Rishikesh with authentic cinematic storytelling and delicate color tones.",
        "videoUrl": "https://res.cloudinary.com/naqb7hm2/video/upload/v1789134902/PRE_WEDDING_COMING_SOON_4K_ANKIT_ASHMITA_BALA_G_STUDIO_RISHIKESH_-_Bala-G_Studio_720p_h264_cnqgoj.mp4",
        "posterUrl": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80"
    }'::jsonb
),
(
    'wedding_projects',
    '[
        {
            "id": "proj-1",
            "title": "The Royal Heritage Vivah",
            "coupleNames": "Vikram & Radhika",
            "location": "Udaipur, Rajasthan",
            "date": "December 2025",
            "coverImage": "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85",
            "description": "An intimate sunset palace wedding celebrated with timeless Rajasthani traditions, candlelit pheras, and fine-art portraits.",
            "images": [
                "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85"
            ]
        },
        {
            "id": "proj-2",
            "title": "Himalayan Serenade & Vows",
            "coupleNames": "Ankit & Ashmita",
            "location": "Rishikesh, Uttarakhand",
            "date": "February 2026",
            "coverImage": "https://images.unsplash.com/photo-1617059063772-34532796cdb5?auto=format&fit=crop&w=1200&q=85",
            "description": "Soulful pre-wedding and sacred rituals framed against the sacred Ganges and emerald mountain contours.",
            "images": [
                "https://images.unsplash.com/photo-1617059063772-34532796cdb5?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85"
            ]
        },
        {
            "id": "proj-3",
            "title": "Heirloom Crimson & Silk",
            "coupleNames": "Arjun & Meera",
            "location": "Agartala, West Tripura",
            "date": "January 2026",
            "coverImage": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
            "description": "A vibrant celebration of Bengali wedding rituals, heartfelt moments of sindoor daan, and unscripted family warmth.",
            "images": [
                "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
                "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85"
            ]
        }
    ]'::jsonb
),
(
    'about_images',
    '{
        "storyPortrait": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
        "howWeWork1": "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
        "howWeWork2": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
        "howWeWork3": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        "faqBackground": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;


-- 2. Seed Portfolio
INSERT INTO public.portfolio (id, title, category, imageUrl, "isFeatured")
VALUES
(1, 'The Terrace Promenade', 'Wedding Day', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', true),
(2, 'Quiet Serenity', 'Bridal Portrait', 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80', true),
(3, 'Moments of Joy', 'Celebration', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', true),
(4, 'Regal Crimson', 'Bridal Couture', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', true),
(5, 'Endless Warmth', 'Couple Portrait', 'https://images.unsplash.com/photo-1617059063772-34532796cdb5?auto=format&fit=crop&w=800&q=80', true),
(6, 'The Sacred Vows', 'Traditional Ceremony', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', true),
(7, 'Soft Anticipation', 'Fine Art', 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=800&q=80', true),
(8, 'Laughter Unscripted', 'Reception', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', true),
(9, 'Hills of Rishikesh', 'Pre Wedding', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', false),
(10, 'Ankit & Ashmita', 'Pre Wedding', 'https://images.unsplash.com/photo-1617059063772-34532796cdb5?auto=format&fit=crop&w=800&q=80', false)
ON CONFLICT (id) DO UPDATE SET "isFeatured" = EXCLUDED."isFeatured";


-- 3. Seed Pricing Packages
INSERT INTO public.pricing_packages (id, name, badge, coverage, price, features, isPopular)
VALUES
(
    'silver',
    'SILVER PACKAGE',
    NULL,
    '2 Days Coverage',
    'Rs. 75,000',
    '["Traditional Photography", "Traditional Videography", "30 Pages Album (250 Photos)", "Full Movie — 2.5 to 3 Hours"]'::jsonb,
    false
),
(
    'gold',
    'GOLD PACKAGE',
    'MOST POPULAR',
    '2 Days Coverage',
    'Rs. 1,75,000',
    '["Traditional Photography", "Traditional Videography", "Cinematic Videography", "Candid Shoot", "Drone Shoot — 1 Day", "Album — 30 Pages (300 Photos)", "Highlight + Teaser", "Full Movie — 2.5 to 3 Hours"]'::jsonb,
    true
),
(
    'diamond',
    'DIAMOND PACKAGE',
    NULL,
    '2 Days Coverage',
    'Rs. 2,55,000',
    '["Traditional Photography", "Traditional Videography", "Cinematic Videography", "Candid Shoot", "Crowd Capture (Extra Photographer)", "Mobile Cinematographer", "AI Photo Scan", "Drone Shoot — 1 Day", "Album — 40 Pages (400 Photos) + Pen Drive", "Pre-Wedding Shoot — 1 Day", "Countdown 10-Day Photos + Cinematic Video", "Highlight + Teaser", "Full Movie — 2.5 to 3 Hours"]'::jsonb,
    false
)
ON CONFLICT (id) DO NOTHING;


-- 4. Seed Team Members
INSERT INTO public.team_members (id, name, role, bio, imageUrl, iconName)
VALUES
(
    'sanjib',
    'Sanjib Bhowmik',
    'Founder & Principal Photographer',
    'With over a decade dedicated to wedding visual arts, Sanjib leads every primary commission, bringing an instinctive eye for unscripted intimacy, cultural nuance, and evocative natural light.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'Camera'
),
(
    'rahul',
    'Rahul Debbarma',
    'Head of Cinematic Filmmaking',
    'Mastering digital cinema cameras and delicate audio design, Rahul captures the movement, laughter, and sacred vows that transform memories into heirloom films.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'Film'
),
(
    'priyanka',
    'Priyanka Saha',
    'Lead Candid Artist & Drone Specialist',
    'Specializing in fleeting emotional micro-moments and licensed aerial perspectives, Priyanka documents the joyful spontaneity of wedding celebrations.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    'Eye'
),
(
    'debjit',
    'Debjit Paul',
    'Master Colorist & Album Artisan',
    'Dedicated to timeless color fidelity, skin-tone perfection, and handcrafted flush-mount fine-art albums designed to endure for generations.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    'Sparkles'
)
ON CONFLICT (id) DO NOTHING;


-- 5. Seed Testimonials
INSERT INTO public.testimonials (id, quote, authors)
VALUES
('1', '‘Working with CaM-Mystery was one of the best decisions we made for our wedding. They listened closely to what we wanted and delivered something far beyond our expectations. The care they brought to every single frame made us feel truly seen.’', 'GAURAV + ANANYA'),
('2', '‘From our engagement session right through the wedding day, the experience was effortless. They blended into our day so naturally that we almost forgot they were there — and then we saw the photos. Absolute magic.’', 'ASHKA + TINU'),
('3', '‘Professional, warm, and endlessly talented. The whole team made our day feel relaxed and joyful, and the final gallery left us speechless. We couldn’t recommend them highly enough.’', 'RIYA + KEVIN')
ON CONFLICT (id) DO NOTHING;


-- 6. Seed FAQs
INSERT INTO public.faqs (id, question, answer)
VALUES
('in-person', 'Will you be at my wedding in person?', 'Yes, absolutely. Sanjib Bhowmik personally leads and shoots every primary wedding assignment along with our dedicated core team of cinematographers and second photographers to ensure a consistent artistic vision and flawless coverage.'),
('destination', 'Do you photograph destination weddings?', 'We photograph destination weddings all across India and internationally. Whether your celebration is in Rajasthan, Goa, the hills of Himachal, or abroad, our team travels seamlessly to document your story.'),
('editing-style', 'How would you describe your editing style?', 'Our editing philosophy is timeless, authentic, and true to life. We avoid passing fads or overly stylized filters, focusing instead on organic skin tones, rich dimensional light, and genuine colors that look breathtaking today and thirty years from now.'),
('drone', 'Do you offer drone coverage?', 'Yes, professional licensed aerial drone cinematography is included with our Gold and Diamond packages, capturing grand establishing perspectives of your venue, procession, and celebrations.'),
('pricing', 'What is your pricing structure?', 'Our bespoke wedding collections start at Rs. 75,000 for Silver, Rs. 1,75,000 for Gold, and Rs. 2,55,000 for Diamond. All packages can be fully customized with additional days, events, or specific family heirloom album requirements.')
ON CONFLICT (id) DO NOTHING;
