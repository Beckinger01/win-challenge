import Link from "next/link"

const Home = () => {


  return (
    <section className="w-full h-screen bg-base flex-col content-center">
      <h1 className=" text-6xl font-bold text-center text-white sm:text-9xl"><span className="primary-text-gradient">Win</span>-Challenge</h1>
      <p className="text-center pt-20 text-gray-200 sm:text-2xl text-xl">Erstelle deine eigene Challenge oder schaue Live zu</p>
      <div className="flex justify-center pt-20 gap-4">
        <Link href="/erstelle-challenge" className="primary_btn primary-gradient">
        Spiele Challenge
        </Link>
        <Link href="/" className="primary_btn primary-gradient">
        Schaue Live zu
        </Link>
      </div>
    </section>
  )
}

export default Home