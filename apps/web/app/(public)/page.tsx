import { Box } from '@mui/material';
import HeroSection from '../../src/components/HeroSection';
import TopicsSlider from '../../src/components/TopicsSlider';
import SafeSpaceSection from '../../src/components/SafeSpaceSection';
import PayItForwardSection from '../../src/components/PayItForwardSection';
import BridgeSection from '../../src/components/BridgeSection';

export default function HomePage() {
  return (
    <Box 
      component="main" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1,
        overflowX: 'hidden',
        overflowY: { xs: 'auto', md: 'hidden' }
      }}
    >
      <HeroSection />
      
      {/* Desktop Slider */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, flexDirection: 'column', position: 'relative', overflow: 'hidden', backgroundColor: 'secondary.main' }}>
        <TopicsSlider />
      </Box>

      {/* Mobile Scroll */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', backgroundColor: 'secondary.main' }}>
        <SafeSpaceSection />
        <PayItForwardSection />
        <BridgeSection />
      </Box>
    </Box>
  );
}
