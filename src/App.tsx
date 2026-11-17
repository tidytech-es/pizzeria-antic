import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MenuSection from '@/components/MenuSection'
import DishOrbit from '@/components/DishOrbit'
import OvenSection from '@/components/OvenSection'
import Reviews from '@/components/Reviews'
import Location from '@/components/Location'
import Footer from '@/components/Footer'
import OrderDrawer from '@/components/OrderDrawer'
import ReserveModal from '@/components/ReserveModal'
import FloatingOrderButton from '@/components/FloatingOrderButton'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Navbar onCta={() => setModalOpen(true)} />
      <main>
        <Hero />
        <DishOrbit />
        <MenuSection />
        <OvenSection />
        <Reviews />
        <Location />
      </main>
      <Footer />
      <FloatingOrderButton />
      <OrderDrawer />
      <ReserveModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
