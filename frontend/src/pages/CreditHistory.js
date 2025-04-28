"use client"

import { useState } from "react"
import { Container, Typography, Box, TextField, Button, Grid, Paper } from "@mui/material"
import DistributedCreditHistory from "../components/DistributedCreditHistory"

const CreditHistory = () => {
  const [nationalId, setNationalId] = useState("")
  const [searchId, setSearchId] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    setNationalId(searchId)
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Distributed Credit History
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          Search for a borrower's distributed credit history across all MFIs in the same location. This helps prevent
          loan stacking and provides a comprehensive view of the borrower's credit profile.
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="National ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter borrower's national ID"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={!searchId}>
                Search Credit History
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {nationalId && <DistributedCreditHistory nationalId={nationalId} />}
    </Container>
  )
}

export default CreditHistory
