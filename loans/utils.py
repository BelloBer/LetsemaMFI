from decimal import Decimal

def calculateLoanDetails(amount, interestRate, term):
    """
    Calculate loan details using simple interest.
    
    Args:
        amount (float): Principal loan amount
        interestRate (float): Annual interest rate as a percentage
        term (int): Loan term in months
    
    Returns:
        dict: Dictionary containing loan calculations
    """
    # Convert interest rate from percentage to decimal
    annualInterestRate = Decimal(str(interestRate)) / Decimal('100')
    
    # Calculate total interest using simple interest formula: I = P * r * t
    # where P = principal, r = annual interest rate, t = time in years
    totalInterest = Decimal(str(amount)) * annualInterestRate * (Decimal(str(term)) / Decimal('12'))
    
    # Calculate total payment
    totalPayment = Decimal(str(amount)) + totalInterest
    
    # Calculate monthly payment
    monthlyPayment = totalPayment / Decimal(str(term))
    
    # Generate payment schedule
    paymentSchedule = []
    remainingBalance = Decimal(str(amount))
    principalPerMonth = Decimal(str(amount)) / Decimal(str(term))
    interestPerMonth = totalInterest / Decimal(str(term))
    
    for i in range(1, term + 1):
        remainingBalance -= principalPerMonth
        
        paymentSchedule.append({
            'paymentNumber': i,
            'paymentDate': None,  # Will be set by the serializer
            'paymentAmount': float(monthlyPayment),
            'principalPayment': float(principalPerMonth),
            'interestPayment': float(interestPerMonth),
            'remainingBalance': float(max(Decimal('0'), remainingBalance))
        })
    
    return {
        'monthlyPayment': float(monthlyPayment),
        'totalPayment': float(totalPayment),
        'totalInterest': float(totalInterest),
        'paymentSchedule': paymentSchedule
    } 