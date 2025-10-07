'use client'

import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, Filter, Search, Eye } from 'lucide-react'

export function AlertsPanel() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const alerts = [
    {
      id: 'ALT-001',
      title: 'Suspicious Login Activity Detected',
      description: 'Multiple failed login attempts from unusual IP address',
      severity: 'High',
      status: 'Active',
      timestamp: '2024-01-20 14:30:00',
      source: 'Authentication System',
      affectedAssets: ['Web Portal', 'User Accounts']
    },
    {
      id: 'ALT-002',
      title: 'Malware Signature Detected',
      description: 'Known malware signature found in email attachment',
      severity: 'Critical',
      status: 'Investigating',
      timestamp: '2024-01-20 13:45:00',
      source: 'Email Security Gateway',
      affectedAssets: ['Email System']
    },
    {
      id: 'ALT-003',
      title: 'Unusual Network Traffic Pattern',
      description: 'Abnormal data transfer volumes detected',
      severity: 'Medium',
      status: 'Resolved',
      timestamp: '2024-01-20 12:15:00',
      source: 'Network Monitoring',
      affectedAssets: ['Database Server']
    },
    {
      id: 'ALT-004',
      title: 'Failed Privilege Escalation Attempt',
      description: 'User attempted to access restricted resources',
      severity: 'High',
      status: 'Active',
      timestamp: '2024-01-20 11:30:00',
      source: 'Access Control System',
      affectedAssets: ['File Server', 'Admin Panel']
    },
    {
      id: 'ALT-005',
      title: 'Certificate Expiration Warning',
      description: 'SSL certificate will expire in 7 days',
      severity: 'Low',
      status: 'Acknowledged',
      timestamp: '2024-01-20 09:00:00',
      source: 'Certificate Monitor',
      affectedAssets: ['Web Server']
    }
  ]

  const incidents = [
    {
      id: 'INC-001',
      title: 'Data Breach Investigation',
      description: 'Potential unauthorized access to customer database',
      priority: 'P1',
      assignee: 'Security Team',
      created: '2024-01-19 16:20:00',
      updated: '2024-01-20 10:15:00',
      status: 'In Progress'
    },
    {
      id: 'INC-002',
      title: 'Phishing Campaign Response',
      description: 'Company-wide phishing email campaign detected',
      priority: 'P2',
      assignee: 'Email Security Team',
      created: '2024-01-19 14:30:00',
      updated: '2024-01-19 18:45:00',
      status: 'Resolved'
    }
  ]

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.severity.toLowerCase() === filter.toLowerCase()
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-danger-600 bg-danger-100'
      case 'high': return 'text-warning-600 bg-warning-100'
      case 'medium': return 'text-primary-600 bg-primary-100'
      case 'low': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-danger-600 bg-danger-100'
      case 'investigating': return 'text-warning-600 bg-warning-100'
      case 'acknowledged': return 'text-primary-600 bg-primary-100'
      case 'resolved': return 'text-success-600 bg-success-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-danger-600">
                {alerts.filter(a => a.status === 'Active').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-danger-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Severity</p>
              <p className="text-2xl font-bold text-danger-600">
                {alerts.filter(a => a.severity === 'Critical').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-danger-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Investigation</p>
              <p className="text-2xl font-bold text-warning-600">
                {alerts.filter(a => a.status === 'Investigating').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-warning-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-success-600">
                {alerts.filter(a => a.status === 'Resolved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input w-auto"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Active Security Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Alerts</h3>
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">{alert.id}</span>
                    <span className={`badge text-xs ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`badge text-xs ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Source: {alert.source}</span>
                    <span>•</span>
                    <span>{alert.timestamp}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Affected Assets: </span>
                    {alert.affectedAssets.map((asset, index) => (
                      <span key={asset} className="text-sm text-gray-700">
                        {asset}{index < alert.affectedAssets.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Incidents */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Security Incidents</h3>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">{incident.id}</span>
                    <span className={`badge text-xs ${
                      incident.priority === 'P1' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {incident.priority}
                    </span>
                    <span className={`badge text-xs ${
                      incident.status === 'Resolved' ? 'badge-success' : 'badge-primary'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{incident.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{incident.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>Assignee: {incident.assignee}</div>
                    <div>Created: {incident.created}</div>
                    <div>Last Updated: {incident.updated}</div>
                  </div>
                </div>
                <div className="ml-4">
                  <button className="btn-primary">Manage</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}