import HeroSection from '../components/HeroSection'
import StatsStrip from '../components/StatsStrip'
import HowItWorks from '../components/HowItWorks'
import RoleCards from '../components/RoleCards'
import TrendingStartups from '../components/TrendingStartups'
import Testimonials from '../components/Testimonials'

const Landing = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsStrip />
      <HowItWorks />
      <RoleCards />
      <TrendingStartups />
      <Testimonials />
    </div>
  )
}

export default Landing

