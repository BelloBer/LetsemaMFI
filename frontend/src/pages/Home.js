import { Link } from "react-router-dom"
import styled from "styled-components"
import { FaChartLine, FaUsers, FaMoneyBillWave, FaShieldAlt, FaArrowRight } from "react-icons/fa"

const HomeContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
  color: var(--text);
`

const Header = styled.header`
  background: var(--card-bg);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
`

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--text);

  span {
    color: var(--primary);
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled.a`
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }
`

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
`

const LoginButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--primary);
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(6, 182, 212, 0.1);
  }
`

const RegisterButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }
`

const HeroSection = styled.section`
  padding: 160px 20px 80px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
    padding: 140px 20px 60px;
  }
`

const HeroContent = styled.div`
  flex: 1;
`

const HeroTitle = styled.h1`
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--text);

  span {
    color: var(--primary);
  }

  @media (max-width: 768px) {
    font-size: 36px;
  }
`

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: var(--text-light);
  margin-bottom: 30px;
  max-width: 600px;

  @media (max-width: 992px) {
    margin: 0 auto 30px;
  }
`

const HeroButtons = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 992px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`

const FeaturesSection = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
`

const SectionTitle = styled.h2`
  font-size: 36px;
  text-align: center;
  margin-bottom: 60px;
  color: var(--text);

  span {
    color: var(--primary);
  }
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`

const FeatureCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${(props) => props.bgColor || "var(--primary-light)"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
`

const FeatureTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--text);
`

const FeatureDescription = styled.p`
  color: var(--text-light);
  line-height: 1.6;
`

const CTASection = styled.section`
  padding: 80px 20px;
  background: var(--primary);
  color: white;
  text-align: center;
`

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const CTATitle = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
`

const CTADescription = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  opacity: 0.9;
`

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 8px;
  background: white;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-3px);
  }
`

const TestimonialsSection = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
`

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`

const TestimonialCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`

const TestimonialText = styled.p`
  color: var(--text);
  font-style: italic;
  margin-bottom: 20px;
  line-height: 1.6;
`

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const AuthorName = styled.div`
  font-weight: 600;
  color: var(--text);
`

const AuthorRole = styled.div`
  font-size: 14px;
  color: var(--text-light);
`

const Footer = styled.footer`
  background: var(--sidebar);
  color: white;
  padding: 60px 20px 30px;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
`

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const FooterLogo = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;

  span {
    color: var(--primary-light);
  }
`

const FooterDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 20px;
`

const FooterTitle = styled.h4`
  font-size: 18px;
  margin-bottom: 20px;
  color: white;
`

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-light);
  }
`

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 40px auto 0;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`

const HomePage = () => {
  return (
    <HomeContainer>
      <Header>
        <HeaderContent>
          <Logo>
            Letsema<span>.</span>
          </Logo>
          <NavLinks>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </NavLinks>
          <AuthButtons>
            <LoginButton to="/login">Login</LoginButton>
            <RegisterButton to="/register">Register</RegisterButton>
          </AuthButtons>
        </HeaderContent>
      </Header>

      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Simplify Your <span>Loan Management</span> Process
          </HeroTitle>
          <HeroSubtitle>
            Letsema provides a comprehensive solution for managing loans, borrowers, and payments all in one place.
            Streamline your operations and boost efficiency.
          </HeroSubtitle>
          <HeroButtons>
            <RegisterButton to="/register">Get Started</RegisterButton>
            <LoginButton to="/login">Learn More</LoginButton>
          </HeroButtons>
        </HeroContent>
        <HeroImage>
          <Image src="/placeholder.svg?height=400&width=500" alt="Loan Management Dashboard" />
        </HeroImage>
      </HeroSection>

      <FeaturesSection id="features">
        <SectionTitle>
          Powerful <span>Features</span> for Your Business
        </SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon bgColor="var(--primary)">
              <FaChartLine />
            </FeatureIcon>
            <FeatureTitle>Comprehensive Dashboard</FeatureTitle>
            <FeatureDescription>
              Get a complete overview of your loan portfolio with real-time analytics and insights to make informed
              decisions.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon bgColor="var(--secondary)">
              <FaUsers />
            </FeatureIcon>
            <FeatureTitle>Borrower Management</FeatureTitle>
            <FeatureDescription>
              Easily manage borrower information, track their loan history, and maintain detailed profiles for better
              customer relationships.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon bgColor="var(--accent)">
              <FaMoneyBillWave />
            </FeatureIcon>
            <FeatureTitle>Loan Processing</FeatureTitle>
            <FeatureDescription>
              Streamline the entire loan lifecycle from application to disbursement and repayment with automated
              workflows.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon bgColor="var(--success)">
              <FaShieldAlt />
            </FeatureIcon>
            <FeatureTitle>Secure & Compliant</FeatureTitle>
            <FeatureDescription>
              Rest easy knowing your data is protected with enterprise-grade security and compliance with financial
              regulations.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <CTASection>
        <CTAContent>
          <CTATitle>Ready to Transform Your Loan Management?</CTATitle>
          <CTADescription>
            Join thousands of businesses that have streamlined their loan operations with Letsema.
          </CTADescription>
          <CTAButton to="/register">
            Get Started Today <FaArrowRight />
          </CTAButton>
        </CTAContent>
      </CTASection>

      <TestimonialsSection id="testimonials">
        <SectionTitle>
          What Our <span>Clients</span> Say
        </SectionTitle>
        <TestimonialsGrid>
          <TestimonialCard>
            <TestimonialText>
              "Letsema has completely transformed how we manage our loan portfolio. The dashboard provides valuable
              insights that help us make better decisions."
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>TM</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Thabo Mokoena</AuthorName>
                <AuthorRole>CEO, Basotho Finance Solutions</AuthorRole>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          <TestimonialCard>
            <TestimonialText>
              "The borrower management system is intuitive and has helped us improve our customer relationships. We've
              seen a 30% increase in repeat business."
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>LM</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Lineo Mphutlane</AuthorName>
                <AuthorRole>Operations Manager, Khoebo Loans</AuthorRole>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          <TestimonialCard>
            <TestimonialText>
              "The automated workflows have cut our loan processing time in half. Our team can now focus on growing the
              business instead of paperwork."
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>TL</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Teboho Letsie</AuthorName>
                <AuthorRole>Director, Potlako Loans Inc.</AuthorRole>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>

      <Footer>
        <FooterContent>
          <FooterColumn>
            <FooterLogo>
              Letsema<span>.</span>
            </FooterLogo>
            <FooterDescription>
              Simplifying loan management for businesses of all sizes with powerful, user-friendly software solutions.
            </FooterDescription>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Company</FooterTitle>
            <FooterLinks>
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Press</FooterLink>
            </FooterLinks>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Product</FooterTitle>
            <FooterLinks>
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
              <FooterLink href="#">Security</FooterLink>
              <FooterLink href="#">Enterprise</FooterLink>
            </FooterLinks>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Resources</FooterTitle>
            <FooterLinks>
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Guides</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">Community</FooterLink>
            </FooterLinks>
          </FooterColumn>
        </FooterContent>
        <FooterBottom>
          <div>© 2023 Letsema. All rights reserved.</div>
          <div>
            <FooterLink href="#">Privacy Policy</FooterLink> | <FooterLink href="#">Terms of Service</FooterLink>
          </div>
        </FooterBottom>
      </Footer>
    </HomeContainer>
  )
}

export default HomePage

