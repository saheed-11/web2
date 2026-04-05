# IEEE Student Branch Website

A modern, professional website for IEEE Student Branch at Carmel College of Engineering and Technology.

## Features

### ✨ Modern Design
- Clean, IEEE-inspired design with blue color palette
- Professional UI/UX optimized for technical organizations
- Smooth animations and micro-interactions using Framer Motion
- Fully responsive and mobile-first design

### 🌙 Dark Mode
- Toggle between light and dark themes
- Persists user preference in localStorage
- Smooth transitions between themes

### 📄 Complete Page Structure

1. **Home Page**
   - Hero section with compelling CTA
   - Statistics showcase
   - About IEEE summary
   - Features/benefits grid
   - Upcoming events preview
   - Member testimonials
   - Call-to-action section

2. **About Page**
   - What is IEEE
   - About our student branch
   - Mission & Vision statements
   - Core values
   - Timeline/Milestones
   - Team preview

3. **Events Page**
   - Upcoming events with registration
   - Past events archive
   - Search and filter functionality
   - Event categories and details

4. **Team Page**
   - Faculty advisors
   - Core committee members (2025-26)
   - Contact information for each member
   - Social media links

5. **Projects Page**
   - Student projects showcase
   - Category filtering
   - Project details with technologies used
   - Links to code and demos

6. **Blog Page**
   - Technical articles and insights
   - Featured post section
   - Author information and read times
   - Tags and categories

7. **Gallery Page**
   - Event photos and videos
   - Category filtering
   - Lightbox view for images
   - Organized by event type

8. **Contact Page**
   - Contact form with validation
   - Interactive map integration
   - Contact information cards
   - Social media links
   - FAQ section

### 🎨 Technical Features
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v3
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Responsive**: Mobile-first approach
- **Accessibility**: ARIA labels, semantic HTML, proper contrast
- **SEO-friendly**: Meta tags, semantic structure

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saheed-11/web2.git
cd web2
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Events.jsx
│   │   ├── Team.jsx
│   │   ├── Projects.jsx
│   │   ├── Blog.jsx
│   │   ├── Gallery.jsx
│   │   └── Contact.jsx
│   ├── styles/          # Global styles
│   │   └── index.css
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── old_site/           # Backup of original site
├── index.html          # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```js
colors: {
  ieee: {
    blue: '#0369a1',
    'blue-dark': '#0a3d91',
    // ... more colors
  }
}
```

### Content
Update content in individual page components located in `src/pages/`

### Images
Replace placeholder images with actual event photos and team pictures

## Deployment

### Vercel/Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

#### Vercel SPA Routing (Important)
This project uses BrowserRouter for client-side routing. Add a Vercel rewrite so refreshing deep links like `/about` or `/events/123` serves `index.html` instead of a 404 page.

Create `vercel.json` in the project root:

```json
{
   "rewrites": [
      {
         "source": "/((?!api/|.*\\..*).*)",
         "destination": "/index.html"
      }
   ]
}
```

If your API is hosted separately, keep `VITE_API_URL` set to the backend URL so API requests are not treated as frontend routes.

### GitHub Pages
```bash
npm run build
# Deploy the dist/ folder to gh-pages branch
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
ISC License

## Contact
- Email: ieeecarmelcollege@gmail.com
- Phone: +91 97780 12972
- Address: Punnapra P.O., Alappuzha, Kerala, India - 688004

## Acknowledgments
- IEEE for inspiring the design and values
- Carmel College of Engineering and Technology
- All student branch members and contributors

---

Built with ❤️ by IEEE Student Branch, Carmel College
