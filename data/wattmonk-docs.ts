export const wattmonkDocs = [
  {
    id: 'wm-1',
    title: 'Wattmonk Company Overview',
    content: `Wattmonk is a leading provider of AI-powered solutions for the solar and energy industry. Founded with a mission to accelerate the clean energy transition, Wattmonk combines cutting-edge artificial intelligence with deep domain expertise to streamline solar project workflows.

Our Mission: To make solar energy more accessible and efficient by automating complex processes and reducing project timelines.

Core Services:
- AI-powered solar design and engineering
- Automated permit documentation
- Remote site assessment and analysis
- Project management tools for solar installers

Target Markets:
- Residential solar installers
- Commercial solar developers
- EPC contractors
- Solar financiers and investors

Company Values:
- Innovation: Constantly pushing the boundaries of what's possible with AI
- Sustainability: Committed to accelerating the clean energy transition
- Customer Success: Dedicated to helping our partners succeed
- Integrity: Operating with transparency and ethical standards`,
    section: 'Company',
    category: 'overview',
  },
  {
    id: 'wm-2',
    title: 'Wattmonk AI Design Platform',
    content: `The Wattmonk AI Design Platform is a comprehensive solution for automated solar system design:

Key Features:
- Automated Roof Analysis: AI-powered detection of roof planes, obstacles, and shading
- Optimal System Layout: Intelligent placement of solar panels for maximum energy production
- String Sizing and Configuration: Automatic electrical design with NEC compliance
- Production Modeling: Accurate energy production estimates using industry-standard models

Design Capabilities:
- Residential and commercial systems
- Ground mount and rooftop installations
- Battery storage integration
- EV charging infrastructure

Output Documents:
- Site plan and layout drawings
- Single-line diagrams
- Equipment schedules
- Production reports
- Permit-ready documentation

Integration:
- Compatible with major CAD software
- API access for enterprise customers
- Export to popular solar design formats`,
    section: 'Products',
    category: 'design-platform',
  },
  {
    id: 'wm-3',
    title: 'Wattmonk Permit Services',
    content: `Wattmonk Permit Services streamline the solar permitting process:

Permit Package Generation:
- Complete electrical plans
- Structural calculations and letters
- Fire setback compliance diagrams
- Equipment specifications and datasheets
- NEC code compliance documentation

Jurisdiction Coverage:
- AHJ (Authority Having Jurisdiction) database with 10,000+ jurisdictions
- Customized permit packages for local requirements
- Regular updates for code changes

Turnaround Time:
- Standard residential permits: 24-48 hours
- Commercial projects: 3-5 business days
- Expedited service available

Plan Review Support:
- Response to plan check comments
- Revision and resubmission
- Direct communication with AHJs when needed

Success Rate:
- 95%+ first-time approval rate
- Dedicated quality assurance team
- Continuous process improvement`,
    section: 'Services',
    category: 'permitting',
  },
  {
    id: 'wm-4',
    title: 'Wattmonk Remote Site Assessment',
    content: `Wattmonk Remote Site Assessment eliminates the need for physical site visits:

Technology:
- High-resolution satellite and aerial imagery analysis
- 3D modeling and shading analysis
- LiDAR data integration where available
- Machine learning algorithms for accurate measurements

Data Collected:
- Roof dimensions and pitch
- Shading analysis by time of day and season
- Structural obstructions and equipment
- Electrical service panel location and capacity
- Surrounding vegetation and structures

Accuracy:
- Measurements within 2-3% of on-site surveys
- Shading analysis validated against production data
- Continuous model improvement

Benefits:
- Reduce soft costs by 50%+
- Faster project timelines
- Safer (no roof climbing required)
- Consistent data quality

Deliverables:
- Detailed site report
- Production estimates
- Preliminary system design
- Installation recommendations`,
    section: 'Services',
    category: 'site-assessment',
  },
  {
    id: 'wm-5',
    title: 'Wattmonk Pricing and Plans',
    content: `Wattmonk offers flexible pricing options for businesses of all sizes:

Starter Plan:
- Up to 10 projects per month
- Basic AI design features
- Email support
- Standard turnaround times
- Price: $199/month

Professional Plan:
- Up to 50 projects per month
- Advanced design features
- Priority support
- Faster turnaround times
- Custom branding options
- Price: $599/month

Enterprise Plan:
- Unlimited projects
- Full feature access
- Dedicated account manager
- API access
- Custom integrations
- White-label options
- Price: Custom pricing

Pay-Per-Project:
- Single residential design: $49
- Commercial design (per kW): $0.15
- Permit package: $149
- Site assessment: $29

Volume Discounts:
- 10% discount for annual billing
- Custom rates for 100+ projects/month
- Bundle discounts for multiple services`,
    section: 'Pricing',
    category: 'plans',
  },
  {
    id: 'wm-6',
    title: 'Wattmonk API Documentation',
    content: `Wattmonk provides a comprehensive REST API for enterprise integration:

API Capabilities:
- Create and manage projects
- Submit site addresses for analysis
- Retrieve design files and reports
- Access permit documents
- Webhook notifications for status updates

Authentication:
- API key-based authentication
- OAuth 2.0 support for partner integrations
- Secure HTTPS-only endpoints

Rate Limits:
- Starter: 100 requests/minute
- Professional: 500 requests/minute
- Enterprise: Custom limits

Endpoints:
- POST /v1/projects - Create new project
- GET /v1/projects/{id} - Retrieve project details
- POST /v1/projects/{id}/designs - Generate design
- GET /v1/projects/{id}/documents - List documents
- POST /v1/site-assessments - Request site assessment

SDKs and Libraries:
- JavaScript/TypeScript SDK
- Python library
- Postman collection available

Support:
- API documentation portal
- Developer support email
- Integration assistance for Enterprise customers`,
    section: 'Developers',
    category: 'api',
  },
  {
    id: 'wm-7',
    title: 'Wattmonk Support and Contact',
    content: `Contact Wattmonk for sales, support, or general inquiries:

Sales Inquiries:
- Email: sales@wattmonk.com
- Phone: 1-800-WATTMONK (1-800-928-8665)
- Schedule a demo: www.wattmonk.com/demo

Customer Support:
- Email: support@wattmonk.com
- Phone: 1-888-555-0123
- Support hours: Monday-Friday, 8AM-6PM PT
- Live chat available on platform

Office Locations:
Headquarters:
- 1234 Solar Drive, Suite 500
- San Francisco, CA 94105

East Coast Office:
- 567 Energy Plaza, Floor 12
- New York, NY 10001

Social Media:
- LinkedIn: linkedin.com/company/wattmonk
- Twitter: @wattmonk
- YouTube: youtube.com/wattmonk

Press Inquiries:
- Email: press@wattmonk.com

Partnerships:
- Email: partners@wattmonk.com`,
    section: 'Contact',
    category: 'support',
  },
  {
    id: 'wm-8',
    title: 'Wattmonk Security and Compliance',
    content: `Wattmonk maintains the highest standards of security and compliance:

Data Security:
- SOC 2 Type II certified
- End-to-end encryption for data in transit and at rest
- Regular penetration testing and vulnerability assessments
- Secure data centers with 99.99% uptime SLA

Privacy:
- GDPR compliant
- CCPA compliant
- Customer data never sold or shared
- Data retention policies configurable by customer

Industry Certifications:
- NABCEP PV Associate provider
- UL 2703 compliance for mounting systems
- IEEE 1547 compliance for grid interconnection
- NEC 2017, 2020, and 2023 code compliance

Insurance:
- $5M professional liability insurance
- $10M general liability insurance
- Cyber liability coverage

Business Continuity:
- Automated daily backups
- Disaster recovery plan tested annually
- Multi-region redundancy for critical services
- RPO: 24 hours, RTO: 4 hours`,
    section: 'Security',
    category: 'compliance',
  },
];
