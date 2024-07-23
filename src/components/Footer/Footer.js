import React from 'react'

function Footer() {
  return (
    <div>
      <footer className="bg-dark text-white text-center p-3 mt-5" style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                Copyright &copy; {new Date().getFullYear()} Navriti Technologies. All rights reserved.
        </footer>
    </div>
  )
}

export default Footer
