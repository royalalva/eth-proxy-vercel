const ETH_KEYS = process.env.ETH_KEYS?.split(',') || []
const BSC_KEYS = process.env.BSC_KEYS?.split(',') || []
let index = { eth: 0, bsc: 0 }

function getKey(chain) {
  const keys = chain === 'bsc' ? BSC_KEYS : ETH_KEYS
  const i = index[chain] || 0
  index[chain] = (i + 1) % keys.length
  return keys[i]
}

export default async function handler(req, res) {
  const { chain = 'eth', address } = req.query
  if (!address) return res.status(400).json({ error: 'Missing address' })

  const base = chain === 'bsc'
    ? 'https://api.bscscan.com'
    : 'https://api.etherscan.io'

  const url = `${base}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${getKey(chain)}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from upstream' })
  }
}
