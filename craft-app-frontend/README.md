# Craft Marketplace Frontend

A modern React frontend for the Sri Lankan crafts selling platform built with Vite, React Router, and Tailwind CSS.

## Features

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Beautiful animations and transitions
  - Mobile-first approach

- **User Authentication**
  - User registration and login
  - Role-based access control (Customer, Creator, Admin)
  - Protected routes
  - JWT token management

- **Product Management**
  - Product browsing with filters and search
  - Product details with image gallery
  - Category-based filtering
  - Sorting options

- **Shopping Cart**
  - Add/remove items
  - Quantity management
  - Persistent cart state
  - Cart summary

- **User Experience**
  - Toast notifications
  - Loading states
  - Error handling
  - Responsive navigation

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd craft-app-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Auth/           # Authentication components
│   └── Layout/         # Layout components
├── context/            # React Context providers
├── pages/              # Page components
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=CraftMarket
```

## Features Overview

### Authentication
- User registration with role selection
- Email verification flow
- Login/logout functionality
- Protected routes based on user roles

### Product Browsing
- Product grid with filtering
- Search functionality
- Category-based filtering
- Price and date sorting
- Pagination

### Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- Persistent cart state
- Cart summary

### User Roles

1. **Customer (User)**
   - Browse products
   - Add to cart
   - Place orders
   - View order history

2. **Creator (Seller)**
   - All customer features
   - Product management
   - Sales dashboard
   - Order management

3. **Admin**
   - All features
   - User management
   - Platform analytics
   - System administration

## API Integration

The frontend integrates with the backend API endpoints:

- Authentication: `/api/auth/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`
- Payments: `/api/payments/*`
- Admin: `/api/admin/*`

## Styling

The project uses Tailwind CSS for styling with:

- Custom color scheme
- Responsive design
- Component-based styling
- Dark mode support (planned)

## State Management

React Context API is used for state management:

- **AuthContext**: User authentication state
- **ProductContext**: Product data and operations
- **CartContext**: Shopping cart state

## Development

### Code Style
- ESLint configuration
- Prettier formatting
- Component-based architecture
- Custom hooks for logic

### Performance
- Code splitting with React Router
- Lazy loading of components
- Optimized images
- Efficient state updates

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

### Deploy to Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend is running
   - Check API URL in environment variables
   - Verify CORS configuration

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check for missing dependencies
   - Verify Node.js version

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify class names

## Support

For support, create an issue in the repository or contact the development team.

## License

This project is licensed under the MIT License.
