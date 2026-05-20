import logoUrl from '../../../assets/images/logo.png'
import { memo } from 'react'

function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2 text-mist">
          <img
            src={logoUrl}
            alt="Angling Intelligence logo"
            className="h-14 w-14 object-contain drop-shadow-[0_0_18px_rgba(45,212,191,0.42)] sm:h-16 sm:w-16"
          />
          <span className="text-sm font-black tracking-normal text-stone-50 drop-shadow-[0_2px_10px_rgba(8,47,73,0.65)] sm:text-base">
            Angling Intelligence
          </span>
        </a>
        <div className="hidden items-center gap-2 rounded-full border border-amber-100/20 bg-emerald-950/24 px-4 py-2 text-sm font-semibold text-cyan-50/78 shadow-sm backdrop-blur-md sm:flex">
          Ontario waters
        </div>
      </nav>
    </header>
  )
}

export default memo(Navbar)
