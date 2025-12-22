import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    const portfolioData = req.body

    // Validate the data structure
    if (!portfolioData || !portfolioData.items || !Array.isArray(portfolioData.items)) {
      return res.status(400).json({ error: 'Invalid portfolio data structure' })
    }

    // Path to the portfolio JSON file
    const dataPath = path.join(process.cwd(), 'public', 'data', 'behance-portfolio.json')

    // Ensure the directory exists
    const dataDir = path.dirname(dataPath)
    await fs.mkdir(dataDir, { recursive: true })

    // Add metadata
    const finalData = {
      ...portfolioData,
      lastUpdated: new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      updateMethod: 'admin_panel'
    }

    // Write the file
    await fs.writeFile(dataPath, JSON.stringify(finalData, null, 2))

    console.log(`✅ Portfolio updated via admin panel: ${portfolioData.items.length} projects`)

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully',
      itemCount: portfolioData.items.length,
      lastUpdated: finalData.lastUpdated
    })

  } catch (error) {
    console.error('❌ Error saving portfolio:', error)
    
    res.status(500).json({
      error: 'Failed to save portfolio',
      message: error.message
    })
  }
}