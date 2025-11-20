/**
 * Analytics event types
 *
 * All analytics events are strictly typed to ensure consistency
 */

export type AnalyticsEvent =
  | 'OrganizationCreated'
  | 'OrganizationUpdated'
  | 'OrganizationDeleted'
  | 'LibraryCreated'
  | 'LibraryUpdated'
  | 'LibraryDeleted'
  | 'ComponentCreated'
  | 'ComponentUpdated'
  | 'ComponentDeleted'
  | 'UserInvited'
  | 'RoleChanged'
  | 'MemberRemoved'
  | 'UserSignedIn'
  | 'UserSignedOut'
  | 'RouteViewed'

export interface AnalyticsEventProperties {
  OrganizationCreated: {
    organizationId: string
    organizationName: string
  }
  OrganizationUpdated: {
    organizationId: string
    organizationName: string
  }
  OrganizationDeleted: {
    organizationId: string
  }
  LibraryCreated: {
    libraryId: string
    libraryName: string
    organizationId: string
  }
  LibraryUpdated: {
    libraryId: string
    libraryName: string
    organizationId: string
  }
  LibraryDeleted: {
    libraryId: string
    organizationId: string
  }
  ComponentCreated: {
    componentId: string
    componentName: string
    libraryId: string
    organizationId: string
  }
  ComponentUpdated: {
    componentId: string
    componentName: string
    libraryId: string
    organizationId: string
  }
  ComponentDeleted: {
    componentId: string
    libraryId: string
    organizationId: string
  }
  UserInvited: {
    organizationId: string
    userId: string
    role: string
  }
  RoleChanged: {
    organizationId: string
    userId: string
    oldRole: string
    newRole: string
  }
  MemberRemoved: {
    organizationId: string
    userId: string
  }
  UserSignedIn: {
    userId: string
  }
  UserSignedOut: {
    userId: string
  }
  RouteViewed: {
    route: string
    [key: string]: unknown
  }
}

export interface AnalyticsProvider {
  track<T extends AnalyticsEvent>(event: T, properties?: AnalyticsEventProperties[T]): void
  identify(userId: string, traits?: Record<string, unknown>): void
  page(name: string, properties?: Record<string, unknown>): void
}
