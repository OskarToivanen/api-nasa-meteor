import React, { useState } from 'react'
import axios from 'axios'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
} from '@mui/material'

interface NeoWsData {
  near_earth_objects: Record<string, Neo[]>
  links: object
  page: object
  element_count: number
}

interface Neo {
  id: string
  name: string
  close_approach_data: {
    miss_distance: {
      kilometers: string
    }
    relative_velocity: {
      kilometers_per_hour: string
    }
  }[]
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
}

const NeoWs = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [neows, setNeows] = useState<NeoWsData | null>(null)

  const maxDate = new Date().toISOString().split('T')[0] // today's date

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedStartDate = new Date(event.target.value)
    setStartDate(event.target.value)

    const selectedEndDate = new Date(
      selectedStartDate.getTime() + 7 * 24 * 60 * 60 * 1000
    )
    setEndDate(selectedEndDate.toISOString().split('T')[0])
  }

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value)
  }

  const handleFetchData = async () => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0]
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0]
      const response = await axios.get<NeoWsData>(
        `http://localhost:5000/neows?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
      )
      const data = response.data
      setNeows(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Container maxWidth='md'>
        <div>
          <label htmlFor='start-date'>Start Date:</label>
          <input
            type='date'
            id='start-date'
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label htmlFor='end-date'>End Date:</label>
          <input
            type='date'
            id='end-date'
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}
            max={maxDate}
          />
        </div>
        <button onClick={handleFetchData}>Fetch NEOs</button>
        {neows?.near_earth_objects && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align='right'>Estimated Diameter (km)</TableCell>
                  <TableCell align='right'>Miss Distance (km)</TableCell>
                  <TableCell align='right'>Velocity (km/h)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(neows.near_earth_objects).map((date) =>
                  date.map((neo) => (
                    <TableRow key={neo.id}>
                      <TableCell>{neo.name}</TableCell>
                      <TableCell align='right'>
                        {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
                          2
                        )}{' '}
                        -{' '}
                        {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
                          2
                        )}
                      </TableCell>
                      <TableCell align='right'>
                        {parseFloat(
                          neo.close_approach_data[0].miss_distance.kilometers
                        ).toFixed(0)}
                      </TableCell>
                      <TableCell align='right'>
                        {parseFloat(
                          neo.close_approach_data[0].relative_velocity
                            .kilometers_per_hour
                        ).toFixed(0)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </div>
  )
}

export default NeoWs
