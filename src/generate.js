const axios = require('axios');

// Replace with your backend URL
const API_URL = 'http://localhost:5900/posts';

// Sample user ID (you would need to get the actual user ID)
const userId = '67653afaccf857cd92955603'; // Replace this with a valid user ID

// Sample post data for 10 posts with real image URLs

    const postsData = [
        { location: 'Paris', description: 'Eiffel Tower', timeOfVisit: new Date(), photos: ['https://example.com/photo1.jpg'], geotag: [2.2945, 48.8584] }, // Corrected
        { location: 'Rome', description: 'Colosseum', timeOfVisit: new Date(), photos: ['https://example.com/photo2.jpg'], geotag: [12.4922, 41.8902] }, // Corrected
        { location: 'New York', description: 'Statue of Liberty', timeOfVisit: new Date(), photos: ['https://example.com/photo3.jpg'], geotag: [-74.0445, 40.6892] }, // Corrected
        { location: 'Tokyo', description: 'Mount Fuji', timeOfVisit: new Date(), photos: ['https://example.com/photo4.jpg'], geotag: [138.7274, 35.3606] }, // Corrected
        { location: 'London', description: 'Big Ben', timeOfVisit: new Date(), photos: ['https://example.com/photo5.jpg'], geotag: [-0.1246, 51.5007] }, // Corrected
        { location: 'Sydney', description: 'Opera House', timeOfVisit: new Date(), photos: ['https://example.com/photo6.jpg'], geotag: [151.2153, -33.8568] }, // Corrected
        { location: 'Berlin', description: 'Brandenburg Gate', timeOfVisit: new Date(), photos: ['https://example.com/photo7.jpg'], geotag: [13.3777, 52.5160] }, // Corrected
        { location: 'Dubai', description: 'Burj Khalifa', timeOfVisit: new Date(), photos: ['https://example.com/photo8.jpg'], geotag: [55.2744, 25.1975] }, // Corrected
        { location: 'Moscow', description: 'Red Square', timeOfVisit: new Date(), photos: ['https://example.com/photo9.jpg'], geotag: [37.6173, 55.7558] }, // Corrected
        { location: 'Cairo', description: 'Pyramids of Giza', timeOfVisit: new Date(), photos: ['https://example.com/photo10.jpg'], geotag: [31.1342, 29.9792] } // Corrected
    ];

// Function to create multiple posts
async function createPosts() {
    try {
        for (let i = 0; i < postsData.length; i++) {
            const post = postsData[i];

            // Wrap geotag coordinates in the GeoJSON format
            const geoJsonGeotag = {
                type: "Point",        // The type of geospatial object
                coordinates: post.geotag // Pass the coordinates in the [longitude, latitude] format
            };

            // Send POST request to the API
            const response = await axios.post(API_URL, {
                userId: userId,
                location: post.location,
                description: post.description,
                timeOfVisit: post.timeOfVisit,
                photos: post.photos,
                geotag: geoJsonGeotag // Use GeoJSON format here
            });
            
            console.log(`Post ${i + 1} created successfully:`, response.data);
        }
    } catch (error) {
        console.error('Error creating posts:', error);
    }
}

// Call the function to create posts
createPosts();
