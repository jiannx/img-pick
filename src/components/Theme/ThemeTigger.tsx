import { Button } from "@/components/ui/button"
import { SunMoon, SunMedium, MoonStar } from "lucide-react"
import { useTheme } from './ThemeProvider';

export function ThemeTigger() {
  const { setTheme, theme } = useTheme()
  const _setTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('light');
    }
  }
  return (
    <Button variant="ghost" size={'xs'} onClick={_setTheme}>
      {theme === 'light' && <SunMedium size={16} strokeWidth={1} />}
      {theme === 'dark' && <MoonStar size={16} strokeWidth={1} />}
      {theme === 'system' && <SunMoon size={16} strokeWidth={1} />}
    </Button>
  )
}