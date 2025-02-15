import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert as AlertType } from "@/types/types";
import Alert from "./Alert";
import Spinner from "@/components/spinner";

interface AlertListProps {
  alerts: AlertType[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AlertList: React.FC<AlertListProps> = ({ alerts, onToggle, onDelete }) => {
  if (!alerts) return <Spinner/>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Alerts ({alerts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} alert={alert} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertList;
