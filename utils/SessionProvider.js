'use client'

import {SessionProvider} from 'next-auth/react'

const AuthProvider = ({children}) => { // wrapping entire application
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider