"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, Typography, Grid, Box, Button, CircularProgress, Alert } from "@mui/material"
import axios from "../utils/axios"

const DistributedCreditHistory = ({ nationalId }) => {
  const [creditHistory, setCreditHistory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  const fetchCreditHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`/api/loans/distributed-credit-history/${nationalId}/`)
      setCreditHistory(response.data)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch credit history")
    } finally {
      setLoading(false)
    }
  }

  const updateCreditHistory = async () => {
    setUpdating(true)
    try {
      await axios.post(`/api/loans/update-credit-history/${nationalId}/`)
      // Fetch the updated credit history
      await fetchCreditHistory()
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update credit history")
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    if (nationalId) {
      fetchCreditHistory()
    }
  }, [nationalId])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!creditHistory) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            No credit history found
          </Typography>
          <Button variant="contained" color="primary" onClick={updateCreditHistory} disabled={updating}>
            {updating ? "Updating..." : "Create Credit History"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            Credit History for {creditHistory.borrower_name}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={updateCreditHistory}
            disabled={updating}
            startIcon={updating ? <CircularProgress size={20} /> : null}
          >
            {updating ? "Updating..." : "Refresh"}
          </Button>
        </Box>

        <Typography color="textSecondary" gutterBottom>
          National ID: {creditHistory.borrower_id}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Location: {creditHistory.location.district}, {creditHistory.location.city || "N/A"}
        </Typography>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Credit Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Loans
                  </Typography>
                  <Typography variant="h5">{creditHistory.credit_summary.total_loans}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Active Loans
                  </Typography>
                  <Typography variant="h5">{creditHistory.credit_summary.active_loans}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Amount
                  </Typography>
                  <Typography variant="h5">
                    M {creditHistory.credit_summary.total_loan_amount.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Outstanding
                  </Typography>
                  <Typography variant="h5">
                    M {creditHistory.credit_summary.outstanding_amount.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Payment History
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ bgcolor: "#e8f5e9" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    On-time Payments
                  </Typography>
                  <Typography variant="h5">{creditHistory.credit_summary.on_time_payments}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ bgcolor: "#fff8e1" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Late Payments
                  </Typography>
                  <Typography variant="h5">{creditHistory.credit_summary.late_payments}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ bgcolor: "#ffebee" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Missed Payments
                  </Typography>
                  <Typography variant="h5">{creditHistory.credit_summary.missed_payments}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Risk Assessment
          </Typography>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Risk Score:{" "}
                {creditHistory.credit_summary.risk_score ? (
                  <Box
                    component="span"
                    fontWeight="bold"
                    color={
                      creditHistory.credit_summary.risk_score > 70
                        ? "success.main"
                        : creditHistory.credit_summary.risk_score > 40
                          ? "warning.main"
                          : "error.main"
                    }
                  >
                    {creditHistory.credit_summary.risk_score.toFixed(1)}
                  </Box>
                ) : (
                  "N/A"
                )}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Data contributed by {creditHistory.contributing_mfis} MFIs
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last updated: {new Date(creditHistory.last_updated).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            MFI Contributions
          </Typography>
          <Grid container spacing={2}>
            {creditHistory.mfi_contributions.map((contribution, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {contribution.mfi_name}
                    </Typography>
                    <Typography variant="body2">Active Loans: {contribution.active_loans}</Typography>
                    <Typography variant="body2">
                      Payment History: {contribution.payment_history.on_time} on-time,
                      {contribution.payment_history.late} late,
                      {contribution.payment_history.missed} missed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DistributedCreditHistory
