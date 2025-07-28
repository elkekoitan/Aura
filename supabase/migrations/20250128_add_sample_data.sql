-- Sample Data Migration for Aura Fashion App
-- This migration adds realistic sample data for development and testing

-- Insert sample brands
INSERT INTO brands (id, name, description, logo_url, website_url, is_featured) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Aura Couture', 'Luxury digital fashion house specializing in holographic and futuristic designs', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop', 'https://auracouture.com', true),
('550e8400-e29b-41d4-a716-446655440002', 'Neon Dreams', 'Cyberpunk-inspired streetwear with LED integration and smart fabrics', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', 'https://neondreams.fashion', true),
('550e8400-e29b-41d4-a716-446655440003', 'Ethereal Studios', 'Minimalist luxury with sustainable materials and timeless designs', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop', 'https://etherealstudios.com', true),
('550e8400-e29b-41d4-a716-446655440004', 'Quantum Threads', 'High-tech fashion with color-changing fabrics and AR integration', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=200&fit=crop', 'https://quantumthreads.tech', false),
('550e8400-e29b-41d4-a716-446655440005', 'Prism Fashion', 'Bold geometric patterns with holographic and iridescent materials', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop', 'https://prismfashion.co', true),
('550e8400-e29b-41d4-a716-446655440006', 'Digital Luxe', 'Premium virtual fashion for the metaverse and digital experiences', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop', 'https://digitalluxe.vr', false),
('550e8400-e29b-41d4-a716-446655440007', 'Future Form', 'Avant-garde designs pushing the boundaries of wearable technology', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', 'https://futureform.design', true),
('550e8400-e29b-41d4-a716-446655440008', 'Cosmic Couture', 'Space-age fashion inspired by galaxies and cosmic phenomena', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop', 'https://cosmiccouture.space', false);

-- Insert sample categories
INSERT INTO categories (id, name, description, parent_id) VALUES
('cat-dresses', 'Dresses', 'Elegant dresses for all occasions', NULL),
('cat-tops', 'Tops', 'Stylish tops and blouses', NULL),
('cat-bottoms', 'Bottoms', 'Pants, skirts, and shorts', NULL),
('cat-outerwear', 'Outerwear', 'Jackets, coats, and blazers', NULL),
('cat-accessories', 'Accessories', 'Fashion accessories and jewelry', NULL),
('cat-footwear', 'Footwear', 'Shoes and boots', NULL),
('cat-evening', 'Evening Wear', 'Formal and evening attire', 'cat-dresses'),
('cat-casual', 'Casual Wear', 'Everyday comfortable clothing', 'cat-dresses'),
('cat-smart', 'Smart Casual', 'Professional and semi-formal wear', 'cat-tops');

-- Insert sample products
INSERT INTO products (id, name, description, price, brand_id, category, sizes, colors, images, is_featured, stock_quantity) VALUES
('prod-001', 'Holographic Evening Gown', 'Stunning floor-length gown with color-shifting holographic fabric that adapts to lighting conditions. Perfect for special occasions and red carpet events.', 899.99, '550e8400-e29b-41d4-a716-446655440001', 'cat-evening', '["XS", "S", "M", "L", "XL"]', '["Holographic Silver", "Holographic Gold", "Holographic Rose"]', '["https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop"]', true, 25),

('prod-002', 'Neon LED Jacket', 'Cyberpunk-inspired jacket with programmable LED strips and smart fabric technology. Control colors and patterns via mobile app.', 599.99, '550e8400-e29b-41d4-a716-446655440002', 'cat-outerwear', '["S", "M", "L", "XL", "XXL"]', '["Neon Blue", "Electric Pink", "Cyber Green", "Digital Purple"]', '["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"]', true, 15),

('prod-003', 'Ethereal Silk Blouse', 'Minimalist luxury blouse crafted from sustainable peace silk with subtle iridescent threading. Timeless elegance meets conscious fashion.', 299.99, '550e8400-e29b-41d4-a716-446655440003', 'cat-smart', '["XS", "S", "M", "L", "XL"]', '["Pearl White", "Champagne", "Soft Rose", "Sage Green"]', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=400&h=600&fit=crop"]', false, 40),

('prod-004', 'Quantum Color-Change Dress', 'Revolutionary dress with thermochromic and photochromic materials that change color based on temperature and light exposure.', 1299.99, '550e8400-e29b-41d4-a716-446655440004', 'cat-casual', '["S", "M", "L", "XL"]', '["Quantum Blue", "Thermal Red", "Photo Purple", "Reactive Green"]', '["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=400&h=600&fit=crop"]', true, 8),

('prod-005', 'Prism Geometric Top', 'Bold geometric patterns with holographic panels that create stunning visual effects. Modern art meets wearable fashion.', 199.99, '550e8400-e29b-41d4-a716-446655440005', 'cat-tops', '["XS", "S", "M", "L", "XL", "XXL"]', '["Prism Rainbow", "Geometric Gold", "Crystal Clear", "Diamond Blue"]', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop"]', false, 30),

('prod-006', 'Digital Luxe VR Suit', 'Premium virtual fashion piece designed for metaverse experiences. Includes haptic feedback integration and AR visualization.', 2499.99, '550e8400-e29b-41d4-a716-446655440006', 'cat-outerwear', '["S", "M", "L", "XL"]', '["Virtual Gold", "Digital Silver", "Metaverse Blue", "Cyber Black"]', '["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"]', true, 5),

('prod-007', 'Future Form Asymmetric Dress', 'Avant-garde asymmetric dress with integrated sensors and responsive fabric technology. Fashion meets wearable tech.', 799.99, '550e8400-e29b-41d4-a716-446655440007', 'cat-evening', '["XS", "S", "M", "L", "XL"]', '["Tech Black", "Future Silver", "Innovation White", "Progress Blue"]', '["https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop"]', false, 12),

('prod-008', 'Cosmic Galaxy Pants', 'High-waisted pants with cosmic print and fiber optic threading that mimics starlight. Comfortable fit with futuristic aesthetics.', 399.99, '550e8400-e29b-41d4-a716-446655440008', 'cat-bottoms', '["XS", "S", "M", "L", "XL", "XXL"]', '["Galaxy Purple", "Nebula Pink", "Cosmic Blue", "Stellar Black"]', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop"]', false, 22),

-- Additional products for comprehensive catalog
('prod-009', 'Aura Signature Blazer', 'Tailored blazer with subtle holographic lining and smart temperature regulation. Perfect for professional settings.', 549.99, '550e8400-e29b-41d4-a716-446655440001', 'cat-outerwear', '["XS", "S", "M", "L", "XL"]', '["Midnight Black", "Charcoal Grey", "Navy Blue", "Burgundy"]', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop"]', false, 18),

('prod-010', 'Neon Street Joggers', 'Comfortable joggers with reflective neon strips and moisture-wicking smart fabric. Ideal for urban adventures.', 179.99, '550e8400-e29b-41d4-a716-446655440002', 'cat-bottoms', '["S", "M", "L", "XL", "XXL"]', '["Electric Blue", "Neon Green", "Hot Pink", "Cyber Orange"]', '["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop"]', false, 35),

('prod-011', 'Ethereal Maxi Dress', 'Flowing maxi dress made from organic bamboo silk with hand-painted watercolor patterns. Sustainable luxury fashion.', 449.99, '550e8400-e29b-41d4-a716-446655440003', 'cat-casual', '["XS", "S", "M", "L", "XL"]', '["Ocean Blue", "Sunset Orange", "Forest Green", "Lavender Purple"]', '["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop"]', true, 20),

('prod-012', 'Quantum Tech Sneakers', 'High-tech sneakers with adaptive cushioning and color-changing soles. Comfort meets cutting-edge technology.', 399.99, '550e8400-e29b-41d4-a716-446655440004', 'cat-footwear', '["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]', '["Quantum White", "Tech Black", "Future Silver", "Digital Blue"]', '["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"]', false, 28),

('prod-013', 'Prism Crystal Earrings', 'Statement earrings with holographic crystals that refract light into rainbow patterns. Handcrafted luxury accessories.', 129.99, '550e8400-e29b-41d4-a716-446655440005', 'cat-accessories', '["One Size"]', '["Crystal Clear", "Rainbow Prism", "Golden Prism", "Silver Prism"]', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop"]', false, 50),

('prod-014', 'Digital Luxe VR Gloves', 'Haptic feedback gloves for enhanced virtual reality experiences. Premium materials with advanced sensor technology.', 899.99, '550e8400-e29b-41d4-a716-446655440006', 'cat-accessories', '["S", "M", "L", "XL"]', '["VR Black", "Digital White", "Cyber Blue", "Meta Silver"]', '["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop"]', false, 10),

('prod-015', 'Future Form Cape', 'Dramatic cape with integrated LED fiber optics and wind-responsive design. Wearable art for the modern age.', 1199.99, '550e8400-e29b-41d4-a716-446655440007', 'cat-outerwear', '["One Size"]', '["Midnight Black", "Electric Blue", "Cosmic Purple", "Future Silver"]', '["https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=400&h=600&fit=crop"]', true, 6),

-- Additional products for each brand
('prod-016', 'Cosmic Nebula Dress', 'Flowing dress with fiber optic constellation patterns that twinkle like real stars. Perfect for evening events.', 699.99, '550e8400-e29b-41d4-a716-446655440008', 'cat-evening', '["XS", "S", "M", "L", "XL"]', '["Deep Space", "Milky Way", "Aurora", "Supernova"]', '["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop"]', true, 14),

('prod-017', 'Aura Holographic Sneakers', 'Limited edition sneakers with holographic upper and smart sole technology for ultimate comfort and style.', 349.99, '550e8400-e29b-41d4-a716-446655440001', 'cat-footwear', '["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]', '["Holographic Silver", "Holographic Gold", "Holographic Rainbow"]', '["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"]', false, 32),

('prod-018', 'Neon Pulse Leggings', 'High-performance leggings with integrated LED strips that pulse with your heartbeat. Perfect for workouts and nightlife.', 159.99, '550e8400-e29b-41d4-a716-446655440002', 'cat-bottoms', '["XS", "S", "M", "L", "XL", "XXL"]', '["Electric Blue", "Neon Pink", "Cyber Green", "Pulse Purple"]', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop"]', false, 45),

('prod-019', 'Ethereal Meditation Robe', 'Luxurious meditation robe made from organic bamboo with subtle color-changing properties based on body temperature.', 389.99, '550e8400-e29b-41d4-a716-446655440003', 'cat-outerwear', '["S", "M", "L", "XL"]', '["Zen White", "Calm Blue", "Peace Green", "Harmony Purple"]', '["https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=400&h=600&fit=crop"]', false, 18),

('prod-020', 'Quantum Shift Jacket', 'Revolutionary jacket that adapts its color and pattern based on environmental conditions and wearer preferences.', 899.99, '550e8400-e29b-41d4-a716-446655440004', 'cat-outerwear', '["S", "M", "L", "XL", "XXL"]', '["Adaptive Black", "Chameleon Mode", "Weather Sync", "Mood Responsive"]', '["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop"]', true, 11);

-- Insert product categories relationships
INSERT INTO product_categories (product_id, category_id) VALUES
('prod-001', 'cat-dresses'),
('prod-001', 'cat-evening'),
('prod-002', 'cat-outerwear'),
('prod-003', 'cat-tops'),
('prod-003', 'cat-smart'),
('prod-004', 'cat-dresses'),
('prod-004', 'cat-casual'),
('prod-005', 'cat-tops'),
('prod-006', 'cat-outerwear'),
('prod-007', 'cat-dresses'),
('prod-007', 'cat-evening'),
('prod-008', 'cat-bottoms'),
('prod-016', 'cat-dresses'),
('prod-016', 'cat-evening'),
('prod-017', 'cat-footwear'),
('prod-018', 'cat-bottoms'),
('prod-019', 'cat-outerwear'),
('prod-020', 'cat-outerwear');

-- Insert product images
INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order) VALUES
('img-001-1', 'prod-001', 'https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=800&h=1200&fit=crop', 'Holographic Evening Gown - Front View', true, 1),
('img-001-2', 'prod-001', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop', 'Holographic Evening Gown - Side View', false, 2),
('img-002-1', 'prod-002', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop', 'Neon LED Jacket - Front View', true, 1),
('img-002-2', 'prod-002', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop', 'Neon LED Jacket - LED Pattern Detail', false, 2),
('img-003-1', 'prod-003', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop', 'Ethereal Silk Blouse - Front View', true, 1),
('img-004-1', 'prod-004', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1200&fit=crop', 'Quantum Color-Change Dress - Default State', true, 1),
('img-005-1', 'prod-005', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop', 'Prism Geometric Top - Front View', true, 1),
('img-006-1', 'prod-006', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop', 'Digital Luxe VR Suit - Full View', true, 1),
('img-007-1', 'prod-007', 'https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=800&h=1200&fit=crop', 'Future Form Asymmetric Dress - Front View', true, 1),
('img-008-1', 'prod-008', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop', 'Cosmic Galaxy Pants - Front View', true, 1),
('img-016-1', 'prod-016', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1200&fit=crop', 'Cosmic Nebula Dress - Front View', true, 1),
('img-017-1', 'prod-017', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop', 'Aura Holographic Sneakers - Side View', true, 1),
('img-018-1', 'prod-018', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop', 'Neon Pulse Leggings - Front View', true, 1),
('img-019-1', 'prod-019', 'https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=800&h=1200&fit=crop', 'Ethereal Meditation Robe - Full View', true, 1),
('img-020-1', 'prod-020', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop', 'Quantum Shift Jacket - Adaptive Mode', true, 1);
