import React from 'react'
import Link from 'next/link'

const TypeWinCard = ({ type, desc }) => {
  return (
    <Link href="/erstelle-challenge/klassisch" className="choose-card">
      <h2 className="font-bold text-4xl primary-text pb-10">{type}</h2>
      <p>{desc}</p>
    </Link>
  )
}

export default TypeWinCard