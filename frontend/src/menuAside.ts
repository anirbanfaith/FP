import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/couriers/couriers-list',
    label: 'Couriers',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiTruck' in icon ? icon['mdiTruck' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_COURIERS'
  },
  {
    href: '/reports/reports-list',
    label: 'Reports',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiFileChart' in icon ? icon['mdiFileChart' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_REPORTS'
  },
  {
    href: '/sellers/sellers-list',
    label: 'Sellers',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiStore' in icon ? icon['mdiStore' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SELLERS'
  },
  {
    href: '/shipments/shipments-list',
    label: 'Shipments',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiPackageVariant' in icon ? icon['mdiPackageVariant' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SHIPMENTS'
  },
  {
    href: '/support_tickets/support_tickets-list',
    label: 'Support tickets',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiHelpCircle' in icon ? icon['mdiHelpCircle' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SUPPORT_TICKETS'
  },
  {
    href: '/warehouses/warehouses-list',
    label: 'Warehouses',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiWarehouse' in icon ? icon['mdiWarehouse' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_WAREHOUSES'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
