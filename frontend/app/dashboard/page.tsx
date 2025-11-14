import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ScaleIcon,
  ClockIcon,
  PlusCircleIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';


export default function DashboardPage() {
  const summaryData = [
    { title: 'Total In', value: '$150,000', color: 'text-tajheez-green' },
    { title: 'Total Out', value: '$80,000', color: 'text-tajheez-red' },
    { title: 'Net Cash Position', value: '$70,000', color: 'text-tajheez-dark-navy' },
    { title: 'Pending Approvals', value: '12', color: 'text-tajheez-orange' },
  ];

  const recentActivities = [
    { id: 1, description: 'Transaction #1234 approved', status: 'Approved', statusColor: 'bg-tajheez-green-light text-tajheez-green' },
    { id: 2, description: 'New transaction #5678 submitted', status: 'Submitted', statusColor: 'bg-tajheez-orange-light text-tajheez-orange' },
    { id: 3, description: 'Transaction #9101 rejected', status: 'Rejected', statusColor: 'bg-tajheez-red-light text-tajheez-red' },
    { id: 4, description: 'Transaction #1122 approved', status: 'Approved', statusColor: 'bg-tajheez-green-light text-tajheez-green' },
  ];

  return (
    <Layout>
        <h1 className="text-3xl font-bold text-tajheez-dark-navy mb-8">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryData.map((item) => (
            <Card key={item.title}>
              <h2 className="text-lg font-semibold text-gray-600 flex items-center space-x-2">
                {item.title === 'Total In' && <ArrowUpIcon className="h-5 w-5 text-tajheez-green" />}
                {item.title === 'Total Out' && <ArrowDownIcon className="h-5 w-5 text-tajheez-red" />}
                {item.title === 'Net Cash Position' && <ScaleIcon className="h-5 w-5 text-tajheez-dark-navy" />}
                {item.title === 'Pending Approvals' && <ClockIcon className="h-5 w-5 text-tajheez-orange" />}
                <span>{item.title}</span>
              </h2>
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button as={Link} href="/add-transaction" Icon={PlusCircleIcon}>Add Transaction</Button>
          <Button as={Link} href="/approvals" Icon={CheckBadgeIcon}>Approvals</Button>
          <Button as={Link} href="/reports/weekly" Icon={CalendarDaysIcon}>Weekly Summary</Button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-tajheez-dark-navy mb-4">Recent Activity</h2>
          <ul>
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                <p className="text-gray-700">{activity.description}</p>
                <Badge variant={activity.status === 'Approved' ? 'success' : activity.status === 'Pending' ? 'warning' : 'danger'} Icon={activity.status === 'Approved' ? CheckIcon : activity.status === 'Submitted' ? ClockIcon : XMarkIcon}>{activity.status}</Badge>
              </li>
            ))}
          </ul>
        </div>
    </Layout>
  );
}
