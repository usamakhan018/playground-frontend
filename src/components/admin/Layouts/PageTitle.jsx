import React from 'react'
import { useEffect } from 'react'

function PageTitle({title}) {

  useEffect(() => {
    document.title = title + ' | ' + import.meta.env.VITE_APP_NAME;
  }, [title]);
  
  return (
    <div>
        <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      </div>
    </div>
  )
}

export default PageTitle