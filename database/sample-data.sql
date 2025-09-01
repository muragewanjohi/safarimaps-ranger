-- Sample Data for SafariMap GameWarden
-- Run this SQL in your Supabase SQL Editor after creating the main schema
-- Note: This requires existing users in auth.users table

-- Sample incidents (you'll need to replace the reported_by UUIDs with actual user IDs)
INSERT INTO incidents (title, category, severity, status, description, tourists_affected, location, coordinates, reported_by) VALUES
('Vehicle Breakdown on Safari Route', 'Vehicle', 'High', 'In Progress', 'Safari van broke down with 8 tourists on board. No injuries reported.', 8, 'Main Safari Route A-12', '1.2921° S, 35.5739° E', (SELECT id FROM profiles LIMIT 1)),
('Wildlife Sighting - Lion Pride', 'Wildlife', 'Medium', 'Reported', 'Large pride of lions spotted near watering hole. Tourists advised to maintain distance.', 0, 'Watering Hole B-7', '1.2950° S, 35.5800° E', (SELECT id FROM profiles LIMIT 1)),
('Medical Emergency - Tourist', 'Medical', 'Critical', 'In Progress', 'Tourist experiencing chest pain. Emergency services contacted.', 1, 'Lodge Area C-3', '1.2900° S, 35.5700° E', (SELECT id FROM profiles LIMIT 1));

-- Sample locations
INSERT INTO locations (title, category, subcategory, description, coordinates, count, operating_hours, contact, best_time_to_visit, is_endangered, reported_by) VALUES
('Elephant Herd', 'Wildlife', 'African Elephant', 'Large herd of elephants spotted near the river', '1.2930° S, 35.5750° E', 12, NULL, NULL, 'Early Morning (6:00-8:00 AM)', false, (SELECT id FROM profiles LIMIT 1)),
('Lion Pride', 'Wildlife', 'African Lion', 'Dominant male with 3 females and 4 cubs', '1.2950° S, 35.5800° E', 8, NULL, NULL, 'Late Afternoon (4:00-6:00 PM)', false, (SELECT id FROM profiles LIMIT 1)),
('Mara Serena Lodge', 'Hotel', 'Luxury Lodge', '5-star lodge with excellent game viewing', '1.2900° S, 35.5700° E', NULL, '24/7', '+254 20 1234567', 'Anytime', false, (SELECT id FROM profiles LIMIT 1)),
('Fig Tree Restaurant', 'Dining', 'Fine Dining', 'Upscale restaurant with local and international cuisine', '1.2910° S, 35.5710° E', NULL, '6:00 AM - 10:00 PM', '+254 20 1234568', 'Evening (7:00-9:00 PM)', false, (SELECT id FROM profiles LIMIT 1)),
('Sunset Viewpoint', 'Viewpoint', 'Scenic Overlook', 'Perfect spot for sunset photography with panoramic views', '1.3000° S, 35.5900° E', NULL, '5:00 AM - 8:00 PM', NULL, 'Sunset (5:30-7:00 PM)', false, (SELECT id FROM profiles LIMIT 1)),
('Rhino Conservation Area', 'Wildlife', 'Black Rhino', 'Protected area for endangered black rhinos', '1.2850° S, 35.5650° E', 3, NULL, NULL, 'Morning (7:00-10:00 AM)', true, (SELECT id FROM profiles LIMIT 1));

-- Sample reports
INSERT INTO reports (title, category, severity, status, description, tourists_affected, location, coordinates, reported_by) VALUES
('Poaching Attempt Thwarted', 'Security', 'Critical', 'Resolved', 'Successfully prevented illegal hunting activity. Suspects apprehended.', 0, 'Northern Boundary', '1.2800° S, 35.5600° E', (SELECT id FROM profiles LIMIT 1)),
('Infrastructure Damage', 'Infrastructure', 'High', 'In Progress', 'Bridge on main road requires immediate repair. Alternative route established.', 0, 'Main Access Road', '1.2880° S, 35.5680° E', (SELECT id FROM profiles LIMIT 1)),
('Tourist Safety Incident', 'Safety', 'Medium', 'Reported', 'Tourist wandered off designated path. Located safely after 2 hours.', 1, 'Eastern Sector', '1.3000° S, 35.5800° E', (SELECT id FROM profiles LIMIT 1));

-- Sample location photos (these would be actual photo URLs in production)
INSERT INTO location_photos (location_id, photo_url, photo_name) VALUES
((SELECT id FROM locations WHERE title = 'Elephant Herd' LIMIT 1), 'https://example.com/elephant-herd-1.jpg', 'elephant-herd-1.jpg'),
((SELECT id FROM locations WHERE title = 'Elephant Herd' LIMIT 1), 'https://example.com/elephant-herd-2.jpg', 'elephant-herd-2.jpg'),
((SELECT id FROM locations WHERE title = 'Lion Pride' LIMIT 1), 'https://example.com/lion-pride-1.jpg', 'lion-pride-1.jpg'),
((SELECT id FROM locations WHERE title = 'Mara Serena Lodge' LIMIT 1), 'https://example.com/lodge-exterior.jpg', 'lodge-exterior.jpg'),
((SELECT id FROM locations WHERE title = 'Sunset Viewpoint' LIMIT 1), 'https://example.com/sunset-view.jpg', 'sunset-view.jpg');

-- Assign some achievements to users (replace with actual user IDs)
INSERT INTO user_achievements (user_id, achievement_id) VALUES
((SELECT id FROM profiles LIMIT 1), (SELECT id FROM achievements WHERE title = 'Wildlife Guardian' LIMIT 1)),
((SELECT id FROM profiles LIMIT 1), (SELECT id FROM achievements WHERE title = 'Emergency Responder' LIMIT 1)),
((SELECT id FROM profiles LIMIT 1), (SELECT id FROM achievements WHERE title = 'Tech Pioneer' LIMIT 1));
