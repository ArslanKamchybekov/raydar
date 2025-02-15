"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { Categories, Locations, Brands, Colors, Materials, Weather } from "@/utils/constants"
import { createAlert, deleteAlert, toggleAlert, getAlerts } from "@/app/actions/alerts"
import { toast } from "@/components/ui/use-toast"
import type { Alert } from "@/types/types"
import { useUser } from "@clerk/nextjs"
import AlertList from "./_components/AlertList"

const AlertsPage = () => {
  const { user } = useUser()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newAlert, setNewAlert] = useState<Alert>({
    id: "",
    user_id: user?.id || "",
    enabled: false,
    category: "",
    location: "",
    brand: "",
    colors: [],
    size: "",
    material: "",
    weather: "",
  })

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setIsLoading(true)
    try {
      const data = await getAlerts()
      setAlerts(data)
    } catch (error) {
      console.error("Error fetching alerts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAlert = async () => {
    if (!newAlert.category || !newAlert.location) {
      toast({
        title: "Error",
        description: "Category and Location are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const colorsString = Array.isArray(newAlert.colors) ? newAlert.colors.join(",") : newAlert.colors || ""

      await createAlert(
        newAlert.category,
        newAlert.location,
        newAlert.brand || "",
        colorsString,
        newAlert.size || "",
        newAlert.material || "",
        newAlert.weather || "",
      )

      setNewAlert({
        id: "",
        user_id: user?.id || "",
        enabled: false,
        category: "",
        location: "",
        brand: "",
        colors: [],
        size: "",
        material: "",
        weather: "",
      })

      toast({
        title: "Success",
        description: "Alert created successfully",
      })

      fetchAlerts()
    } catch (error) {
      console.error("Error creating alert:", error)
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAlert = async (id: string) => {
    try {
      await deleteAlert(id)
      toast({
        title: "Success",
        description: "Alert deleted successfully",
      })
      fetchAlerts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      })
    }
  }

  const handleToggleAlert = async (id: string) => {
    try {
      await toggleAlert(id)
      fetchAlerts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle alert",
        variant: "destructive",
      })
    }
  }

  const selectFields = [
    { options: Categories, key: "category", label: "Category", required: true },
    { options: Locations.map((location) => location.name), key: "location", label: "Location", required: true },
    { options: Brands, key: "brand", label: "Brand", required: false },
    { options: Colors, key: "colors", label: "Color", required: false },
    { options: Materials, key: "material", label: "Material", required: false },
    { options: Weather, key: "weather", label: "Weather", required: false },
  ]

  return (
    <main className="flex-1">
      <div className="flex flex-col mb-8 w-full max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Alerts</h1>
        <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">
          Create custom alerts to get notified when similar items are posted.
        </p>

        {/* Create New Alert */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {selectFields.map(({ options, key, label, required }) => (
              <Select
                key={key}
                value={newAlert[key as keyof Alert]?.toString() || ""}
                onValueChange={(value) =>
                  setNewAlert((prev) => ({
                    ...prev,
                    [key]: key === "colors" ? [value] : value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${label}${required ? " *" : ""}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            <Button onClick={handleAddAlert} disabled={isSubmitting} className="col-span-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Alert...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Alert
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <AlertList alerts={alerts} onToggle={handleToggleAlert} onDelete={handleDeleteAlert} />
      </div>
    </main>
  )
}

export default AlertsPage

