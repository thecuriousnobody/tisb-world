import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(req, res) {
  // Enable CORS for local development
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { url } = req.body

    if (!url || !url.includes('behance.net/gallery/')) {
      return res.status(400).json({ error: 'Please provide a valid Behance gallery URL' })
    }

    console.log(`🎨 Fetching Behance project: ${url}`)

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.behance.net/',
        'Cache-Control': 'no-cache'
      },
      timeout: 30000
    })

    const $ = cheerio.load(response.data)

    // Extract title
    let title = $('title').text().replace(' on Behance', '').trim() ||
                $('h1').first().text().trim() ||
                $('meta[property="og:title"]').attr('content') ||
                'Untitled Project'

    // Extract description
    let description = $('meta[property="og:description"]').attr('content') ||
                     $('meta[name="description"]').attr('content') ||
                     $('.project-description').text().trim() ||
                     $('.js-project-description').text().trim() ||
                     `Creative project by The Idea Sandbox • View on Behance`

    // Extract thumbnail - look for the main project image with multiple fallbacks
    let thumbnail = $('meta[property="og:image"]').attr('content') ||
                   $('meta[property="og:image:url"]').attr('content') ||
                   $('meta[name="twitter:image"]').attr('content') ||
                   $('.project-cover img').first().attr('src') ||
                   $('.js-project-cover img').first().attr('src') ||
                   $('img[src*="mir-s3-cdn-cf.behance.net"]').first().attr('src') ||
                   $('img[src*="behance.net"]').first().attr('src') ||
                   $('img').first().attr('src') ||
                   ''

    // Clean up the data
    title = title.substring(0, 100).trim()
    description = description.substring(0, 300).trim()

    // Ensure thumbnail URL is complete
    if (thumbnail && !thumbnail.startsWith('http')) {
      thumbnail = thumbnail.startsWith('//') ? `https:${thumbnail}` : `https://www.behance.net${thumbnail}`
    }
    
    // If no thumbnail found, try to generate one from project ID
    if (!thumbnail) {
      const projectIdMatch = url.match(/gallery\/(\d+)/)
      if (projectIdMatch) {
        // This is a placeholder - Behance thumbnails follow patterns but are hard to predict
        thumbnail = `https://via.placeholder.com/400x300/000000/FF4500?text=Behance+Project`
        console.log('🖼️ Using placeholder thumbnail for project:', projectIdMatch[1])
      }
    }

    // Extract project ID from URL for unique ID
    const projectIdMatch = url.match(/gallery\/(\d+)/)
    const projectId = projectIdMatch ? projectIdMatch[1] : Date.now().toString()

    // Generate tags based on title and description
    const tags = generateTags(title, description)

    const projectData = {
      id: `behance-${projectId}`,
      title,
      description,
      link: url,
      thumbnail,
      publishedAt: new Date().toISOString(),
      platform: 'behance',
      author: 'The Idea Sandbox',
      tags
    }

    console.log('✅ Successfully extracted project data:', {
      title: projectData.title,
      hasDescription: !!projectData.description,
      hasThumbnail: !!projectData.thumbnail,
      thumbnailUrl: projectData.thumbnail || 'NO THUMBNAIL FOUND',
      tags: projectData.tags
    })

    res.status(200).json({
      success: true,
      project: projectData
    })

  } catch (error) {
    console.error('❌ Error fetching Behance project:', error.message)
    
    res.status(500).json({
      error: 'Failed to fetch project data',
      message: error.message
    })
  }
}

function generateTags(title, description) {
  const text = `${title} ${description}`.toLowerCase()
  const tags = ['digital art']

  // Add relevant tags based on keywords
  if (text.includes('abstract') || text.includes('fluid') || text.includes('organic')) {
    tags.push('abstract')
  }
  if (text.includes('consciousness') || text.includes('awareness') || text.includes('perception')) {
    tags.push('consciousness')
  }
  if (text.includes('3d') || text.includes('dimensional')) {
    tags.push('3d')
  }
  if (text.includes('light') || text.includes('radiant') || text.includes('luminous')) {
    tags.push('light art')
  }
  if (text.includes('energy') || text.includes('vibration') || text.includes('frequency')) {
    tags.push('energy')
  }
  if (text.includes('emergence') || text.includes('complexity') || text.includes('systems')) {
    tags.push('complexity')
  }

  return tags.slice(0, 4) // Limit to 4 tags
}