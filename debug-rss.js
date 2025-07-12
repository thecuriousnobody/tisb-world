// Debug RSS Feed Test
// Test this in browser console or create a simple debug page

const testSubstackFeed = async () => {
  try {
    console.log('Testing Substack RSS feed...');
    
    // Direct RSS URL
    const feedUrl = 'https://thecuriousnobody.substack.com/feed';
    console.log('Feed URL:', feedUrl);
    
    // CORS Proxy
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const fullUrl = `${proxyUrl}${encodeURIComponent(feedUrl)}`;
    console.log('Proxied URL:', fullUrl);
    
    const response = await fetch(fullUrl);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log('XML Response length:', xmlText.length);
    console.log('XML First 500 chars:', xmlText.substring(0, 500));
    
    // Parse XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    
    // Check for parsing errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      console.error('XML Parse Error:', parseError.textContent);
      return;
    }
    
    const items = Array.from(doc.querySelectorAll('item'));
    console.log('Found items:', items.length);
    
    if (items.length > 0) {
      const firstItem = items[0];
      console.log('First item title:', firstItem.querySelector('title')?.textContent);
      console.log('First item link:', firstItem.querySelector('link')?.textContent);
      console.log('First item pubDate:', firstItem.querySelector('pubDate')?.textContent);
    }
    
    return items;
    
  } catch (error) {
    console.error('RSS Feed Test Error:', error);
  }
};

// Run the test
testSubstackFeed();
