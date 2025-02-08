'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFoundItems } from '@/app/actions/foundItems';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PageWrapper from '@/components/wrapper/page-wrapper';

const FoundItemsDisplay = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getFoundItems();
        setItems(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.description?.toLowerCase().includes(searchLower) ||
      item.location_name.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      (item.keywords || []).some((keyword: string) => 
        keyword.toLowerCase().includes(searchLower)
      )
    );
  });

  const handleItemClick = (id: any) => {
    router.push(`/found-items/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-4">
          <Input
            type="search"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm mx-auto mb-8"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: any) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{item.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.image_name && (
                    <img
                      src={`/api/images/${item.image_id}`}
                      alt={item.description || 'Found item'}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Location: {item.location_name}
                    </p>
                    {item.description && (
                      <p className="text-sm">{item.description}</p>
                    )}
                    {item.colors && item.colors.length > 0 && (
                      <p className="text-sm">
                        Colors: {item.colors.join(', ')}
                      </p>
                    )}
                    {item.brand && (
                      <p className="text-sm">Brand: {item.brand}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleItemClick(item.id)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center text-muted-foreground mt-8">
              No items found. Try adjusting your search.
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default FoundItemsDisplay;