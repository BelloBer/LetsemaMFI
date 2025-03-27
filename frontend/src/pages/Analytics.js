"use client"

import { useState } from "react"
import styled from "styled-components"
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaDownload,
  FaCalendarAlt,
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa"

const PageContainer = styled.div`
  padding: 90px 30px 30px;
  transition: margin-left 0.3s ease-in-out;
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const PageTitle = styled.h1`
  font-size: 28px;
  margin: 0;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`

const SecondaryButton = styled(Button)`
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);

  &:hover {
    background: var(--background);
  }
`

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`

const FilterSelect = styled.select`
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text);
  font-size: 14px;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: var(--primary-light);
  }
`

const DateRangeButton = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  gap: 8px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`

const StatCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`

const StatTitle = styled.h3`
  font-size: 16px;
  color: var(--text-light);
  margin: 0;
`

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => props.bgColor || "var(--primary-light)"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
`

const StatFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
`

const StatChange = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => (props.isPositive ? "var(--success)" : "var(--danger)")};
  margin-right: 8px;
`

const StatPeriod = styled.div`
  color: var(--text-light);
`

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const ChartCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const ChartTitle = styled.h3`
  font-size: 18px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`

const ChartContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
`

const PlaceholderText = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--text-light);
  font-style: italic;
`

const ReportsList = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`

const ReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }
`

const ReportInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const ReportTitle = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`

const ReportDescription = styled.div`
  font-size: 14px;
  color: var(--text-light);
`

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--primary);
  color: white;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }
`

const Analytics = () => {
  const [dateRange, setDateRange] = useState("This Month")
  const [mfi, setMfi] = useState("all")

  // Sample MFIs
  const mfis = [
    { id: "all", name: "All MFIs" },
    { id: "bfs", name: "Basotho Finance Solutions" },
    { id: "kl", name: "Khoebo Loans" },
    { id: "pl", name: "Potlako Loans Inc." },
  ]

  // Sample reports
  const reports = [
    {
      id: "rep-001",
      title: "Monthly Loan Performance Report",
      description: "Detailed analysis of loan disbursements, repayments, and defaults",
      format: "PDF",
    },
    {
      id: "rep-002",
      title: "Borrower Risk Assessment",
      description: "Analysis of borrower credit scores and risk profiles",
      format: "Excel",
    },
    {
      id: "rep-003",
      title: "MFI Comparison Report",
      description: "Comparative analysis of loan performance across all MFIs",
      format: "PDF",
    },
    {
      id: "rep-004",
      title: "Overdue Payments Report",
      description: "Detailed list of all overdue payments with aging analysis",
      format: "Excel",
    },
  ]

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Analytics & Reporting</PageTitle>
        <ActionButtons>
          <SecondaryButton>
            <FaFilter />
            Advanced Filters
          </SecondaryButton>
          <SecondaryButton>
            <FaDownload />
            Export Data
          </SecondaryButton>
        </ActionButtons>
      </PageHeader>

      <FilterContainer>
        <FilterSelect value={mfi} onChange={(e) => setMfi(e.target.value)}>
          {mfis.map((mfiOption) => (
            <option key={mfiOption.id} value={mfiOption.id}>
              {mfiOption.name}
            </option>
          ))}
        </FilterSelect>

        <DateRangeButton>
          <FaCalendarAlt />
          {dateRange}
        </DateRangeButton>
      </FilterContainer>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Loan Volume</StatTitle>
            <StatIcon bgColor="var(--primary)">
              <FaMoneyBillWave />
            </StatIcon>
          </StatHeader>
          <StatValue>M1.2M</StatValue>
          <StatFooter>
            <StatChange isPositive={true}>
              <FaChartLine style={{ marginRight: "4px" }} />
              15.3%
            </StatChange>
            <StatPeriod>vs last month</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Active Borrowers</StatTitle>
            <StatIcon bgColor="var(--secondary)">
              <FaUsers />
            </StatIcon>
          </StatHeader>
          <StatValue>842</StatValue>
          <StatFooter>
            <StatChange isPositive={true}>
              <FaChartLine style={{ marginRight: "4px" }} />
              8.2%
            </StatChange>
            <StatPeriod>vs last month</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Repayment Rate</StatTitle>
            <StatIcon bgColor="var(--success)">
              <FaCheckCircle />
            </StatIcon>
          </StatHeader>
          <StatValue>92%</StatValue>
          <StatFooter>
            <StatChange isPositive={true}>
              <FaChartLine style={{ marginRight: "4px" }} />
              2.5%
            </StatChange>
            <StatPeriod>vs last month</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Default Rate</StatTitle>
            <StatIcon bgColor="var(--danger)">
              <FaExclamationTriangle />
            </StatIcon>
          </StatHeader>
          <StatValue>3.8%</StatValue>
          <StatFooter>
            <StatChange isPositive={true}>
              <FaChartLine style={{ marginRight: "4px" }} />
              0.5%
            </StatChange>
            <StatPeriod>improvement</StatPeriod>
          </StatFooter>
        </StatCard>
      </StatsGrid>

      <ChartGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FaChartBar /> Loan Disbursements & Repayments
            </ChartTitle>
            <SecondaryButton>
              <FaFilter />
              Filter
            </SecondaryButton>
          </ChartHeader>
          <ChartContainer>
            <PlaceholderText>
              [Bar Chart: Monthly comparison of loan disbursements vs. repayments]
              <div style={{ marginTop: "10px", fontSize: "14px" }}>
                In a real implementation, this would be a chart showing loan disbursements and repayments over time.
              </div>
            </PlaceholderText>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FaChartPie /> Loan Status Distribution
            </ChartTitle>
          </ChartHeader>
          <ChartContainer>
            <PlaceholderText>
              [Pie Chart: Distribution of loans by status]
              <div style={{ marginTop: "10px", fontSize: "14px" }}>
                In a real implementation, this would be a pie chart showing the distribution of loans by status (active,
                paid, overdue, etc.).
              </div>
            </PlaceholderText>
          </ChartContainer>
        </ChartCard>
      </ChartGrid>

      <ChartCard style={{ marginBottom: "30px" }}>
        <ChartHeader>
          <ChartTitle>
            <FaChartLine /> Loan Performance Trends
          </ChartTitle>
          <SecondaryButton>
            <FaFilter />
            Filter
          </SecondaryButton>
        </ChartHeader>
        <ChartContainer>
          <PlaceholderText>
            [Line Chart: Trends in loan performance metrics over time]
            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              In a real implementation, this would be a line chart showing trends in key loan performance metrics over
              time.
            </div>
          </PlaceholderText>
        </ChartContainer>
      </ChartCard>

      <ReportsList>
        <ChartHeader>
          <ChartTitle>Available Reports</ChartTitle>
        </ChartHeader>

        {reports.map((report) => (
          <ReportItem key={report.id}>
            <ReportInfo>
              <ReportTitle>{report.title}</ReportTitle>
              <ReportDescription>{report.description}</ReportDescription>
            </ReportInfo>
            <DownloadButton>
              <FaDownload /> Download {report.format}
            </DownloadButton>
          </ReportItem>
        ))}
      </ReportsList>
    </PageContainer>
  )
}

export default Analytics

