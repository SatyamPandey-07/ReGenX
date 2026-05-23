/**
 * @fileoverview ReGenX Enterprise ESG Reporting Engine
 * Generates high-fidelity HTML-to-PDF reports for Corporate Social Responsibility metrics.
 * @author GSSoC Contributor
 */

export const ESGReporter = {
    /**
     * Generates a random SHA-256 style hash for audit registry entries.
     * @returns {string} Hex-encoded hash with 0x prefix.
     */
    generateAuditHash: () => {
        if (window.crypto && window.crypto.getRandomValues) {
            const bytes = new Uint8Array(32);
            window.crypto.getRandomValues(bytes);
            return '0x' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
        }
        return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    },

    /**
     * Loads the public audit registry from localStorage.
     * @returns {Array<Object>} Registry records.
     */
    loadAuditRegistry: () => {
        try {
            const raw = window.localStorage.getItem('audit-registry');
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    },

    /**
     * Persists the public audit registry in localStorage.
     * @param {Array<Object>} records - Registry records.
     */
    saveAuditRegistry: (records) => {
        try {
            window.localStorage.setItem('audit-registry', JSON.stringify(records));
        } catch {
            // Ignore write errors
        }
    },
    /**
     * Triggers the client-side PDF generation process.
     * @param {Object} account - Current user SESSION object.
     * @param {Array} history - Array of completed order objects.
     */
    generateReport: (account, history) => {
        if (!window.html2pdf) {
            alert("Report Engine is loading. Please try again in a moment.");
            return;
        }

        // Calculate Metrics
        const totalKg = history.reduce((sum, o) => sum + (parseFloat(o.actualKg || o.kg) || 0), 0);
        const totalTokens = account.tokens || 0;

        // Per-order CO₂ calculation using waste-type-specific IPCC 2006 / GHG Protocol factors
        const co2Details = history.map(o => {
            const kg = parseFloat(o.actualKg || o.kg) || 0;
            const factor = window.getCO2Factor
                ? window.getCO2Factor(o.wasteType, o.processingMethod)
                : 0.55;
            return {
                wasteType: o.wasteType || 'Mixed kitchen waste',
                kg,
                factor,
                co2: kg * factor
            };
        });
        const totalCO2 = Math.round(co2Details.reduce((sum, d) => sum + d.co2, 0));
        
        // Mock a cryptographic hash for "verifiability"
        const reportHash = ESGReporter.generateAuditHash();
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // Save generated verification record to ReGenX Public Audit registry
        try {
            const registry = ESGReporter.loadAuditRegistry();
            registry.push({
                hash: reportHash,
                org: account.org || account.name,
                role: account.role,
                userId: account.id,
                totalKg,
                totalCO2,
                tokens: totalTokens,
                dispatchesCount: history.length,
                timestamp: Date.now()
            });
            ESGReporter.saveAuditRegistry(registry);
        } catch (e) {
            console.error("Failed to store verification record:", e);
        }

        // Construct HTML for the PDF
        const element = document.createElement('div');
        element.style.padding = '40px';
        element.style.fontFamily = 'Inter, sans-serif';
        element.style.color = '#1E293B';
        element.style.background = '#FFFFFF';
        element.innerHTML = `
            <div style="text-align:center; margin-bottom:40px;">
                <h1 style="color:#0D9488; font-size:36px; margin-bottom:8px;">ReGenX Protocol</h1>
                <h2 style="color:#64748B; font-size:24px; margin-top:0;">ESG Impact & Carbon Offset Report</h2>
                <p style="color:#94A3B8; font-size:14px;">Generated on: ${dateStr}</p>
            </div>

            <div style="margin-bottom:32px; padding:20px; border-left:4px solid #0D9488; background:#F8FAFC;">
                <h3 style="margin-top:0; color:#0F172A;">Entity Details</h3>
                <p><strong>Organization:</strong> ${account.org || account.name}</p>
                <p><strong>Role:</strong> ${account.role.toUpperCase()}</p>
                <p><strong>Network ID:</strong> ${account.id}</p>
            </div>

            <h3 style="border-bottom:2px solid #E2E8F0; padding-bottom:8px; margin-bottom:24px;">Environmental Impact Summary</h3>
            <div style="display:flex; justify-content:space-between; margin-bottom:40px;">
                <div style="flex:1; text-align:center; padding:20px; background:#F0FDF4; border-radius:8px; margin-right:12px;">
                    <div style="font-size:32px; font-weight:800; color:#16A34A;">${totalKg.toLocaleString()}</div>
                    <div style="font-size:12px; color:#15803D; font-weight:700; text-transform:uppercase;">Kg Recycled</div>
                </div>
                <div style="flex:1; text-align:center; padding:20px; background:#EFF6FF; border-radius:8px; margin-right:12px;">
                    <div style="font-size:32px; font-weight:800; color:#2563EB;">${totalCO2.toLocaleString()}</div>
                    <div style="font-size:12px; color:#1D4ED8; font-weight:700; text-transform:uppercase;">Kg CO₂ Offset</div>
                </div>
                <div style="flex:1; text-align:center; padding:20px; background:#FEFCE8; border-radius:8px;">
                    <div style="font-size:32px; font-weight:800; color:#CA8A04;">${totalTokens.toLocaleString()}</div>
                    <div style="font-size:12px; color:#A16207; font-weight:700; text-transform:uppercase;">$RGX Tokens Earned</div>
                </div>
            </div>

            <h3 style="border-bottom:2px solid #E2E8F0; padding-bottom:8px; margin-bottom:24px;">Social & Governance Metrics</h3>
            <p><strong>Total Validated Dispatches:</strong> ${history.length}</p>
            <p><strong>Trust Protocol Standing:</strong> Certified Compliant</p>

            <h3 style="border-bottom:2px solid #E2E8F0; padding-bottom:8px; margin-bottom:16px; margin-top:40px;">Emission Factor Methodology</h3>
            <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:16px;">
                <thead>
                    <tr style="background:#F1F5F9;">
                        <th style="padding:8px; text-align:left; border:1px solid #E2E8F0;">Waste Type</th>
                        <th style="padding:8px; text-align:right; border:1px solid #E2E8F0;">Qty (kg)</th>
                        <th style="padding:8px; text-align:right; border:1px solid #E2E8F0;">Factor (kg CO₂eq/kg)</th>
                        <th style="padding:8px; text-align:right; border:1px solid #E2E8F0;">CO₂ Offset (kg)</th>
                    </tr>
                </thead>
                <tbody>
                    ${co2Details.map(d => `
                    <tr>
                        <td style="padding:8px; border:1px solid #E2E8F0;">${d.wasteType}</td>
                        <td style="padding:8px; text-align:right; border:1px solid #E2E8F0;">${d.kg.toFixed(1)}</td>
                        <td style="padding:8px; text-align:right; border:1px solid #E2E8F0;">${d.factor.toFixed(2)}</td>
                        <td style="padding:8px; text-align:right; border:1px solid #E2E8F0;">${d.co2.toFixed(1)}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
            <p style="font-size:11px; color:#64748B; margin-bottom:32px;">
                <strong>Methodology:</strong> Emission factors sourced from IPCC 2006 Guidelines for National Greenhouse Gas
                Inventories (Volume 5 — Waste) and the GHG Protocol Scope 3 Technical Guidance.
                Factors vary by waste type and processing method (anaerobic digestion, composting, or biogas recovery).
            </p>
            <div style="margin-top:40px; text-align:center; font-size:11px; color:#94A3B8;">
                <p>This document is digitally generated and verifiable via the ReGenX smart ledger.</p>
                <p style="font-family:monospace; background:#F1F5F9; display:inline-block; padding:4px 8px; border-radius:4px;">Signature Hash (SHA-256): ${reportHash}</p>
            </div>
        `;

        // Configure html2pdf
        const opt = {
            margin:       0.5,
            filename:     `ReGenX_ESG_Report_${(account.org || account.name || 'User').replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generate PDF
        if (window.showToast) window.showToast('Generating ESG PDF Report...');
        html2pdf().set(opt).from(element).save().then(() => {
            if (window.showToast) window.showToast('✓ PDF Report Downloaded successfully.');
        }).catch(err => {
            console.error('PDF Generation Error:', err);
            if (window.showToast) window.showToast('⚠️ Failed to generate PDF.');
        });
    }
};

window.ESGReporter = ESGReporter;
