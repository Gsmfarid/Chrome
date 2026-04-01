import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Order, OrderItem } from '../lib/supabase';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No orders yet</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [orderItems, setOrderItems] = useState<(OrderItem & { products: any })[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      fetchOrderItems();
    }
  }, [expanded]);

  async function fetchOrderItems() {
    const { data, error } = await supabase
      .from('order_items')
      .select('*, products(*)')
      .eq('order_id', order.id);

    if (error) {
      console.error('Error fetching order items:', error);
    } else {
      setOrderItems(data || []);
    }
  }

  const statusIcons = {
    pending: <Clock className="text-yellow-600" size={20} />,
    processing: <Package className="text-blue-600" size={20} />,
    shipped: <Truck className="text-purple-600" size={20} />,
    delivered: <CheckCircle className="text-green-600" size={20} />,
    cancelled: <XCircle className="text-red-600" size={20} />,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-600">
              Order #{order.id.slice(0, 8)}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {statusIcons[order.status]}
            <span className="capitalize font-medium text-gray-900">
              {order.status}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">
            ${order.total_amount.toFixed(2)}
          </span>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3 mb-6">
            {orderItems.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded">
                {item.products?.image_url && (
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.products?.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × ${item.price}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    Status: {item.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
            <div className="text-sm text-gray-600">
              <p>{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.address_line1}</p>
              {order.shipping_address.address_line2 && (
                <p>{order.shipping_address.address_line2}</p>
              )}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state}{' '}
                {order.shipping_address.zip_code}
              </p>
              <p>{order.shipping_address.country}</p>
              <p>{order.shipping_address.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function VendorOrders() {
  const { user } = useAuth();
  const [orderItems, setOrderItems] = useState<(OrderItem & { products: any; orders: Order })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVendorOrders();
    }
  }, [user]);

  async function fetchVendorOrders() {
    try {
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (!vendorData) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('order_items')
        .select('*, products(*), orders(*)')
        .eq('vendor_id', vendorData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderItemStatus(itemId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('order_items')
        .update({ status: newStatus })
        .eq('id', itemId);

      if (error) throw error;
      await fetchVendorOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vendor Orders</h1>

      {orderItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderItems.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{item.order_id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.products?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-900">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={item.status}
                      onChange={(e) => updateOrderItemStatus(item.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
