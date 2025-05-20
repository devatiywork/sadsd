import { Pages } from '@/router/config'
import { useLocation } from 'react-router-dom'

export const useShowHeader = (): boolean => {
  const location = useLocation()
  const currentPage = Pages.find(page => page.path === location.pathname)
  
  return currentPage?.indexHeader ?? false
}
