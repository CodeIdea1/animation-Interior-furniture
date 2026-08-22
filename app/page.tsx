import HeroSection from './components/HeroSection';
import SecondSection from './components/SecondSection';
import ThirdSection from './components/ThirdSection';
import ProductsSection from './components/ProductsSection';
import RoomStyleSection from './components/RoomStyleSection';
import FinalRevealSection from './components/FinalRevealSection';
import FooterSection from './components/FooterSection';
import Navbar from './components/Navbar';
import SmoothScroll from './components/SmoothScroll';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <div className={styles.pageWrapper}>
        <HeroSection />
        <SecondSection />
        <ThirdSection />
        <ProductsSection />
        <RoomStyleSection />
        <FinalRevealSection />
        <FooterSection />
      </div>
    </>
  );
}