"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import axios from "../utils/axios"
import { Card, CardContent, CardHeader } from "@mui/material"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}))

const CreditHistory = () => {
  const { user } = useAuth()
  const [creditHistory, setCreditHistory] = useState(null)
  const [distributedHistory, setDistributedHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nationalId, setNationalId] = useState("")
  const [searchError, setSearchError] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    const fetchCreditHistory = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/analytics/credit-history/")
        setCreditHistory(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch credit history")
        setLoading(false)
      }
    }

    fetchCreditHistory()
  }, [])

  const handleSearch = async () => {
    if (!nationalId) {
      setSearchError("Please enter a National ID")
      return
    }

    try {
      setSearchLoading(true)
      setSearchError(null)
      const response = await axios.get(`/api/analytics/distributed-credit-history/?national_id=${nationalId}`)
      setDistributedHistory(response.data)
      setSearchLoading(false)
    } catch (err) {
      setSearchError(err.response?.data?.detail || "Failed to fetch distributed credit history")
      setSearchLoading(false)
    }
  }

  const handleUpdateDistributedHistory = async () => {
    if (!nationalId) {
      setSearchError("Please enter a National ID")
      return
    }

    try {
      setSearchLoading(true)
      setSearchError(null)
      const response = await axios.post("/api/analytics/update-distributed-credit-history/", {
        national_id: nationalId,
      })
      setDistributedHistory(response.data)
      setSearchLoading(false)
    } catch (err) {
      setSearchError(err.response?.data?.detail || "Failed to update distributed credit history")
      setSearchLoading(false)
    }
  }

  const renderCreditScore = (score) => {
    let color = "error"
    if (score >= 700) color = "success"
    else if (score >= 600) color = "primary"
    else if (score >= 500) color = "warning"

    return (
      <Chip
        label={score}
        color={color}
        size="large"
        sx={{ fontWeight: "bold", fontSize: "1.2rem", padding: "20px 10px" }}
      />
    )
  }

  const renderRiskFactors = (factors) => {
    if (!factors || factors.length === 0) return <Typography>No risk factors</Typography>

    return (
      <Box>
        {factors.map((factor, index) => (
          <Chip key={index} label={factor} color="error" variant="outlined" sx={{ margin: "2px" }} />
        ))}
      </Box>
    )
  }

  const renderMfiRecords = (records) => {
    if (!records || Object.keys(records).length === 0) return <Typography>No MFI records</Typography>

    return (
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>MFI Name</StyledTableCell>
              <StyledTableCell>Credit Score</StyledTableCell>
              <StyledTableCell>Total Loans</StyledTableCell>
              <StyledTableCell>Amount Borrowed</StyledTableCell>
              <StyledTableCell>Payment History</StyledTableCell>
              <StyledTableCell>Last Updated</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(records).map(([mfiId, record]) => (
              <TableRow key={mfiId}>
                <TableCell>{record.mfi_name}</TableCell>
                <TableCell>{record.credit_score}</TableCell>
                <TableCell>{record.total_loans}</TableCell>
                <TableCell>M{record.total_amount_borrowed.toFixed(2)}</TableCell>
                <TableCell>
                  <Typography variant="body2">On-time: {record.on_time_payments}</Typography>
                  <Typography variant="body2">Late: {record.late_payments}</Typography>
                  <Typography variant="body2">Defaulted: {record.defaulted_payments}</Typography>
                </TableCell>
                <TableCell>{new Date(record.last_updated).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Credit History
      </Typography>

      {user?.role !== "BORROWER" && (
        <Card sx={{ marginBottom: 4 }}>
          <CardHeader title="Distributed Credit History Search" />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
              <TextField
                label="National ID"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter borrower's National ID"
              />
              <Button variant="contained" onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? <CircularProgress size={24} /> : "Search"}
              </Button>
              <Button variant="outlined" onClick={handleUpdateDistributedHistory} disabled={searchLoading}>
                Update
              </Button>
            </Box>

            {searchError && (
              <Alert severity="error" sx={{ marginTop: 2 }}>
                {searchError}
              </Alert>
            )}

            {distributedHistory && (
              <Box sx={{ marginTop: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Distributed Credit Profile
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Aggregated Credit Score" />
                      <CardContent sx={{ display: "flex", justifyContent: "center" }}>
                        {renderCreditScore(distributedHistory.aggregated_credit_score)}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Loan Summary" />
                      <CardContent>
                        <Typography variant="body1">Total Loans: {distributedHistory.total_loans_count}</Typography>
                        <Typography variant="body1">
                          Total Borrowed: M{distributedHistory.total_amount_borrowed}
                        </Typography>
                        <Typography variant="body1">Total Repaid: M{distributedHistory.total_amount_repaid}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Payment Behavior" />
                      <CardContent>
                        <Typography variant="body1">On-time Payments: {distributedHistory.on_time_payments}</Typography>
                        <Typography variant="body1">Late Payments: {distributedHistory.late_payments}</Typography>
                        <Typography variant="body1">
                          Defaulted Payments: {distributedHistory.defaulted_payments}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Risk Factors" />
                      <CardContent>{renderRiskFactors(distributedHistory.risk_factors)}</CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Contributing MFIs" />
                      <CardContent>{renderMfiRecords(distributedHistory.mfi_records)}</CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader title={user?.role === "BORROWER" ? "Your Credit History" : "Borrower Credit History"} />
        <CardContent>
          {creditHistory && creditHistory.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Credit Score</StyledTableCell>
                    <StyledTableCell>Total Loans</StyledTableCell>
                    <StyledTableCell>Amount Borrowed</StyledTableCell>
                    <StyledTableCell>Amount Repaid</StyledTableCell>
                    <StyledTableCell>Payment History</StyledTableCell>
                    <StyledTableCell>Risk Factors</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {creditHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{new Date(history.date).toLocaleDateString()}</TableCell>
                      <TableCell>{history.credit_score}</TableCell>
                      <TableCell>{history.total_loans}</TableCell>
                      <TableCell>M{history.total_amount_borrowed}</TableCell>
                      <TableCell>M{history.total_amount_repaid}</TableCell>
                      <TableCell>
                        <Typography variant="body2">On-time: {history.on_time_payments}</Typography>
                        <Typography variant="body2">Late: {history.late_payments}</Typography>
                        <Typography variant="body2">Defaulted: {history.defaulted_payments}</Typography>
                      </TableCell>
                      <TableCell>{renderRiskFactors(history.risk_factors)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No credit history available</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CreditHistory
