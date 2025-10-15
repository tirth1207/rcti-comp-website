import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'

function page() {
  return (
    <div>
        <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0">
                <Button>
                   Menu
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <span>Content</span>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default page