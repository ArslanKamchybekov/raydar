'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Bell, Plus, Loader2 } from 'lucide-react';
import { Categories, Locations, Brands, Colors, Materials, Weather } from '@/utils/constants';
import { createAlert, deleteAlert, toggleAlert, getAlerts } from "@/app/actions/alerts";
import { toast } from '@/components/ui/use-toast';
import { Alert } from '@/types/types';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAlert, setNewAlert] = useState<Alert>({
    id: '',
    user_id: '',
    enabled: false,
    category: '',
    location: '',
    brand: '',
    colors: [],
    size: '',
    material: '',
    weather: '',
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAlert = async () => {
    if (!newAlert.category || !newAlert.location) {
      toast({
        title: "Error",
        description: "Category and Location are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const colorsString = Array.isArray(newAlert.colors) ? newAlert.colors.join(',') : newAlert.colors || '';
      
      await createAlert(
        newAlert.category,
        newAlert.location,
        newAlert.brand || '',
        colorsString,
        newAlert.size || '',
        newAlert.material || '',
        newAlert.weather || ''
      );
      
      setNewAlert({
        id: '',
        user_id: '',
        enabled: false,
        category: '',
        location: '',
        brand: '',
        colors: [],
        size: '',
        material: '',
        weather: '',
      });
      
      toast({
        title: "Success",
        description: "Alert created successfully"
      });
      
      fetchAlerts();
    } catch (error) {
      console.error("Error creating alert:", error);
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await deleteAlert(id);
      toast({
        title: "Success",
        description: "Alert deleted successfully"
      });
      fetchAlerts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive"
      });
    }
  };

  const handleToggleAlert = async (id: string) => {
    try {
      await toggleAlert(id);
      fetchAlerts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle alert",
        variant: "destructive"
      });
    }
  };

  const selectFields = [
    { options: Categories, key: 'category', label: 'Category', required: true },
    { options: Locations.map(location => location.name), key: 'location', label: 'Location', required: true },
    { options: Brands, key: 'brand', label: 'Brand', required: false },
    { options: Colors, key: 'colors', label: 'Color', required: false },
    { options: Materials, key: 'material', label: 'Material', required: false },
    { options: Weather, key: 'weather', label: 'Weather', required: false }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1">
      <div className="flex flex-col mb-8 w-full max-w-3xl">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Alerts</h1>
        </div>
        <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">
          Create custom alerts to get notified when similar items are posted.
        </p>

        {/* Create New Alert */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Create New Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {selectFields.map(({ options, key, label, required }) => (
              <Select
                key={key}
                value={newAlert[key as keyof Alert]?.toString() || ''}
                onValueChange={(value) => 
                  setNewAlert(prev => ({
                    ...prev,
                    [key]: key === 'colors' ? [value] : value
                  }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${label}${required ? ' *' : ''}`} />
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

            <Button 
              onClick={handleAddAlert}
              disabled={isSubmitting || !newAlert.category || !newAlert.location}
              className="col-span-2"
            >
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Active Alerts ({alerts.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-sm">No alerts created yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={alert.enabled}
                        onCheckedChange={() => handleToggleAlert(alert.id)}
                      />
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                        <p className="text-sm font-semibold">
                          {alert.category}
                        </p>
                        <p className="text-sm text-gray-600">
                          {alert.location}
                        </p>
                        {alert.brand && (
                          <p className="text-sm text-gray-600">Brand: {alert.brand}</p>
                        )}
                        {alert.colors && alert.colors.length > 0 && (
                          <p className="text-sm text-gray-600">Color: {Array.isArray(alert.colors) ? alert.colors.join(', ') : alert.colors}</p>
                        )}
                        {alert.material && (
                          <p className="text-sm text-gray-600">Material: {alert.material}</p>
                        )}
                        {alert.weather && (
                          <p className="text-sm text-gray-600">Weather: {alert.weather}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AlertsPage;