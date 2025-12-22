 hi boo-boo I miss you all the time
export const colors = {
  primary: '#FF4500',      // Orange
  secondary: '#8B4513',    // Brown  
  background: '#FFFFFF',   // White
  surface: '#F5F5F5',      // Light Grey
  text: '#000000',         // Black
  textSecondary: '#666666', // Dark Grey
  
  // Gradients
  greyGradient: 'linear-gradient(135deg, #e8e8e8 0%, #b8b8b8 100%)',
  
  // Beta Feedback specific
  success: '#4caf50',
  error: '#f44336',
  recording: '#f44336',
}
```

## Typography
```typescript
// Font imports needed:
// 1. Self-hosted Yapari: /public/fonts/yapari/
// 2. Google Fonts: 'Space Grotesk'

export const typography = {
  fontFamily: {
    primary: "'Yapari', 'Arial Black', sans-serif",
    secondary: "'Space Grotesk', sans-serif",
  },
  
  weights: {
    normal: 400,
    bold: 700,
    extraBold: 900,
  },
  
  sizes: {
    hero: { xs: '2.5rem', md: '4rem' },
    h1: { xs: '2rem', md: '3rem' },
    h2: { xs: '1.75rem', md: '2.5rem' },
    h3: { xs: '1.5rem', md: '2rem' },
    body: { xs: '1rem', md: '1.125rem' },
  }
}
```

## Key Components to Copy

### 1. Brutalist Button Style
```typescript
const brutalistButton = {
  backgroundColor: '#FF4500',
  color: '#000000',
  fontFamily: "'Yapari', sans-serif",
  fontWeight: 900,
  border: '3px solid #000000',
  borderRadius: 0,
  textTransform: 'uppercase',
  padding: '16px 32px',
  fontSize: '1.1rem',
  '&:hover': {
    backgroundColor: '#000000',
    color: '#FF4500',
    transform: 'translateY(-2px)',
    boxShadow: '4px 4px 0px #FF4500',
  }
}
```

### 2. Card/Section Styling
```typescript
const brutalistCard = {
  backgroundColor: '#000000',
  color: 'white',
  border: '2px solid #FF4500',
  borderRadius: 0,
  padding: { xs: 4, md: 6 },
  boxShadow: '8px 8px 0px #FF4500',
}
```

### 3. Form Input Styling  
```typescript
const brutalistInput = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    border: '2px solid #000000',
    backgroundColor: '#FFFFFF',
    fontFamily: "'Space Grotesk', sans-serif",
    '&:hover fieldset': {
      borderColor: '#FF4500',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF4500',
      borderWidth: '3px',
    },
  }
}
```

## Layout Patterns

### 1. Hero Section
- Large bold typography (Yapari font)
- High contrast (black text on white/orange background)
- Minimal content, maximum impact
- Asymmetrical layouts

### 2. Content Sections
- Clear borders and dividers
- Consistent spacing (multiples of 8px)
- High contrast backgrounds
- Bold typography hierarchy

### 3. Voice/AI Interface Elements
- Large circular buttons (120px+)
- Pulsing animations for recording states
- Progress indicators with bold colors
- Clear status messaging

## Files to Copy
1. `/src/theme.ts` - MUI theme configuration
2. `/src/fonts.css` - Font definitions  
3. `/public/fonts/yapari/` - Self-hosted fonts
4. Key components from BetaFeedback page (voice recording UI)
5. Social section styling patterns

## Package Dependencies
```json
{
  "@mui/material": "^7.2.0",
  "@mui/icons-material": "^7.2.0", 
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1"
}
```
