'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, ShoppingCart, Search, Bell } from 'lucide-react'
import Link from 'next/link'

export default function CollegeFestivalPage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')

  const events = [
    { id: 1, name: 'Music Concert', description: 'Live performances by local bands', date: '2023-09-15', time: '19:00', venue: 'Main Auditorium' },
    { id: 2, name: 'Hackathon', description: '24-hour coding competition', date: '2023-09-16', time: '09:00', venue: 'Computer Science Building' },
    { id: 3, name: 'Art Exhibition', description: 'Showcase of student artwork', date: '2023-09-17', time: '10:00', venue: 'Art Gallery' },
  ]

  const merchandise = [
    { id: 1, name: 'Festival T-Shirt', description: 'Comfortable cotton t-shirt with festival logo', price: 20 },
    { id: 2, name: 'Festival Cap', description: 'Adjustable cap with embroidered festival logo', price: 15 },
    { id: 3, name: 'Festival Mug', description: 'Ceramic mug with festival design', price: 10 },
  ]

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMerchandise = merchandise.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">College Festival 2023</h1>
        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={session.user.image} alt={session.user.name} />
                <AvatarFallback>{session.user.name[0]}</AvatarFallback>
              </Avatar>
              <span>{session.user.name}</span>
            </div>
          ) : (
            <Link href="/api/auth/signin">
              <Button>Sign In</Button>
            </Link>
          )}
          <Link href="/cart">
            <Button variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
            </Button>
          </Link>
          <Button variant="outline">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search events and merchandise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <Tabs defaultValue="events" className="mb-8">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {event.date} at {event.time}
                  </p>
                  <p className="mt-2">{event.venue}</p>
                </CardContent>
                <CardFooter>
                  <Button>Register</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="merchandise">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMerchandise.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${item.price}</p>
                </CardContent>
                <CardFooter>
                  <Button>Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
