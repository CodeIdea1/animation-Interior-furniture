import HeroSection from './components/HeroSection';
import SecondSection from './components/SecondSection';
import ThirdSection from './components/ThirdSection';
import ProductsSection from './components/ProductsSection';
import RoomStyleSection from './components/RoomStyleSection';
import SmoothScroll from './components/SmoothScroll';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <div className={styles.pageWrapper}>
        <HeroSection />
        <SecondSection />
        <div className={styles.scrollSpacer} />
        <ThirdSection />
        <ProductsSection />
        <RoomStyleSection />
      </div>
    </>
  );
}
