"use client"

import { useState } from "react"
import { Container, Typography, Box, Paper, TextField, Button, Grid, CircularProgress, Alert } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import axios from "../utils/axios"
import DistributedCreditHistory from "../components/DistributedCreditHistory"

const CreditHistory = () => {
  const { user } = useAuth()
  const [nationalId, setNationalId] = useState("")
  const [borrowerId, setBorrowerId] = useState("")
  const [searchType, setSearchType] = useState("national_id")
  const [searchValue, setSearchValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSearchPerformed(true)

    try {
      if (searchType === "national_id") {
        setNationalId(searchValue)
        setBorrowerId("")
      } else {
        setNationalId("")
        setBorrowerId(searchValue)
      }
    } catch (err) {
      console.error("Error searching credit history:", err)
      setError(err.response?.data?.detail || err.message || "Failed to search credit history")
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get("/api/analytics/test-atlas-connection/")
      alert(
        `MongoDB Atlas Connection: ${response.data.status}\n${response.data.message}\nCollections: ${response.data.collections?.join(", ") || "None"}`,
      )
    } catch (err) {
      console.error("Error testing MongoDB connection:", err)
      setError(err.response?.data?.detail || err.message || "Failed to test MongoDB connection")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Credit History
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Search Borrower Credit History
          </Typography>

          <form onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Search By"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="national_id">National ID</option>
                  <option value="borrower_id">Borrower ID</option>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label={searchType === "national_id" ? "National ID" : "Borrower ID"}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Search"}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" color="secondary" onClick={handleTestConnection} disabled={loading}>
              Test MongoDB Connection
            </Button>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {searchPerformed && (
          <Box mt={4}>
            <DistributedCreditHistory nationalId={nationalId} borrowerId={borrowerId} />
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default CreditHistory
