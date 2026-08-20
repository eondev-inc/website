import SkeletonLoader from '@/components/base/SkeletonLoader.vue'
import { renderWithApp } from '../../../helpers'

describe('SkeletonLoader.vue', () => {
  it('should render blog-card variant by default', async () => {
    const view = await renderWithApp(SkeletonLoader)

    expect(view.container.querySelector('.rounded-3xl')).toBeInTheDocument()
  })

  it('should render line variant classes from props', async () => {
    const view = await renderWithApp(SkeletonLoader, {
      props: {
        variant: 'line',
        height: '8',
        width: '1/2'
      }
    })

    const line = view.container.querySelector('.bg-animate')
    expect(line?.className).toContain('h-8')
  })
})
