import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '@/stores/features/authFeature'

const UnAuthorized = () => {
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!auth.user) {
      dispatch(getUser())
    }
  }, [auth.user])

  return (
    <div>
      UnAuthorized <br />
      <Link to={"/"}><Button>Go to home</Button></Link>
    </div>
  )
}

export default UnAuthorized
