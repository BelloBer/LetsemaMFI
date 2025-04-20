import { Routes, Route } from "react-router-dom"
import BorrowerDashboard from "./BorrowerDashboard"
import LoanApplicationForm from "./LoanApplicationForm"
import BorrowerProfile from "./BorrowerProfile"
import LoanDetails from "./LoanDetails"
import BorrowerLayout from "./BorrowerLayout"

const BorrowerRoutes = () => {
  return (
    <Routes>
      <Route element={<BorrowerLayout />}>
        <Route path="/" element={<BorrowerDashboard />} />
        <Route path="/dashboard" element={<BorrowerDashboard />} />
        <Route path="/apply" element={<LoanApplicationForm />} />
        <Route path="/profile" element={<BorrowerProfile />} />
        <Route path="/loans/:loanId" element={<LoanDetails />} />
      </Route>
    </Routes>
  )
}

export default BorrowerRoutes
