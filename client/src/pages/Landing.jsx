import HeroSection from '../components/HeroSection'
import StatsStrip from '../components/StatsStrip'
import RoleCards from '../components/RoleCards'
import TrendingStartups from '../components/TrendingStartups'
import Testimonials from '../components/Testimonials'

const Landing = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsStrip />
      <RoleCards />
      <TrendingStartups />
      <Testimonials />
    </div>
  )
}

export default Landing

