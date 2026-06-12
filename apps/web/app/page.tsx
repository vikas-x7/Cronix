import SmoothScroll from '@/shared/providers/smooth-scroll-provider';
import Landing from '../src/modules/landing/Landing';

export default function Home() {
  return (
    <SmoothScroll>
      <Landing />
    </SmoothScroll>
  );
}
