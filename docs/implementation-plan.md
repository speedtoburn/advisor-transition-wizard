# Advisor Transition Wizard Implementation Plan

## Component Tree & Architecture

| Category | Details | Hours | Testing Approach |
|----------|---------|--------|------------------|
| **Page Structure** | 
• `/src/app/(auth)/login/page.tsx` - Authentication
• `/src/app/wizard/layout.tsx` - Wizard wrapper
• `/src/app/wizard/[step]/page.tsx` - Dynamic step pages
• `/src/app/wizard/complete/page.tsx` - Success page | 8 | Playwright E2E |
| **Components** |
• `/src/components/wizard/StepIndicator.tsx`
• `/src/components/wizard/NavigationControls.tsx`
• `/src/components/forms/` - Step-specific forms
• `/src/components/status/TransferStatus.tsx` | 16 | Jest + RTL |
| **Step Components** |
1. `/src/components/steps/LOIForm.tsx`
2. `/src/components/steps/TemplateSelector.tsx`
3. `/src/components/steps/EPackageBuilder.tsx`
4. `/src/components/steps/ESignature.tsx`
5. `/src/components/steps/CustodianConnect.tsx`
6. `/src/components/steps/ComplianceCheck.tsx` | 24 | Jest + RTL |

## State Management

**Choice: Zustand + React Query**

Rationale:
- Zustand for wizard state (lightweight, simple API)
- React Query for server state (caching, invalidation)

```typescript
// /src/store/wizardStore.ts
interface WizardState {
  currentStep: number;
  formData: Record<string, any>;
  isValid: boolean;
  setStep: (step: number) => void;
  updateFormData: (data: any) => void;
}
```

Hours: 6
Testing: Jest

## API Routes

| Endpoint | Purpose | Hours | Testing |
|----------|---------|--------|----------|
| `/src/app/api/loi/route.ts` | LOI submission | 3 | Jest |
| `/src/app/api/templates/route.ts` | Template management | 3 | Jest |
| `/src/app/api/epackage/route.ts` | Package generation | 4 | Jest |
| `/src/app/api/esign/route.ts` | Signature handling | 4 | Jest |
| `/src/app/api/custodian/route.ts` | Custodian integration | 5 | Jest |
| `/src/app/api/compliance/route.ts` | Compliance checks | 4 | Jest |
| `/src/app/api/websocket/route.ts` | WebSocket handling | 6 | Jest |

## WebSocket Strategy

Using Server-Sent Events (SSE) for transfer status:
```typescript
// /src/app/api/status/route.ts
export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  
  // Send updates about transfer status
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

Hours: 8
Testing: Jest + Playwright

## Testing Matrix

| Layer | Tool | Coverage Target | Hours |
|-------|------|----------------|--------|
| Components | Jest + RTL | 85% | 16 |
| API Routes | Jest | 90% | 12 |
| E2E Flows | Playwright | Key paths | 20 |
| State Management | Jest | 95% | 8 |

## Total Time Estimate

| Category | Hours |
|----------|--------|
| Page Structure | 8 |
| Components | 16 |
| Step Components | 24 |
| State Management | 6 |
| API Routes | 29 |
| WebSocket Implementation | 8 |
| Testing | 56 |
| Documentation | 8 |
| **Total** | **155** |

## Risk/Assumption Log

- **Technical Risks**
  • Custodian API availability and rate limits
  • WebSocket scalability in serverless environment
  • E-signature legal compliance requirements
  • Real-time status sync across multiple tabs

- **Assumptions**
  • Users have modern browsers (ES2021+ support)
  • Maximum file upload size: 10MB
  • Maximum concurrent users: 1000
  • Average wizard completion time: 15 minutes
  • Custodian API response time: <2s

- **Mitigations**
  • Implement robust error handling
  • Add retry mechanisms for API calls
  • Cache templates and static data
  • Use optimistic updates for better UX
  • Implement proper validation at each step

---

I will await your approval of this implementation plan before proceeding with any coding work. The first phase would focus on setting up the basic wizard flow with mock data before integrating real APIs.
