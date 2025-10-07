const { ContentService } = require('./src/services/contentService.ts');

async function testAPIs() {
  const contentService = ContentService.getInstance();

  console.log('\n🔍 Testing Content APIs...\n');

  // Test Substack
  try {
    console.log('📰 Testing Substack...');
    const substackFeed = await contentService.getSubstackPosts();
    console.log(`✅ Substack: ${substackFeed.items.length} posts`);
    if (substackFeed.items.length > 0) {
      console.log(`   First post: "${substackFeed.items[0].title}"`);
    }
  } catch (error) {
    console.log(`❌ Substack failed: ${error.message}`);
  }

  // Test YouTube
  try {
    console.log('\n🎥 Testing YouTube...');
    const youtubeFeed = await contentService.getYouTubeVideos();
    console.log(`✅ YouTube: ${youtubeFeed.items.length} videos`);
    if (youtubeFeed.items.length > 0) {
      console.log(`   First video: "${youtubeFeed.items[0].title}"`);
    }
  } catch (error) {
    console.log(`❌ YouTube failed: ${error.message}`);
  }

  // Test Spotify
  try {
    console.log('\n🎵 Testing Spotify...');
    const spotifyFeed = await contentService.getSpotifyContent();
    console.log(`✅ Spotify: ${spotifyFeed.items.length} releases`);
    if (spotifyFeed.items.length > 0) {
      console.log(`   First release: "${spotifyFeed.items[0].title}"`);
    }
  } catch (error) {
    console.log(`❌ Spotify failed: ${error.message}`);
  }

  // Test Behance
  try {
    console.log('\n🎨 Testing Behance...');
    const behanceFeed = await contentService.getBehanceProjects();
    console.log(`✅ Behance: ${behanceFeed.items.length} projects`);
    if (behanceFeed.items.length > 0) {
      console.log(`   First project: "${behanceFeed.items[0].title}"`);
    }
  } catch (error) {
    console.log(`❌ Behance failed: ${error.message}`);
  }

  console.log('\n🏁 API Test Complete\n');
}

testAPIs().catch(console.error);