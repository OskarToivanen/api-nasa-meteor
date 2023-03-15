const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv').config()
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/neows', async (req, res) => {
  try {
    const startDate = req.query.start_date
    const endDate = req.query.end_date
    const url = `${process.env.BASE_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${process.env.NASA_API_KEY}`
    const response = await axios.get(url)
    const data = response.data
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.listen(5000, () => console.log('Server started on port 5000'))
