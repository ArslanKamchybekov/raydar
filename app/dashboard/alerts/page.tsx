'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { Categories, Locations, Brands, Colors, Size, Materials, Weather } from '@/types/enums';
import create

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    category: '',
    location: '',
    brand: '',
    color: '',
    size: '',
    material: '',
    weather: '',
    enabled: true
  });

  const handleAddAlert = () => {
    if (newAlert.category && newAlert.location) {
      setAlerts([...alerts, { ...newAlert, id: Date.now() }]);
      setNewAlert({ category: '', location: '', brand: '', color: '', size: '', material: '', weather: '', enabled: true });
    }
  };

  const handleDeleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  return (
    <main className="flex-1 p-4">
      <div className="flex flex-col mb-8 w-full max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Alerts</h1>
        <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">Create custom alerts to get notified when similar items are posted.</p>

        {/* Create New Alert */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {[Categories, Locations, Brands, Colors, Size, Materials, Weather].map((enumType, index) => (
              <Select
                key={index}
                value={newAlert[Object.keys(newAlert)[index]]}
                onValueChange={(value) => setNewAlert({ ...newAlert, [Object.keys(newAlert)[index]]: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${Object.keys(newAlert)[index]}`} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(enumType).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            <Button 
              onClick={handleAddAlert}
              disabled={!newAlert.category || !newAlert.location}
            >
              Add Alert
            </Button>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500">No alerts created yet.</p>
            ) : (
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch checked={alert.enabled} onCheckedChange={() => toggleAlert(alert.id)} />
                      <div>
                        <p className="font-medium">{Categories[alert.category]}</p>
                        <p className="text-sm text-gray-500">{Locations[alert.location]}</p>
                        <p className="text-sm text-gray-500">{Brands[alert.brand]}</p>
                        <p className="text-sm text-gray-500">{Colors[alert.color]}</p>
                        <p className="text-sm text-gray-500">{Size[alert.size]}</p>
                        <p className="text-sm text-gray-500">{Materials[alert.material]}</p>
                        <p className="text-sm text-gray-500">{Weather[alert.weather]}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAlert(alert.id)}>
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