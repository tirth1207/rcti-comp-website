"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { createClient } from "@/lib/supabase/client"


async function resultpage() {
  const [enrollment,setEnrollment] = useState("")

  const supabase = await createClient()

  // Get subjects for this semester
  const { data: subjects, error } = await supabase
    .from('results')
    .select('*')
    .eq('enroll',enrollment)
    .order('')
  return (
    // <div className='flex justify-center align-center max-w-3xl mx-auto mt-20'>
    //     <form className='w-full max-w-3xl mx-auto gap-3 flex flex-col justify-center align-center'>
    //         <Input className='w-full' placeholder='Enter Your Enrollment Number' type='number' value={enrollment} onChange={(e) => setEnrollment(e.target.value)}/>
    //         <Button className='my-5'>Submit</Button>
    //     </form>
    // </div>

    <div className='flex justify-center items-center h-[500px] font-bold text-4xl'>
      Coming Soon
    </div>
  )
}

export default resultpage