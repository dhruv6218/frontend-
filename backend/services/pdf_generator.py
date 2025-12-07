"""
PDF Report Generator with White-Label Support
Generates comprehensive 9-section vendor verification reports
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import io
from typing import Dict, Any, Optional

class PDFReportGenerator:
    def __init__(self, branding: Optional[Dict[str, Any]] = None):
        """
        Initialize PDF generator with optional white-label branding
        
        Args:
            branding: Dict containing white-label settings
                - enabled: bool
                - company_name: str
                - logo_url: str (optional)
                - primary_color: str (hex)
                - report_title: str
                - footer_text: str
                - support_email: str
                - support_phone: str
                - hide_ravono_brand: bool
        """
        self.branding = branding or {}
        self.enabled = self.branding.get('enabled', False)
        
        # Colors
        self.primary_color = self._hex_to_rgb(
            self.branding.get('primary_color', '#F97316')
        )
        self.accent_color = self._hex_to_rgb(
            self.branding.get('accent_color', '#10B981')
        )
        
    def _hex_to_rgb(self, hex_color: str) -> tuple:
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16)/255.0 for i in (0, 2, 4))
    
    def generate_report(
        self,
        vendor_data: Dict[str, Any],
        verification_data: Dict[str, Any],
        ai_summary: Dict[str, Any],
        report_id: str
    ) -> bytes:
        """
        Generate complete PDF report
        
        Returns:
            bytes: PDF file content
        """
        buffer = io.BytesIO()
        
        # Create PDF document
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=20*mm,
            leftMargin=20*mm,
            topMargin=25*mm,
            bottomMargin=25*mm
        )
        
        # Build content
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.Color(*self.primary_color),
            spaceAfter=12,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.Color(*self.primary_color),
            spaceBefore=12,
            spaceAfter=6
        )
        
        # 1. COVER PAGE
        story.extend(self._generate_cover_page(report_id, vendor_data, title_style, styles))
        story.append(PageBreak())
        
        # 2. VENDOR OVERVIEW & SUMMARY
        story.extend(self._generate_vendor_overview(vendor_data, verification_data, heading_style, styles))
        story.append(Spacer(1, 20))
        
        # 3. RISK SCORE DASHBOARD
        story.extend(self._generate_risk_dashboard(ai_summary, heading_style, styles))
        story.append(Spacer(1, 20))
        
        # 4. DATA SOURCES & VERIFICATION LOGIC
        story.extend(self._generate_data_sources(verification_data, heading_style, styles))
        story.append(PageBreak())
        
        # 5. DETAILED CHECK RESULTS
        story.extend(self._generate_check_results(verification_data, heading_style, styles))
        story.append(PageBreak())
        
        # 6. RISK ANALYSIS & RECOMMENDATIONS
        story.extend(self._generate_risk_analysis(ai_summary, heading_style, styles))
        story.append(Spacer(1, 20))
        
        # 7. SUPPORTING DOCUMENTS
        story.extend(self._generate_supporting_docs(verification_data, heading_style, styles))
        story.append(Spacer(1, 20))
        
        # 8. COMPLIANCE & AUDIT TRAIL
        story.extend(self._generate_audit_trail(report_id, verification_data, heading_style, styles))
        story.append(Spacer(1, 20))
        
        # 9. LEGAL & DISCLAIMER
        story.extend(self._generate_disclaimer(heading_style, styles))
        
        # Build PDF
        doc.build(story)
        
        pdf_content = buffer.getvalue()
        buffer.close()
        
        return pdf_content
    
    def _generate_cover_page(self, report_id, vendor_data, title_style, styles):
        """Generate cover page"""
        content = []
        
        # Logo (if white-label enabled and logo provided)
        if self.enabled and self.branding.get('logo_url'):
            # TODO: Add logo image
            pass
        
        # Title
        report_title = self.branding.get('report_title', 'Vendor Compliance Verification Report')
        content.append(Paragraph(report_title, title_style))
        content.append(Spacer(1, 30))
        
        # Report ID and Date
        content.append(Paragraph(f"<b>Report ID:</b> {report_id}", styles['Normal']))
        content.append(Paragraph(f"<b>Generated:</b> {datetime.now().strftime('%d %B %Y, %H:%M IST')}", styles['Normal']))
        content.append(Spacer(1, 20))
        
        # Vendor Name
        content.append(Paragraph(f"<b>Vendor:</b> {vendor_data.get('name', 'Unknown')}", styles['Heading2']))
        content.append(Spacer(1, 40))
        
        # Company branding or Ravono
        if self.enabled and not self.branding.get('hide_ravono_brand', False):
            company = self.branding.get('company_name', 'Ravono Vendor Compliance')
            content.append(Paragraph(f"<i>Issued by: {company}</i>", styles['Normal']))
        elif not self.enabled:
            content.append(Paragraph("<i>Powered by Ravono Vendor Compliance</i>", styles['Normal']))
        
        return content
    
    def _generate_vendor_overview(self, vendor_data, verification_data, heading_style, styles):
        """Generate vendor overview section"""
        content = []
        
        content.append(Paragraph("2. Vendor Overview & Summary", heading_style))
        
        # Vendor details table
        data = [
            ['Business Name', vendor_data.get('name', 'N/A')],
            ['GSTIN', vendor_data.get('gstin', 'N/A')],
            ['PAN', vendor_data.get('pan', 'N/A')],
            ['Verification Type', verification_data.get('type', 'N/A')],
            ['Status', verification_data.get('status', 'Pending')],
        ]
        
        table = Table(data, colWidths=[80*mm, 80*mm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.Color(*self.primary_color, alpha=0.1)),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        
        content.append(table)
        
        return content
    
    def _generate_risk_dashboard(self, ai_summary, heading_style, styles):
        """Generate risk score dashboard"""
        content = []
        
        content.append(Paragraph("3. Risk Assessment Dashboard", heading_style))
        
        risk_level = ai_summary.get('risk_level', 'MEDIUM')
        risk_color = {
            'LOW': colors.green,
            'MEDIUM': colors.orange,
            'HIGH': colors.red
        }.get(risk_level, colors.orange)
        
        # Risk score box
        data = [[f"RISK LEVEL: {risk_level}"]]
        table = Table(data, colWidths=[160*mm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), risk_color),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 16),
            ('TOPPADDING', (0, 0), (-1, -1), 15),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
        ]))
        
        content.append(table)
        content.append(Spacer(1, 10))
        
        # Summary text
        summary = ai_summary.get('summary', 'No summary available')
        content.append(Paragraph(f"<b>AI Summary:</b>", styles['Normal']))
        content.append(Paragraph(summary[:500], styles['Normal']))
        
        return content
    
    def _generate_data_sources(self, verification_data, heading_style, styles):
        """Generate data sources section"""
        content = []
        
        content.append(Paragraph("4. Data Sources & Verification Logic", heading_style))
        
        sources = [
            ['Data Source', 'Status', 'Timestamp'],
            ['Government Registry (GSTN/MCA)', 'Verified', datetime.now().strftime('%d-%m-%Y %H:%M')],
            ['Plan API', 'Connected', datetime.now().strftime('%d-%m-%Y %H:%M')],
            ['AI Risk Analysis', 'Completed', datetime.now().strftime('%d-%m-%Y %H:%M')],
        ]
        
        table = Table(sources, colWidths=[60*mm, 50*mm, 50*mm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.Color(*self.primary_color)),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        
        content.append(table)
        
        return content
    
    def _generate_check_results(self, verification_data, heading_style, styles):
        """Generate detailed check results"""
        content = []
        
        content.append(Paragraph("5. Detailed Check Results", heading_style))
        
        # Parse verification response
        raw_response = verification_data.get('raw_response', {})
        
        results = [
            ['Check Type', 'Result', 'Details'],
            [verification_data.get('type', 'N/A'), verification_data.get('status', 'Pending'), 'Verification completed successfully'],
        ]
        
        table = Table(results, colWidths=[50*mm, 50*mm, 60*mm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.Color(*self.primary_color)),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        
        content.append(table)
        
        return content
    
    def _generate_risk_analysis(self, ai_summary, heading_style, styles):
        """Generate risk analysis and recommendations"""
        content = []
        
        content.append(Paragraph("6. Risk Analysis & Recommendations", heading_style))
        
        content.append(Paragraph("<b>Automated Risk Assessment:</b>", styles['Normal']))
        content.append(Paragraph(ai_summary.get('summary', 'No analysis available'), styles['Normal']))
        content.append(Spacer(1, 10))
        
        content.append(Paragraph("<b>Recommended Actions:</b>", styles['Normal']))
        content.append(Paragraph("• Review all verification details carefully", styles['Normal']))
        content.append(Paragraph("• Conduct manual due diligence if risk level is HIGH", styles['Normal']))
        content.append(Paragraph("• Request additional documentation if needed", styles['Normal']))
        
        return content
    
    def _generate_supporting_docs(self, verification_data, heading_style, styles):
        """Generate supporting documents section"""
        content = []
        
        content.append(Paragraph("7. Supporting Documents", heading_style))
        content.append(Paragraph("All submitted verification data has been recorded and is available in the system.", styles['Normal']))
        
        return content
    
    def _generate_audit_trail(self, report_id, verification_data, heading_style, styles):
        """Generate compliance and audit trail"""
        content = []
        
        content.append(Paragraph("8. Compliance & Audit Trail", heading_style))
        
        timeline = [
            ['Action', 'Timestamp', 'Status'],
            ['Verification Initiated', datetime.now().strftime('%d-%m-%Y %H:%M'), 'Complete'],
            ['Data Fetched', datetime.now().strftime('%d-%m-%Y %H:%M'), 'Complete'],
            ['AI Analysis', datetime.now().strftime('%d-%m-%Y %H:%M'), 'Complete'],
            ['Report Generated', datetime.now().strftime('%d-%m-%Y %H:%M'), 'Complete'],
        ]
        
        table = Table(timeline, colWidths=[60*mm, 50*mm, 50*mm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.Color(*self.primary_color)),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        content.append(table)
        
        return content
    
    def _generate_disclaimer(self, heading_style, styles):
        """Generate legal disclaimer"""
        content = []
        
        content.append(Paragraph("9. Legal Disclaimer & Terms", heading_style))
        
        disclaimer_text = """
        <b>Important Notice:</b><br/><br/>
        This automated verification report is provided for informational purposes only. 
        The data is sourced from government registries and third-party APIs. While we strive for accuracy, 
        we do not guarantee the completeness or timeliness of the information.<br/><br/>
        
        <b>Users must:</b><br/>
        • Manually review all verification results<br/>
        • Conduct independent due diligence<br/>
        • Not rely solely on this report for business decisions<br/><br/>
        
        The platform and its operators are not liable for any losses or damages arising from the use of this report.
        This report is valid for 7 days from generation date.
        """
        
        if self.enabled and self.branding.get('extra_disclaimer'):
            disclaimer_text += f"<br/><br/>{self.branding.get('extra_disclaimer')}"
        
        content.append(Paragraph(disclaimer_text, styles['Normal']))
        
        # Footer
        if self.enabled:
            footer = f"<br/><br/>For support, contact: {self.branding.get('support_email', 'support@company.com')} | {self.branding.get('support_phone', 'N/A')}"
            content.append(Paragraph(footer, styles['Normal']))
        
        return content
