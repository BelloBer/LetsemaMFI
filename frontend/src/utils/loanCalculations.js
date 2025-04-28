// src/utils/loanCalculations.js

export const calculateLoanDetails = (amount, interestRate, term) => {
  // Convert interest rate from percentage to decimal
  const annualInterestRate = interestRate / 100
  
  // Calculate total interest using simple interest formula: I = P * r * t
  // where P = principal, r = annual interest rate, t = time in years
  const totalInterest = amount * annualInterestRate * (term / 12)
  
  // Calculate total payment
  const totalPayment = amount + totalInterest
  
  // Calculate monthly payment
  const monthlyPayment = totalPayment / term
  
  // Generate payment schedule
  const paymentSchedule = []
  let remainingBalance = amount
  const principalPerMonth = amount / term
  const interestPerMonth = totalInterest / term
  
  for (let i = 1; i <= term; i++) {
    remainingBalance -= principalPerMonth
    
    paymentSchedule.push({
      paymentNumber: i,
      paymentDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000), // Approximate date
      paymentAmount: monthlyPayment,
      principalPayment: principalPerMonth,
      interestPayment: interestPerMonth,
      remainingBalance: Math.max(0, remainingBalance)
    })
  }
  
  return {
    monthlyPayment: monthlyPayment.toFixed(2),
    totalPayment: totalPayment.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    paymentSchedule
  }
}

