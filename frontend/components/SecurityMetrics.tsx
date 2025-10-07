'use client'

import React from 'react'
import { BarChart3, TrendingUp, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export function SecurityMetrics() {
  const metrics = {
    securityPosture: 78,
    vulnerabilityScore: 65,
    complianceScore: 92,
    incidentResponse: 85,
    threatDetection: 88,
    dataProtection: 90
  }

  const complianceFrameworks = [
    { name: 'SOC 2', score: 95, status: 'Compliant' },
    { name: 'ISO 27001', score: 88, status: 'Compliant' },
    { name: 'GDPR', score: 92, status: 'Compliant' },
    { name: 'PCI DSS', score: 76, status: 'Partial' },
    { name: 'HIPAA', score: 85, status: 'Compliant' },
  ]

  const securityControls = [
    { category: 'Network Security', implemented: 12, total: 15, effectiveness: 85 },
    { category: 'Access Management', implemented: 8, total: 10, effectiveness: 90 },
    { category: 'Data Encryption', implemented: 6, total: 8, effectiveness: 95 },
    { category: 'Monitoring & Logging', implemented: 9, total: 12, effectiveness: 75 },
    { category: 'Incident Response', implemented: 7, total: 9, effectiveness: 80 },
  ]

  const recentAssessments = [
    { name: 'Penetration Test', date: '2024-01-15', score: 82, status: 'Passed' },
    { name: 'Vulnerability Scan', date: '2024-01-10', score: 76, status: 'Needs Attention' },
    { name: 'Compliance Audit', date: '2024-01-05', score: 91, status: 'Passed' },
    { name: 'Security Training', date: '2024-01-01', score: 88, status: 'Passed' },
  ]

  return (
    <div className="space-y-6">
      {/* Key Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Security Posture</h3>
            <Shield className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {metrics.securityPosture}%
            </div>
            <p className="text-sm text-gray-600">Overall Security Score</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${metrics.securityPosture}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vulnerability Score</h3>
            <AlertTriangle className="w-6 h-6 text-warning-600" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">
              {metrics.vulnerabilityScore}%
            </div>
            <p className="text-sm text-gray-600">Risk Level</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-warning-500 h-2 rounded-full"
                style={{ width: `${metrics.vulnerabilityScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Score</h3>
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {metrics.complianceScore}%
            </div>
            <p className="text-sm text-gray-600">Regulatory Compliance</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full"
                style={{ width: `${metrics.complianceScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Controls Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Controls Implementation</h3>
        <div className="space-y-4">
          {securityControls.map((control) => (
            <div key={control.category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{control.category}</h4>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {control.implemented}/{control.total} implemented
                  </span>
                  <span className="badge badge-primary">
                    {control.effectiveness}% effective
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Implementation</span>
                    <span>{Math.round((control.implemented / control.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(control.implemented / control.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Effectiveness</span>
                    <span>{control.effectiveness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${control.effectiveness}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Frameworks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Frameworks</h3>
          <div className="space-y-3">
            {complianceFrameworks.map((framework) => (
              <div key={framework.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {framework.status === 'Compliant' ? (
                    <CheckCircle className="w-5 h-5 text-success-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-warning-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{framework.name}</p>
                    <p className="text-sm text-gray-600">{framework.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">
                    {framework.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Assessments</h3>
          <div className="space-y-3">
            {recentAssessments.map((assessment) => (
              <div key={assessment.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{assessment.name}</p>
                  <p className="text-sm text-gray-600">{assessment.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {assessment.score}%
                  </div>
                  <span className={`badge text-xs ${
                    assessment.status === 'Passed' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {assessment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trends Chart Placeholder */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Security Metrics Trends</h3>
          <BarChart3 className="w-6 h-6 text-gray-400" />
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Security metrics trend chart will be displayed here</p>
        </div>
      </div>
    </div>
  )
}