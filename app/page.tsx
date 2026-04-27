//app/page.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'


import React from 'react'

const page = () => {
  return (
    <div className=' justify-center items-center text-center mt-70'>
    <Link href={"/dashboard"}>
   <Button variant="outline" className='bg-red-600 font-bold hover:bg-red-300'>
      Go to Dashboard
    </Button>
    </Link> 
    </div>
  )
}

export default page
