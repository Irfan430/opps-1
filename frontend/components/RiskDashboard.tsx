'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react'

export function RiskDashboard() {
  const [riskData, setRiskData] = useState({
    overallRisk: 72,
    criticalVulns: 5,
    highRiskAssets: 12,
    complianceScore: 85,
    trends: {
      risk: -5,
      vulnerabilities: 2,
      compliance: 3
    }
  })

  const [recentIncidents, setRecentIncidents] = useState([
    { id: 1, type: 'Phishing', severity: 'High', timestamp: '2 hours ago', status: 'Active' },
    { id: 2, type: 'Malware', severity: 'Critical', timestamp: '4 hours ago', status: 'Contained' },
    { id: 3, type: 'Data Breach', severity: 'Medium', timestamp: '1 day ago', status: 'Resolved' },
  ])

  const riskCategories = [
    { name: 'Network Security', score: 78, color: 'bg-warning-500' },
    { name: 'Data Protection', score: 85, color: 'bg-success-500' },
    { name: 'Access Control', score: 65, color: 'bg-danger-500' },
    { name: 'Compliance', score: 90, color: 'bg-primary-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Risk Score</p>
              <p className="text-2xl font-bold text-danger-600">{riskData.overallRisk}%</p>
              <div className="flex items-center mt-1">
                {riskData.trends.risk < 0 ? (
                  <TrendingDown className="w-4 h-4 text-success-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-danger-500" />
                )}
                <span className={`text-sm ml-1 ${
                  riskData.trends.risk < 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {Math.abs(riskData.trends.risk)}% this week
                </span>
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-danger-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Vulnerabilities</p>
              <p className="text-2xl font-bold text-danger-600">{riskData.criticalVulns}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-danger-500" />
                <span className="text-sm ml-1 text-danger-600">
                  +{riskData.trends.vulnerabilities} this week
                </span>
              </div>
            </div>
            <Shield className="w-8 h-8 text-danger-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Assets</p>
              <p className="text-2xl font-bold text-warning-600">{riskData.highRiskAssets}</p>
              <p className="text-sm text-gray-500 mt-1">Requires attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-success-600">{riskData.complianceScore}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-success-500" />
                <span className="text-sm ml-1 text-success-600">
                  +{riskData.trends.compliance}% this month
                </span>
              </div>
            </div>
            <Shield className="w-8 h-8 text-success-600" />
          </div>
        </div>
      </div>

      {/* Risk Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk by Category</h3>
          <div className="space-y-4">
            {riskCategories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>{category.name}</span>
                  <span>{category.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security Incidents */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Incidents</h3>
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{incident.type}</p>
                  <p className="text-sm text-gray-600">{incident.timestamp}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    incident.severity === 'Critical' ? 'bg-danger-100 text-danger-800' :
                    incident.severity === 'High' ? 'bg-warning-100 text-warning-800' :
                    'bg-primary-100 text-primary-800'
                  }`}>
                    {incident.severity}
                  </span>
                  <p className={`text-sm mt-1 ${
                    incident.status === 'Active' ? 'text-danger-600' :
                    incident.status === 'Contained' ? 'text-warning-600' :
                    'text-success-600'
                  }`}>
                    {incident.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Trends Chart Placeholder */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Trends (Last 30 Days)</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Risk trend chart will be displayed here</p>
        </div>
      </div>
    </div>
  )
}