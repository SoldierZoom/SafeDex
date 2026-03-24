-- Insert sample neighbourhoods
INSERT INTO neighbourhood (name, safety_score, latitude, longitude, population) 
VALUES 
('Downtown', 75, 51.5074, -0.1278, 150000),
('Suburb', 85, 51.5155, -0.0922, 80000),
('Rural Area', 95, 51.4816, -0.1910, 25000);

-- Insert sample properties
INSERT INTO property (name, road, postcode, type, ppm, bedrooms, bathrooms, description, phone_number, email, neighbourhood_id)
VALUES 
('Modern Downtown Apartment', '123 Main St', 'SW1A 1AA', 'FLAT', 2500.0, 2, 1, 'Spacious 2-bed apartment in the heart of downtown with city views.', '020 1234 5678', 'contact@modernapt.com', 1),
('Cozy Suburban House', '456 Oak Lane', 'N1 2BB', 'DETACHED', 1800.0, 3, 2, 'Charming 3-bed house in a quiet suburb with garden.', '020 8765 4321', 'info@cozyhouse.com', 2),
('Rural Cottage', '789 Country Road', 'RG1 3CC', 'SEMI_DETACHED', 1200.0, 2, 1, 'Peaceful 2-bed cottage in the countryside.', '01628 123456', 'rural@cottage.com', 3);
