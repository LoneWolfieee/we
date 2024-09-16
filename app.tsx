'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Search, ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Stripe } from '@/components/stripe'
import { StripeCheckout } from '@/components/stripe'

// Mock data for events and merchandise
const events = [
  { id: 1, name: 'Music Concert', date: '2023-09-15', time: '20:00', venue: 'Main Stage', price: 25 },
  { id: 2, name: 'Tech Workshop', date: '2023-09-16', time: '14:00', venue: 'Lecture Hall A', price: 15 },
  { id: 3, name: 'Art Exhibition', date: '2023-09-17', time: '10:00', venue: 'Gallery Space', price: 10 },
]

const merchandise = [
  { id: 1, name: 'Festival T-Shirt', price: 20, image: '/placeholder.svg' },
  { id: 2, name: 'Festival Cap', price: 15, image: '/placeholder.svg' },
  { id: 3, name: 'Festival Mug', price: 10, image: '/placeholder.svg' },
]

export default function CollegeFestivalPage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMerchandise = merchandise.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToCart = (item) => {
    setCart([...cart, item])
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">College Festival 2023</h1>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search events or merchandise"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2">
                  {cart.length}
                </Badge>
              )}
            </Button>
            {session ? (
              <Avatar>
                <AvatarImage src={session.user.image} alt={session.user.name} />
                <AvatarFallback>{session.user.name[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <Button variant="outline" size="icon" onClick={() => signIn()}>
                <User className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="events">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
          </TabsList>
          <TabsContent value="events">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Date: {event.date}</p>
                    <p>Time: {event.time}</p>
                    <p>Venue: {event.venue}</p>
                    <p>Price: ${event.price}</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => addToCart(event)}>Register</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="merchandise">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMerchandise.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-4" />
                    <p>Price: ${item.price}</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container mx-auto flex justify-between items-center">
            <p>Total: ${cart.reduce((sum, item) => sum + item.price, 0)}</p>
            <Stripe>
              <StripeCheckout
                amount={cart.reduce((sum, item) => sum + item.price, 0) * 100}
                currency="USD"
                clientSecret={process.env.STRIPE_CLIENT_SECRET}
              >
                <Button>Checkout</Button>
              </StripeCheckout>
            </Stripe>
          </div>
        </div>
      )}
    </div>
  )
}
