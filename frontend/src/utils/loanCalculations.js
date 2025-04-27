// src/utils/loanCalculations.js

export const calculateLoanDetails = (amount, interestRate, term) => {
  // Convert interest rate from percentage to decimal
  const monthlyInterestRate = interestRate / 100 / 12
  
  // Calculate monthly payment using the loan amortization formula
  const monthlyPayment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term)) / 
    (Math.pow(1 + monthlyInterestRate, term) - 1)
  
  // Calculate total payment
  const totalPayment = monthlyPayment * term
  
  // Calculate total interest
  const totalInterest = totalPayment - amount
  
  // Generate payment schedule
  const paymentSchedule = []
  let remainingBalance = amount
  
  for (let i = 1; i <= term; i++) {
    const interestPayment = remainingBalance * monthlyInterestRate
    const principalPayment = monthlyPayment - interestPayment
    remainingBalance -= principalPayment
    
    paymentSchedule.push({
      paymentNumber: i,
      paymentDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000), // Approximate date
      paymentAmount: monthlyPayment,
      principalPayment,
      interestPayment,
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