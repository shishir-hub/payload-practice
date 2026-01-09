'use client'

import { useAppSelector } from '@/store/store'
import { NavLink } from '@mantine/core'
import Link from 'next/link'
import React, { useEffect } from 'react'

import './Navbar.scss'

const Navbar = () => {
  const { user }: { user: any } = useAppSelector((state) => state.userReducer.value)

  return (
    <div className="navbar">
      <div className="nav-container">
        <p className="title">PropertyShop</p>
        <div className="nav-links">
          <NavLink component={Link} href="/" label="Home" />
          {user?.id ? (
            user?.role === 'seller' || user?.role === 'admin' ? (
              <NavLink component={Link} href="/add-property" label="Add Property" />
            ) : (
              <></>
            )
          ) : (
            <>
              <NavLink component={Link} href="/login" label="Login" />
              <NavLink component={Link} href="/signup" label="Signup" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
