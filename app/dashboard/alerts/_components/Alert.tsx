import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { Alert as AlertType } from "@/types/types";

interface AlertProps {
  alert: AlertType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const Alert: React.FC<AlertProps> = ({ alert, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Switch checked={alert.enabled} onCheckedChange={() => onToggle(alert.id)} />
        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
          <p className="text-sm font-semibold">{alert.category}</p>
          <p className="text-sm text-gray-600">{alert.location}</p>
          {alert.brand && <p className="text-sm text-gray-600">Brand: {alert.brand}</p>}
          {alert.colors && alert.colors.length > 0 && (
            <p className="text-sm text-gray-600">Color: {alert.colors.join(", ")}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(alert.id)}
        className="text-gray-500 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Alert;
