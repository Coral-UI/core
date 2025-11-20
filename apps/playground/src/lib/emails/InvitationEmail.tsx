import type { OrgRole } from '@/lib/supabase/types'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'

interface InvitationEmailProps {
  organizationName: string
  inviterName: string
  inviterEmail: string
  role: OrgRole
  acceptUrl: string
}

export const InvitationEmail: React.FC<Readonly<InvitationEmailProps>> = ({
  organizationName,
  inviterName,
  inviterEmail,
  role,
  acceptUrl,
}) => {
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)

  return (
    <Html lang="en">
      <Head />
      <Preview>You've been invited to join {organizationName} on Coral</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You've been invited!</Heading>

          <Text style={text}>
            <strong>{inviterName}</strong> ({inviterEmail}) has invited you to join <strong>{organizationName}</strong> on
            Coral as a <strong>{roleLabel}</strong>.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={acceptUrl}>
              Accept Invitation
            </Button>
          </Section>

          <Text style={text}>
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this
            email.
          </Text>

          <Text style={footer}>
            If the button doesn't work, copy and paste this link into your browser:
            <br />
            <a href={acceptUrl} style={link}>
              {acceptUrl}
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
}

const buttonContainer = {
  padding: '27px 0',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
}

const link = {
  color: '#666',
  textDecoration: 'underline',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '48px',
  padding: '0',
}
