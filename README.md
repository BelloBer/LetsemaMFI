# DDBS_Letsema
DB_six's Letsema Loans distributed database systems project

# Letsema: Distributed Microfinance Loan Management System

## Overview

Letsema is a distributed, containerized microfinance loan management system designed to enable multiple Microfinance Institutions (MFIs) in Lesotho to collaborate efficiently. The system facilitates secure loan application processing, borrower credit history sharing, and real-time loan status updates. By addressing the challenges of loan stacking, high defaults, and inefficiencies in loan processing, Letsema aims to improve transparency, optimize loan approvals, and ensure fair access to credit for underserved communities.

This project is built using a modern technology stack, including Django for the backend, React.js for the frontend, and a hybrid database approach (PostgreSQL and MongoDB) for structured and distributed data management. The system is designed to be highly available, scalable, and fault-tolerant, ensuring seamless financial operations.

---

## Key Features

1. **Borrower Management**: Secure registration and identity verification for borrowers.
2. **Loan Application & Approval**: Online loan applications with creditworthiness assessments by loan officers.
3. **Credit History Repository**: A distributed database for sharing borrower credit history across MFIs.
4. **Loan Repayment & Tracking**: Automated payment tracking and status updates.
5. **Reporting & Analytics**: Comprehensive loan performance reports and borrower risk assessments.
6. **System Security & Access Control**: Role-based access to ensure data confidentiality and integrity.
7. **Scalability & Fault Tolerance**: Distributed architecture to handle system failures and performance bottlenecks.

---

## Technology Stack

### Backend
- **Framework**: Django (Python)
- **API Development**: Django REST Framework
- **Authentication**: OAuth2.0 

### Frontend
- **Framework**: React.js
- **State Management**: Redux or Context API
- **Styling**: Material-UI or TailwindCSS

### Database
- **Relational Database**: PostgreSQL (for structured loan records and financial transactions)
- **NoSQL Database**: MongoDB (for distributed borrower credit history)

### Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose (for local development) / Kubernetes (for production)
- **CI/CD**: GitHub Actions

### Version Control
- **Repository**: GitHub
- **Collaboration**: Git branching strategy 

### Other Tools
- **Task Management**: JIRA
- **API Documentation**: Swagger/OpenAPI

---

## Development Approach

The project follows an **Agile Development Methodology** with iterative sprints for incremental feature delivery. Key milestones include:

1. **Sprint 1**: Borrower registration and identity verification.
2. **Sprint 2**: Loan application and approval workflows.
3. **Sprint 3**: Distributed credit history repository setup.
4. **Sprint 4**: Loan repayment tracking and reporting.
5. **Sprint 5**: System security and access control implementation.
6. **Sprint 6**: Scalability and performance testing.

---

## Project Deliverables

1. **Functional Prototype**: Includes borrower registration, loan application, and approval workflows.
2. **Distributed Database Schema & Replication Strategy**: Document detailing the database architecture.
3. **API Documentation**: Comprehensive guide for system integration.
4. **Scalability & Performance Testing Report**: Analysis of system performance under load.
5. **Final System Demonstration & Evaluation**: Live demo and evaluation of the complete system.
6. **Source Code Repository**: GitHub repository with CI/CD pipelines for automated testing and deployment.

---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Docker
- PostgreSQL
- MongoDB

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/BelloBer/DDBS_Letsema.git
   cd ddbs_letsema
   ```

2. **Set Up Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Set Up Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Run with Docker**:
   ```bash
   docker-compose up --build
   ```

---

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

--

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any questions or inquiries, please reach out to:
- **Tebello Bernice**: [tebellolenyatsabernice@gmail.com](mailto:tebellolenyatsabernice@gmail.com)
- **Project Repository**: [Letsema on GitHub](https://github.com/BelloBer/DDBS_Letsema)

  
