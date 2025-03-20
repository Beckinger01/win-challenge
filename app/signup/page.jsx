import SignUpForm from '@components/SignUpForm'
import React from 'react'

const Register = () => {
  return (
    <section className='w-full h-screen bg-base flex-col content-center'>
      <h1 className='text-white'>Hier Registrieren</h1>
      <SignUpForm />
    </section>
  )
}

export default Register