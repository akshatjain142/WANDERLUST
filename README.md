# Wanderlust

Wanderlust is a full-stack web application inspired by Airbnb where users can create, browse, and review property listings with authentication, authorization, image upload, and location features.

# Live Demo
https://your-deployed-link.com

# Features
- User authentication (Register / Login / Logout)
- Create, edit, and delete listings
- Add and delete reviews
- Ownership protection for listings and reviews
- Image upload using Cloudinary
- Location support using Mapbox
- Flash messages for success and error handling
- Category-based filtering
- Responsive UI using EJS templates

# Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- EJS
- Passport.js
- express-session
- Cloudinary
- Mapbox

# Project Structure
Wanderlust/
├── models/
├── routes/
├── controllers/
├── middleware.js
├── schema.js
├── utils/
├── views/
├── public/
├── app.js
└── package.json

# Installation

## Clone Repository
git clone https://github.com/your-username/wanderlust.git

## Navigate to Project
cd wanderlust

## Install Dependencies
npm install

## Environment Variables
ATLAS_URL=your_mongodb_url  
SECRET=your_secret  
MAP_TOKEN=your_mapbox_token  
CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_KEY=your_key  
CLOUDINARY_SECRET=your_secret  

## Run Project
node app.js

# Deployment
- Render
- MongoDB Atlas
- Cloudinary

# Future Improvements
- Payment integration
- Wishlist feature
- Advanced search filters
- Admin dashboard

# Author
Akshat Jain
