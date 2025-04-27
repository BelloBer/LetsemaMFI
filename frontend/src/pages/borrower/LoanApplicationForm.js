


// "use client"

// import { useState, useEffect } from "react"
// import { useAuth } from "../../context/AuthContext"
// import styled from "styled-components"
// import { FaArrowLeft, FaCheck } from "react-icons/fa"
// import { useNavigate } from "react-router-dom"




// const ApplicationContainer = styled.div`
//   background: var(--card-bg);
//   border-radius: 12px;
//   padding: 30px;
//   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   max-width: 800px;
//   margin: 0 auto;
// `


// const ApplicationHeader = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 30px;
// `

// const BackButton = styled.button`
//   background: transparent;
//   border: none;
//   color: var(--text);
//   font-size: 20px;
//   cursor: pointer;
//   margin-right: 15px;
  
//   &:hover {
//     color: var(--primary);
//   }
// `

// const ApplicationTitle = styled.h2`
//   font-size: 24px;
//   margin: 0;
// `

// const FormSection = styled.div`
//   margin-bottom: 30px;
// `

// const SectionTitle = styled.h3`
//   font-size: 18px;
//   margin-bottom: 20px;
//   color: var(--text);
//   display: flex;
//   align-items: center;
  
//   &::after {
//     content: '';
//     flex: 1;
//     height: 1px;
//     background: var(--border);
//     margin-left: 15px;
//   }
// `

// const FormRow = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 20px;
//   margin-bottom: 20px;
// `

// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
// `

// const Label = styled.label`
//   font-size: 14px;
//   margin-bottom: 8px;
//   color: var(--text);
//   font-weight: 500;
// `

// const Input = styled.input`
//   padding: 12px 15px;
//   border-radius: 8px;
//   border: 1px solid var(--border);
//   background: var(--background);
//   color: var(--text);
//   font-size: 14px;
  
//   &:focus {
//     outline: none;
//     border-color: var(--primary-light);
//     box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
//   }
// `

// const Select = styled.select`
//   padding: 12px 15px;
//   border-radius: 8px;
//   border: 1px solid var(--border);
//   background: var(--background);
//   color: var(--text);
//   font-size: 14px;
  
//   &:focus {
//     outline: none;
//     border-color: var(--primary-light);
//     box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
//   }
// `

// const Textarea = styled.textarea`
//   padding: 12px 15px;
//   border-radius: 8px;
//   border: 1px solid var(--border);
//   background: var(--background);
//   color: var(--text);
//   font-size: 14px;
//   min-height: 100px;
//   resize: vertical;
  
//   &:focus {
//     outline: none;
//     border-color: var(--primary-light);
//     box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
//   }
// `

// const ButtonGroup = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-top: 30px;
// `

// const Button = styled.button`
//   padding: 12px 24px;
//   border-radius: 8px;
//   font-size: 16px;
//   font-weight: 500;
//   cursor: pointer;
//   transition: all 0.2s ease;
  
//   &:hover {
//     opacity: 0.9;
//   }
// `

// const PrimaryButton = styled(Button)`
//   background: var(--primary);
//   color: white;
//   border: none;
// `

// const SecondaryButton = styled(Button)`
//   background: transparent;
//   color: var(--text);
//   border: 1px solid var(--border);
  
//   &:hover {
//     background: var(--background);
//   }
// `

// const StepIndicator = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-bottom: 30px;
// `

// const Step = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   width: 120px;
//   position: relative;
  
//   &:not(:last-child)::after {
//     content: '';
//     position: absolute;
//     top: 15px;
//     right: -50%;
//     width: 100%;
//     height: 2px;
//     background: ${(props) => (props.active || props.completed ? "var(--primary)" : "var(--border)")};
//     z-index: 0;
//   }
// `

// const StepCircle = styled.div`
//   width: 30px;
//   height: 30px;
//   border-radius: 50%;
//   background: ${(props) => (props.completed ? "var(--success)" : props.active ? "var(--primary)" : "var(--background)")};
//   border: 2px solid ${(props) => (props.completed ? "var(--success)" : props.active ? "var(--primary)" : "var(--border)")};
//   color: ${(props) => (props.completed || props.active ? "white" : "var(--text-light)")};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 14px;
//   font-weight: 600;
//   margin-bottom: 8px;
//   z-index: 1;
// `

// const StepLabel = styled.div`
//   font-size: 12px;
//   color: ${(props) => (props.active ? "var(--primary)" : "var(--text-light)")};
//   font-weight: ${(props) => (props.active ? "600" : "400")};
// `



// const LoanApplicationForm = () => {
//   const { user, api } = useAuth() // Get authenticated user and API instance
//   const [currentStep, setCurrentStep] = useState(1)
//   const [mfis, setMfis] = useState([])
//   const [loadingMFIs, setLoadingMFIs] = useState(true)
//   const totalSteps = 2 // Reduced to 2 steps since user info is already available
//   const [formData, setFormData] = useState({
//     amount: "",
//     term: "",
//     purpose: "",
//     additional_notes: "",
//     mfi_id: ""
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()

//   // Add useEffect to fetch MFIs when component mounts
//   // Fetch MFIs when component mounts
//   useEffect(() => {
//     const fetchMFIs = async () => {
//       setLoadingMFIs(true);
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/mfis/active/`, {
//           headers: {
//             'Authorization': `Bearer ${user.access}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch MFIs');
//         }

//         const data = await response.json();
//         setMfis(data);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching MFIs:', err);
//         setError('Failed to load MFIs. Please refresh the page or try again later.');
//       } finally {
//         setLoadingMFIs(false);
//       }
//     };

//     fetchMFIs();
//   }, [user.access]);

//   // Render MFI selection with loading state
//   const renderMFISelection = () => (
//     <FormGroup>
//       <Label>Select Microfinance Institution</Label>
//       {loadingMFIs ? (
//         <div>Loading MFIs...</div>
//       ) : (
//         <Select
//           name="mfi_id"
//           value={formData.mfi_id}
//           onChange={handleInputChange}
//           required
//           disabled={loadingMFIs}
//         >
//           <option value="">Select an MFI</option>
//           {mfis.map(mfi => (
//             <option key={mfi.mfi_id} value={mfi.mfi_id}>
//               {mfi.name} - {mfi.location}
//             </option>
//           ))}
//         </Select>
//       )}
//     </FormGroup>
//   );

//     // Display any errors at the top of the form
//   const renderError = () => error && (
//     <div style={{
//       color: 'red',
//       backgroundColor: 'rgba(255, 0, 0, 0.1)',
//       padding: '10px',
//       borderRadius: '4px',
//       marginBottom: '20px'
//     }}>
//       {error}
//     </div>
//   );


//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setError(null);

//     // Validate form data
//     if (!formData.amount || !formData.term || !formData.purpose || !formData.mfi_id) {
//       setError('Please fill in all required fields');
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const response = await api.post('/api/loans/apply/', {
//         amount: parseFloat(formData.amount),
//         term: parseInt(formData.term),
//         purpose: formData.purpose.toUpperCase(),
//         additional_notes: formData.additional_notes || '',
//         mfi_id: formData.mfi_id
//       });

//       if (response.data) {
//         alert('Loan application submitted successfully!');
//         navigate('/borrower/dashboard', {
//           state: { 
//             success: true, 
//             message: 'Loan application submitted successfully!',
//             loanId: response.data.loan_id 
//           }
//         });
//       }
//     } catch (err) {
//       console.error('Error submitting loan application:', err);
//       setError(err.response?.data?.detail || 'Failed to submit loan application');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   // const handleSubmit = async () => {
//   //   setIsSubmitting(true)
//   //   setError(null)

//   //   try {
//   //     const response = await api.post('/api/loans/apply/', {
//   //       amount: parseFloat(formData.amount),
//   //       term: parseInt(formData.term),
//   //       purpose: formData.purpose,
//   //       additional_notes: formData.additional_notes
//   //     })

//   //     // Handle successful submission
//   //     alert('Loan application submitted successfully!')
//   //     // You might want to redirect to a confirmation page or loans list
//   //   } catch (err) {
//   //     setError(err.response?.data?.detail || 'Failed to submit loan application')
//   //   } finally {
//   //     setIsSubmitting(false)
//   //   }
//   // }

//   const nextStep = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1)
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   return (
//     <ApplicationContainer>
//       <ApplicationHeader>
//         <BackButton onClick={() => navigate('/borrower/dashboard')}>
//           <FaArrowLeft />
//         </BackButton>
//         <ApplicationTitle>New Loan Application</ApplicationTitle>
//       </ApplicationHeader>

      

//       <StepIndicator>
//         <Step active={currentStep === 1} completed={currentStep > 1}>
//           <StepCircle active={currentStep === 1} completed={currentStep > 1}>
//             {currentStep > 1 ? <FaCheck /> : 1}
//           </StepCircle>
//           <StepLabel active={currentStep === 1}>Loan Details</StepLabel>
//         </Step>
//         <Step active={currentStep === 2}>
//           <StepCircle active={currentStep === 2}>2</StepCircle>
//           <StepLabel active={currentStep === 2}>Review & Submit</StepLabel>
//         </Step>
//       </StepIndicator>

//       {error && (
//         <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
//           {error}
//         </div>
//       )}

//       {currentStep === 1 && (
//         <FormSection>
//           <SectionTitle>Loan Details</SectionTitle>
//           {renderMFISelection()}
//           <FormRow>
//             <FormGroup>
//               <Label>Loan Amount (M)</Label>
//               <Input
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleInputChange}
//                 placeholder="Enter amount"
//                 required
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label>Loan Term (Months)</Label>
//               <Select
//                 name="term"
//                 value={formData.term}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select loan term</option>
//                 <option value="3">3 months</option>
//                 <option value="6">6 months</option>
//                 <option value="12">12 months</option>
//                 <option value="24">24 months</option>
//                 <option value="36">36 months</option>
//                 <option value="48">48 months</option>
//                 <option value="60">60 months</option>
//               </Select>
//             </FormGroup>
//           </FormRow>
//           <FormRow>
//             <FormGroup>
//               <Label>Purpose of Loan</Label>
//               <Select
//                 name="purpose"
//                 value={formData.purpose}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select purpose</option>
//                 <option value="personal">Personal</option>
//                 <option value="business">Business</option>
//                 <option value="education">Education</option>
//                 <option value="medical">Medical</option>
//                 <option value="other">Other</option>
//               </Select>
//             </FormGroup>
//           </FormRow>
//           <FormRow>
//             <FormGroup>
//               <Label>Additional Notes</Label>
//               <Textarea
//                 name="additional_notes"
//                 value={formData.additional_notes}
//                 onChange={handleInputChange}
//                 placeholder="Enter any additional information"
//               />
//             </FormGroup>
//           </FormRow>
//         </FormSection>
//       )}

//       {currentStep === 2 && (
//         <FormSection>
//           <SectionTitle>Review & Submit</SectionTitle>
//           <div className="review-summary">
//             <p>Please review all information before submitting the loan application.</p>
//             <div className="card" style={{ marginTop: "20px", padding: "20px" }}>
//               <h4>Borrower Information</h4>
//               <p>{user.full_name}</p>
//               <p>{user.email}</p>
//               <p>{user.phone}</p>

//               <h4 style={{ marginTop: "20px" }}>Loan Details</h4>
//               <p>Amount: M{formData.amount}</p>
//               <p>Term: {formData.term} months</p>
//               <p>Purpose: {formData.purpose}</p>
//               {formData.additional_notes && (
//                 <>
//                   <h4 style={{ marginTop: "20px" }}>Additional Notes</h4>
//                   <p>{formData.additional_notes}</p>
//                 </>
//               )}
//             </div>
//           </div>
//         </FormSection>
//       )}

//       <ButtonGroup>
//         {currentStep > 1 && <SecondaryButton onClick={prevStep}>Back</SecondaryButton>}
//         {currentStep < totalSteps ? (
//           <PrimaryButton onClick={nextStep} style={{ marginLeft: "auto" }}>
//             Continue
//           </PrimaryButton>
//         ) : (
//           <PrimaryButton 
//             onClick={handleSubmit} 
//             style={{ marginLeft: "auto" }}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? 'Submitting...' : 'Submit Application'}
//           </PrimaryButton>
//         )}
//       </ButtonGroup>
//     </ApplicationContainer>
//   )
// }

// export default LoanApplicationForm



"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import { FaArrowLeft, FaCheck } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
// Import the API utility
import { loanApi, mfiApi } from "../../utils/api"

const ApplicationContainer = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`

const ApplicationHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
  
  &:hover {
    color: var(--primary);
  }
`

const ApplicationTitle = styled.h2`
  font-size: 24px;
  margin: 0;
`

const FormSection = styled.div`
  margin-bottom: 30px;
`

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--text);
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
    margin-left: 15px;
  }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text);
  font-weight: 500;
`

const Input = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text);
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-light);
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
  }
`

const Select = styled.select`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text);
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-light);
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
  }
`

const Textarea = styled.textarea`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text);
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-light);
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`

const PrimaryButton = styled(Button)`
  background: var(--primary);
  color: white;
  border: none;
`

const SecondaryButton = styled(Button)`
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  
  &:hover {
    background: var(--background);
  }
`

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 15px;
    right: -50%;
    width: 100%;
    height: 2px;
    background: ${(props) => (props.active || props.completed ? "var(--primary)" : "var(--border)")};
    z-index: 0;
  }
`

const StepCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) => (props.completed ? "var(--success)" : props.active ? "var(--primary)" : "var(--background)")};
  border: 2px solid ${(props) => (props.completed ? "var(--success)" : props.active ? "var(--primary)" : "var(--border)")};
  color: ${(props) => (props.completed || props.active ? "white" : "var(--text-light)")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  z-index: 1;
`

const StepLabel = styled.div`
  font-size: 12px;
  color: ${(props) => (props.active ? "var(--primary)" : "var(--text-light)")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
`

const LoanApplicationForm = () => {
  const { user, api } = useAuth() // Get authenticated user and API instance
  const [currentStep, setCurrentStep] = useState(1)
  const [mfis, setMfis] = useState([])
  const [loadingMFIs, setLoadingMFIs] = useState(true)
  const totalSteps = 2 // Reduced to 2 steps since user info is already available
  const [formData, setFormData] = useState({
    amount: "",
    term: "",
    purpose: "",
    additional_notes: "",
    mfi_id: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Add useEffect to fetch MFIs when component mounts
  // Fetch MFIs when component mounts
  useEffect(() => {
    const fetchMFIs = async () => {
      setLoadingMFIs(true)
      try {
        const data = await mfiApi.getActiveMFIs(user.access)
        console.log("Fetched MFIs:", data)
        setMfis(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching MFIs:", err)
        setError("Failed to load MFIs. Please refresh the page or try again later.")

        // Provide some mock data for testing if the API fails
        setMfis([
          { mfi_id: "550e8400-e29b-41d4-a716-446655440000", name: "Basotho Finance Solutions", location: "Maseru" },
          { mfi_id: "550e8400-e29b-41d4-a716-446655440001", name: "Khoebo Loans", location: "Leribe" },
          { mfi_id: "550e8400-e29b-41d4-a716-446655440002", name: "Potlako Loans Inc.", location: "Mafeteng" },
        ])
      } finally {
        setLoadingMFIs(false)
      }
    }

    fetchMFIs()
  }, [user.access])

  // Render MFI selection with loading state
  const renderMFISelection = () => (
    <FormGroup>
      <Label>Select Microfinance Institution</Label>
      {loadingMFIs ? (
        <div>Loading MFIs...</div>
      ) : (
        <Select name="mfi_id" value={formData.mfi_id} onChange={handleInputChange} required disabled={loadingMFIs}>
          <option value="">Select an MFI</option>
          {mfis.map((mfi) => (
            <option key={mfi.mfi_id} value={mfi.mfi_id}>
              {mfi.name} - {mfi.location}
            </option>
          ))}
        </Select>
      )}
    </FormGroup>
  )

  // Display any errors at the top of the form
  const renderError = () =>
    error && (
      <div
        style={{
          color: "red",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        {error}
      </div>
    )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Update the handleSubmit function to use the API utility
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    // Validate form data
    if (!formData.amount || !formData.term || !formData.purpose || !formData.mfi_id) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      // Create the request payload
      const payload = {
        amount: Number.parseFloat(formData.amount),
        term: Number.parseInt(formData.term),
        purpose: formData.purpose.toUpperCase(),
        additional_notes: formData.additional_notes || "",
        mfi_id: formData.mfi_id,
      }

      console.log("Submitting loan application:", payload)

      // Use the API utility to submit the loan application
      const response = await loanApi.applyForLoan(user.access, payload)

      // Handle successful submission
      console.log("Loan application submitted successfully:", response)

      navigate("/borrower/dashboard", {
        state: {
          success: true,
          message: "Loan application submitted successfully!",
          loanId: response.loan_id,
        },
      })
    } catch (err) {
      console.error("Error submitting loan application:", err)
      setError(err.message || "Failed to submit loan application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <ApplicationContainer>
      <ApplicationHeader>
        <BackButton onClick={() => navigate("/borrower/dashboard")}>
          <FaArrowLeft />
        </BackButton>
        <ApplicationTitle>New Loan Application</ApplicationTitle>
      </ApplicationHeader>

      <StepIndicator>
        <Step active={currentStep === 1} completed={currentStep > 1}>
          <StepCircle active={currentStep === 1} completed={currentStep > 1}>
            {currentStep > 1 ? <FaCheck /> : 1}
          </StepCircle>
          <StepLabel active={currentStep === 1}>Loan Details</StepLabel>
        </Step>
        <Step active={currentStep === 2}>
          <StepCircle active={currentStep === 2}>2</StepCircle>
          <StepLabel active={currentStep === 2}>Review & Submit</StepLabel>
        </Step>
      </StepIndicator>

      {error && <div style={{ color: "red", marginBottom: "20px", textAlign: "center" }}>{error}</div>}

      {currentStep === 1 && (
        <FormSection>
          <SectionTitle>Loan Details</SectionTitle>
          {renderMFISelection()}
          <FormRow>
            <FormGroup>
              <Label>Loan Amount (M)</Label>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Loan Term (Months)</Label>
              <Select name="term" value={formData.term} onChange={handleInputChange} required>
                <option value="">Select loan term</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
              </Select>
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Purpose of Loan</Label>
              <Select name="purpose" value={formData.purpose} onChange={handleInputChange} required>
                <option value="">Select purpose</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="medical">Medical</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Additional Notes</Label>
              <Textarea
                name="additional_notes"
                value={formData.additional_notes}
                onChange={handleInputChange}
                placeholder="Enter any additional information"
              />
            </FormGroup>
          </FormRow>
        </FormSection>
      )}

      {currentStep === 2 && (
        <FormSection>
          <SectionTitle>Review & Submit</SectionTitle>
          <div className="review-summary">
            <p>Please review all information before submitting the loan application.</p>
            <div className="card" style={{ marginTop: "20px", padding: "20px" }}>
              <h4>Borrower Information</h4>
              <p>{user.full_name}</p>
              <p>{user.email}</p>
              <p>{user.phone}</p>

              <h4 style={{ marginTop: "20px" }}>Loan Details</h4>
              <p>Amount: M{formData.amount}</p>
              <p>Term: {formData.term} months</p>
              <p>Purpose: {formData.purpose}</p>
              {formData.additional_notes && (
                <>
                  <h4 style={{ marginTop: "20px" }}>Additional Notes</h4>
                  <p>{formData.additional_notes}</p>
                </>
              )}
            </div>
          </div>
        </FormSection>
      )}

      <ButtonGroup>
        {currentStep > 1 && <SecondaryButton onClick={prevStep}>Back</SecondaryButton>}
        {currentStep < totalSteps ? (
          <PrimaryButton onClick={nextStep} style={{ marginLeft: "auto" }}>
            Continue
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={handleSubmit} style={{ marginLeft: "auto" }} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </PrimaryButton>
        )}
      </ButtonGroup>
    </ApplicationContainer>
  )
}

export default LoanApplicationForm
