import fetch from 'node-fetch';

console.log('🧪 Testing Substack API from server...');

try {
  const response = await fetch('https://thecuriousnobody.substack.com/api/v1/posts?limit=3');
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('✅ SUCCESS: Fetched', data.length, 'posts');
  console.log('📝 First post:', {
    title: data[0]?.title,
    subtitle: data[0]?.subtitle,
    cover_image: data[0]?.cover_image ? 'Present' : 'Missing'
  });
} catch (error) {
  console.error('❌ ERROR:', error.message);
}