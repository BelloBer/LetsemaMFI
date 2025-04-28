"use client"

import { useState, useEffect } from "react"
import axios from "../utils/axios"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"

const DistributedCreditHistory = ({ nationalId, borrowerId }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [creditHistory, setCreditHistory] = useState(null)

  useEffect(() => {
    const fetchDistributedCreditHistory = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = {}
        if (nationalId) {
          params.national_id = nationalId
        } else if (borrowerId) {
          params.borrower_id = borrowerId
        } else {
          throw new Error("Either nationalId or borrowerId is required")
        }

        const response = await axios.get("/api/analytics/distributed-credit-history/", { params })
        setCreditHistory(response.data)
      } catch (err) {
        console.error("Error fetching distributed credit history:", err)
        setError(err.response?.data?.detail || err.message || "Failed to fetch distributed credit history")
      } finally {
        setLoading(false)
      }
    }

    if (nationalId || borrowerId) {
      fetchDistributedCreditHistory()
    }
  }, [nationalId, borrowerId])

  const handleUpdateHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      const payload = {}
      if (nationalId) {
        payload.national_id = nationalId
      } else if (borrowerId) {
        payload.borrower_id = borrowerId
      }

      const response = await axios.post("/api/analytics/update-distributed-credit-history/", payload)
      setCreditHistory(response.data)
    } catch (err) {
      console.error("Error updating distributed credit history:", err)
      setError(err.response?.data?.detail || err.message || "Failed to update distributed credit history")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleUpdateHistory}>
            Create/Update Credit History
          </Button>
        </Box>
      </Box>
    )
  }

  if (!creditHistory) {
    return (
      <Box>
        <Alert severity="info">No distributed credit history found for this borrower.</Alert>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleUpdateHistory}>
            Create Credit History
          </Button>
        </Box>
      </Box>
    )
  }

  // Define columns for MFI records table
  const mfiColumns = [
    { field: "mfi_name", headerName: "MFI", flex: 1 },
    { field: "credit_score", headerName: "Credit Score", width: 120 },
    { field: "total_loans", headerName: "Total Loans", width: 120 },
    {
      field: "total_amount_borrowed",
      headerName: "Amount Borrowed",
      width: 150,
      valueFormatter: (params) => `M${params.value.toFixed(2)}`,
    },
    { field: "on_time_payments", headerName: "On-time Payments", width: 150 },
    { field: "late_payments", headerName: "Late Payments", width: 120 },
    { field: "defaulted_payments", headerName: "Defaults", width: 120 },
    {
      field: "last_updated",
      headerName: "Last Updated",
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
  ]

  // Transform MFI records for DataGrid
  const mfiRecords = Object.entries(creditHistory.mfi_records || {}).map(([mfi_id, record]) => ({
    id: mfi_id,
    mfi_id,
    ...record,
  }))

  return (
    <Card>
      <CardHeader
        title="Distributed Credit History"
        subheader={`National ID: ${creditHistory.national_id} | Location: ${creditHistory.location}`}
        action={
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={`Credit Score: ${creditHistory.aggregated_credit_score}`}
              color={
                creditHistory.aggregated_credit_score > 700
                  ? "success"
                  : creditHistory.aggregated_credit_score > 500
                    ? "warning"
                    : "error"
              }
            />
            <Button variant="outlined" size="small" onClick={handleUpdateHistory}>
              Update
            </Button>
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Loan Summary</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Total Loans:</strong> {creditHistory.total_loans_count}
              </Typography>
              <Typography variant="body2">
                <strong>Total Borrowed:</strong> M{creditHistory.total_amount_borrowed.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                <strong>Total Repaid:</strong> M{creditHistory.total_amount_repaid.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                <strong>Repayment Rate:</strong>{" "}
                {creditHistory.total_amount_borrowed > 0
                  ? ((creditHistory.total_amount_repaid / creditHistory.total_amount_borrowed) * 100).toFixed(2)
                  : 0}
                %
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Payment Behavior</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>On-time Payments:</strong> {creditHistory.on_time_payments}
              </Typography>
              <Typography variant="body2">
                <strong>Late Payments:</strong> {creditHistory.late_payments}
              </Typography>
              <Typography variant="body2">
                <strong>Defaulted Payments:</strong> {creditHistory.defaulted_payments}
              </Typography>
              <Typography variant="body2">
                <strong>Total Payments:</strong>{" "}
                {creditHistory.on_time_payments + creditHistory.late_payments + creditHistory.defaulted_payments}
              </Typography>
            </Box>
          </Grid>

          {creditHistory.risk_factors && creditHistory.risk_factors.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1">Risk Factors</Typography>
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {creditHistory.risk_factors.map((factor, index) => (
                  <Chip key={index} label={factor} color="error" size="small" />
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1">Contributing MFIs</Typography>
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {creditHistory.contributing_mfis.map((mfi, index) => (
                <Chip key={index} label={mfi.mfi_name} color="primary" size="small" />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">MFI Records</Typography>
            <Box sx={{ height: 400, width: "100%", mt: 2 }}>
              <DataGrid
                rows={mfiRecords}
                columns={mfiColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DistributedCreditHistory
